// Adapted from examples/battleship/ui/src/providers/midnight-providers.tsx in midnightntwrk/midnight-examples; modified for strongChar.
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { createContractProviders, type ContractProviders, type ProvingMode } from '../midnight/providers';
import { proving } from './proving';
import { CONTEST_ZK, JOBS_ZK, type ContestCircuits, type JobsCircuits } from '../midnight/contracts';
import { WrongPassphraseError } from '../midnight/private-state';
import { errorMessage } from '../lib/errors';
import { useWallet } from './useWallet';

/** One providers bundle per contract, built for the same wallet, proving mode and passphrase. */
export interface ProviderBundles {
  contest: ContractProviders<ContestCircuits>;
  jobs: ContractProviders<JobsCircuits>;
  networkId: string;
}

interface MidnightProvidersContextValue {
  /** Null until the wallet is connected and the passphrase has been accepted. */
  bundles: ProviderBundles | null;
  error: string | null;
  provingMode: ProvingMode;
  setProvingMode: (next: ProvingMode) => void;
  /** True until a passphrase has been entered this session. */
  locked: boolean;
  /** Why the last unlock() failed (a wrong passphrase), if it did. */
  unlockError: string | null;
  unlock: (passphrase: string) => void;
}

const MidnightProvidersContext = createContext<MidnightProvidersContextValue | null>(null);

/**
 * Rebuilds both provider bundles whenever the wallet connection or the proving
 * mode changes. Components read them with useMidnightProviders().
 */
export function MidnightProvidersProvider({ children }: { children: ReactNode }) {
  const { connection } = useWallet();
  const api = connection.status === 'connected' ? connection.api : null;
  const [bundles, setBundles] = useState<ProviderBundles | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [provingMode, setMode] = useState<ProvingMode>(proving.load);
  // Held in memory only: never written to storage. A reload or a disconnect asks again.
  const [passphrase, setPassphrase] = useState<string | null>(null);
  const [unlockError, setUnlockError] = useState<string | null>(null);

  const setProvingMode = useCallback((next: ProvingMode) => {
    setMode(next);
    proving.save(next);
  }, []);

  useEffect(() => {
    if (connection.status === 'disconnected') setPassphrase(null);
  }, [connection.status]);

  useEffect(() => {
    setBundles(null);
    setError(null);
    if (connection.status !== 'connected' || passphrase === null) return;

    const { api: connected, networkId } = connection;
    const options = proving.options(provingMode);
    let cancelled = false;
    const build = async () => {
      // One after the other: the first call settles the passphrase against the store before the second opens it.
      const contest = await createContractProviders<ContestCircuits>(connected, options, passphrase, CONTEST_ZK);
      const jobs = await createContractProviders<JobsCircuits>(connected, options, passphrase, JOBS_ZK);
      return { contest, jobs, networkId };
    };
    build().then(
      (next) => {
        if (cancelled) return;
        setBundles(next);
        setUnlockError(null);
      },
      (err: unknown) => {
        if (cancelled) return;
        if (err instanceof WrongPassphraseError) {
          // Back to the passphrase prompt, with the reason.
          setPassphrase(null);
          setUnlockError(err.message);
        } else {
          setError(errorMessage(err, 'Could not set up the connection to Midnight.'));
        }
      },
    );

    return () => {
      cancelled = true;
    };
    // `connection` is a new object only when the wallet state changes.
  }, [connection, provingMode, passphrase]);

  const unlock = useCallback((next: string) => {
    setUnlockError(null);
    setPassphrase(next);
  }, []);

  return (
    <MidnightProvidersContext.Provider
      value={{
        // A bundle built for an earlier connection is never handed out.
        bundles: api ? bundles : null,
        error,
        provingMode,
        setProvingMode,
        locked: passphrase === null,
        unlockError,
        unlock,
      }}
    >
      {children}
    </MidnightProvidersContext.Provider>
  );
}

export function useMidnightProviders(): MidnightProvidersContextValue {
  const context = useContext(MidnightProvidersContext);
  if (!context) throw new Error('useMidnightProviders must be used within a MidnightProvidersProvider');
  return context;
}
