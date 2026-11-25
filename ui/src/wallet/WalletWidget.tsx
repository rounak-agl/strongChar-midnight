// Adapted from examples/battleship/ui/src/components/wallet-widget.tsx in midnightntwrk/midnight-examples; modified for strongChar.
import { useWallet } from './useWallet';
import { NETWORK_IDS, type NetworkId } from './WalletContext';

const LACE_URL = 'https://www.lace.io';

const NETWORK_NAMES: Record<NetworkId, string> = {
  undeployed: 'Local devnet',
  preview: 'Preview testnet',
  preprod: 'Preprod testnet',
};

const truncate = (address: string) => (address.length <= 24 ? address : `${address.slice(0, 14)}…${address.slice(-6)}`);

export function WalletWidget() {
  const {
    connection,
    connect,
    disconnect,
    requestedNetworkId,
    setRequestedNetworkId,
    wallets,
    selectedWalletKey,
    setSelectedWalletKey,
  } = useWallet();

  if (connection.status === 'connected') {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-ink-soft">{connection.networkId}</span>
        <span className="font-mono text-sm" title={connection.address}>
          {truncate(connection.address)}
        </span>
        <button type="button" className="button" onClick={disconnect}>
          Disconnect
        </button>
      </div>
    );
  }

  const connecting = connection.status === 'connecting';
  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex flex-wrap items-center justify-end gap-2">
        {/* Only offer a choice when more than one Midnight wallet is installed. */}
        {wallets.length > 1 && (
          <select
            className="field"
            aria-label="Wallet"
            value={selectedWalletKey ?? ''}
            onChange={(e) => setSelectedWalletKey(e.target.value)}
          >
            {wallets.map((w) => (
              <option key={w.key} value={w.key}>
                {w.name}
              </option>
            ))}
          </select>
        )}
        {/* The requested network must match the one the wallet is set to. */}
        <select
          className="field"
          aria-label="Network"
          value={requestedNetworkId}
          onChange={(e) => setRequestedNetworkId(e.target.value as NetworkId)}
        >
          {NETWORK_IDS.map((id) => (
            <option key={id} value={id}>
              {NETWORK_NAMES[id]}
            </option>
          ))}
        </select>
        <button type="button" className="button-primary" disabled={connecting} onClick={() => void connect()}>
          {connecting ? 'Connecting…' : 'Connect wallet'}
        </button>
      </div>
      {wallets.length === 0 && (
        <p className="text-sm text-ink-soft">
          <a href={LACE_URL} target="_blank" rel="noreferrer">
            Install Lace (Midnight)
          </a>{' '}
          and refresh.
        </p>
      )}
      {connection.status === 'error' && (
        <p className="max-w-96 text-right text-sm text-wax" role="alert">
          {connection.message}
        </p>
      )}
    </div>
  );
}
