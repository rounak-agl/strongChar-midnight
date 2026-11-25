// Adapted from examples/battleship/ui/src/providers/wallet-context.tsx in midnightntwrk/midnight-examples; modified for strongChar.
import { createContext, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import type { ConnectedAPI, InitialAPI } from '@midnight-ntwrk/dapp-connector-api';
import { errorMessage } from '../lib/errors';
import { storage } from '../lib/storage';

const AUTOCONNECT_KEY = 'strongchar:wallet-autoconnect';
const NETWORK_KEY = 'strongchar:network-id';
const WALLET_KEY = 'strongchar:wallet';

/** Test networks only. `undeployed` is the local devnet from compose.yml. */
export const NETWORK_IDS = ['undeployed', 'preview', 'preprod'] as const;
export type NetworkId = (typeof NETWORK_IDS)[number];

export type Connection =
  | { status: 'disconnected' }
  | { status: 'connecting' }
  | { status: 'connected'; api: ConnectedAPI; networkId: string; address: string }
  | { status: 'error'; message: string };

export interface WalletContextValue {
  connection: Connection;
  /** Network id to request when connecting (the user picks it before connecting). */
  requestedNetworkId: NetworkId;
  setRequestedNetworkId: (id: NetworkId) => void;
  /** Wallet extensions detected in the page, and which one to connect to. */
  wallets: DetectedWallet[];
  selectedWalletKey: string | null;
  setSelectedWalletKey: (key: string) => void;
  connect: () => Promise<void>;
  disconnect: () => void;
}

export const WalletContext = createContext<WalletContextValue | null>(null);

/** A wallet extension found in `window.midnight`. */
export interface DetectedWallet {
  key: string;
  name: string;
  api: InitialAPI;
}

/**
 * Every Midnight wallet injects itself into `window.midnight` under its own
 * key (a UUID). A wallet may also alias itself under a second key pointing at
 * the same object (Lace adds `mnLace`, for example). Several can be installed
 * at once, so list them all, drop aliases, and let the user pick.
 */
export function detectWallets(): DetectedWallet[] {
  if (typeof window === 'undefined' || !window.midnight) return [];
  const seen = new Set<InitialAPI>();
  const wallets: DetectedWallet[] = [];
  for (const [key, api] of Object.entries(window.midnight)) {
    if (api == null || typeof api.connect !== 'function' || seen.has(api)) continue;
    seen.add(api);
    wallets.push({ key, name: api.name || key, api });
  }
  return wallets;
}

/**
 * The user's remembered choice if that wallet is still installed, otherwise
 * the first one found, in `window.midnight` order.
 */
function preferredWalletKey(wallets: DetectedWallet[], saved: string | null): string | null {
  if (saved && wallets.some((w) => w.key === saved)) return saved;
  return wallets[0]?.key ?? null;
}

function initialNetworkId(): NetworkId {
  const saved = storage.get(NETWORK_KEY);
  if (NETWORK_IDS.includes(saved as NetworkId)) return saved as NetworkId;
  return import.meta.env.DEV ? 'undeployed' : 'preview';
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [connection, setConnection] = useState<Connection>({ status: 'disconnected' });
  const [requestedNetworkId, setRequested] = useState<NetworkId>(initialNetworkId);

  const [wallets, setWallets] = useState<DetectedWallet[]>(detectWallets);
  const [selectedWalletKey, setSelectedWallet] = useState<string | null>(() =>
    preferredWalletKey(detectWallets(), storage.get(WALLET_KEY)),
  );
  // Each connect or disconnect starts a new attempt; a slower, older one must not overwrite it.
  const attempt = useRef(0);

  const setRequestedNetworkId = useCallback((id: NetworkId) => {
    setRequested(id);
    storage.set(NETWORK_KEY, id);
  }, []);

  const setSelectedWalletKey = useCallback((key: string) => {
    setSelectedWallet(key);
    storage.set(WALLET_KEY, key);
  }, []);

  // Extensions can inject after the page script runs, so re-scan briefly.
  useEffect(() => {
    let tries = 0;
    const id = window.setInterval(() => {
      const found = detectWallets();
      setWallets((prev) => (prev.length === found.length ? prev : found));
      setSelectedWallet((prev) => prev ?? preferredWalletKey(found, storage.get(WALLET_KEY)));
      if (++tries >= 10) window.clearInterval(id);
    }, 300);
    return () => window.clearInterval(id);
  }, []);

  const connect = useCallback(async () => {
    const mine = ++attempt.current;
    const settle = (next: Connection) => {
      if (mine === attempt.current) setConnection(next);
    };
    setConnection({ status: 'connecting' });

    const found = detectWallets();
    const key = preferredWalletKey(found, selectedWalletKey);
    const wallet = found.find((w) => w.key === key)?.api;
    if (!wallet) {
      settle({ status: 'error', message: 'No Midnight wallet found. Install Lace (Midnight) and refresh.' });
      return;
    }

    try {
      // connect(networkId) asks the user to authorize this site for that
      // network. It rejects if the wallet is set to a different one, so the
      // requested id has to match the wallet's current network.
      const api = await wallet.connect(requestedNetworkId);
      const config = await api.getConfiguration();
      const { unshieldedAddress } = await api.getUnshieldedAddress();
      if (mine !== attempt.current) return;
      settle({ status: 'connected', api, networkId: config.networkId, address: unshieldedAddress });
      storage.set(AUTOCONNECT_KEY, 'true');
    } catch (err: unknown) {
      settle({ status: 'error', message: errorMessage(err, 'Could not connect to the wallet.') });
    }
  }, [requestedNetworkId, selectedWalletKey]);

  const disconnect = useCallback(() => {
    attempt.current += 1;
    storage.remove(AUTOCONNECT_KEY);
    setConnection({ status: 'disconnected' });
  }, []);

  // Reconnect on page load if the user connected last time. Deliberately runs
  // only on mount, not every time the requested network changes.
  useEffect(() => {
    if (storage.get(AUTOCONNECT_KEY) === 'true') void connect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <WalletContext.Provider
      value={{
        connection,
        requestedNetworkId,
        setRequestedNetworkId,
        wallets,
        selectedWalletKey,
        setSelectedWalletKey,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
