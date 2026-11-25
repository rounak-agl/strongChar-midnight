import { WalletProvider } from './wallet/WalletContext';
import { MidnightProvidersProvider, useMidnightProviders } from './wallet/MidnightProviders';
import { WalletWidget } from './wallet/WalletWidget';
import { PassphraseCard } from './wallet/PassphraseCard';
import { ProvingSettings } from './wallet/ProvingSettings';
import { useWallet } from './wallet/useWallet';
import { deploymentFor } from './deployments';

export function App() {
  return (
    <WalletProvider>
      <MidnightProvidersProvider>
        <header className="border-b border-rule">
          <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3">
            <h1>strongChar</h1>
            <WalletWidget />
          </div>
        </header>
        <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8">
          <Main />
        </main>
      </MidnightProvidersProvider>
    </WalletProvider>
  );
}

function Main() {
  const { connection } = useWallet();
  const { locked, bundles, error } = useMidnightProviders();

  if (connection.status !== 'connected') {
    return (
      <section className="panel">
        <h2>Sealed contests and sealed training jobs</h2>
        <p className="text-ink-soft">
          Pick the network your wallet is set to, then connect. You&apos;ll need test funds on that network to pay fees.
        </p>
      </section>
    );
  }

  const { contest, jobs } = deploymentFor(connection.networkId);
  if (!contest && !jobs) {
    return (
      <p className="panel" role="status">
        strongChar isn&apos;t deployed on {connection.networkId} yet.
      </p>
    );
  }

  return (
    <>
      <section className="panel">
        <h2>Proofs</h2>
        <p className="mb-3 text-ink-soft">Your secrets are only ever used on this machine.</p>
        <ProvingSettings />
      </section>
      {locked ? (
        <PassphraseCard />
      ) : error ? (
        <p className="text-wax" role="alert">
          {error}
        </p>
      ) : (
        <p role="status">{bundles ? 'Ready.' : 'Setting up…'}</p>
      )}
    </>
  );
}
