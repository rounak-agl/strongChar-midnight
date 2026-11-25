// Adapted from examples/battleship/ui/src/__tests__/wallet-context.test.tsx in midnightntwrk/midnight-examples; modified for strongChar.
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WalletProvider } from '../wallet/WalletContext';
import { useWallet } from '../wallet/useWallet';
import { WalletWidget } from '../wallet/WalletWidget';

function TestConsumer() {
  const { connection, connect, disconnect, setRequestedNetworkId } = useWallet();
  return (
    <div>
      <span data-testid="status">{connection.status}</span>
      <span data-testid="address">{connection.status === 'connected' ? connection.address : 'none'}</span>
      <span data-testid="network">{connection.status === 'connected' ? connection.networkId : 'none'}</span>
      <button onClick={() => setRequestedNetworkId('preprod')}>use preprod</button>
      <button onClick={() => void connect()}>connect now</button>
      <button onClick={disconnect}>disconnect now</button>
    </div>
  );
}

const win = window as unknown as { midnight?: Record<string, unknown> };

const wallet = (name: string, connect: ReturnType<typeof vi.fn>) => ({
  name,
  apiVersion: '4.0.1',
  icon: '',
  rdns: `com.example.${name}`,
  connect,
});

const connectedApi = (networkId: string) => ({
  getConfiguration: vi.fn().mockResolvedValue({ networkId }),
  getUnshieldedAddress: vi.fn().mockResolvedValue({ unshieldedAddress: 'mn_addr_test1abc123' }),
});

const renderWallet = () =>
  render(
    <WalletProvider>
      <TestConsumer />
      <WalletWidget />
    </WalletProvider>,
  );

const status = () => screen.getByTestId('status');

describe('wallet connection', () => {
  beforeEach(() => {
    localStorage.clear();
    delete win.midnight;
  });

  it('starts disconnected and points to Lace when no wallet is installed', () => {
    renderWallet();
    expect(status()).toHaveTextContent('disconnected');
    expect(screen.getByRole('link', { name: 'Install Lace (Midnight)' })).toBeInTheDocument();
  });

  it('explains a missing wallet on connect', async () => {
    renderWallet();
    await userEvent.click(screen.getByText('connect now'));
    expect(status()).toHaveTextContent('error');
    expect(screen.getByRole('alert')).toHaveTextContent('No Midnight wallet found');
  });

  it("connects on the requested network and reads the wallet's address", async () => {
    const connect = vi.fn().mockResolvedValue(connectedApi('preprod'));
    win.midnight = { 'a-uuid': wallet('a', connect) };
    renderWallet();

    await userEvent.click(screen.getByText('use preprod'));
    await userEvent.click(screen.getByText('connect now'));

    await vi.waitFor(() => expect(status()).toHaveTextContent('connected'));
    expect(connect).toHaveBeenCalledWith('preprod');
    expect(screen.getByTestId('network')).toHaveTextContent('preprod');
    expect(screen.getByTestId('address')).toHaveTextContent('mn_addr_test1abc123');
  });

  it("shows the connector's reason when the wallet refuses", async () => {
    const refusal = { type: 'DAppConnectorAPIError', code: 'Rejected', reason: 'User rejected the connection' };
    win.midnight = { 'a-uuid': wallet('a', vi.fn().mockRejectedValue(refusal)) };
    renderWallet();

    await userEvent.click(screen.getByText('connect now'));

    await vi.waitFor(() => expect(status()).toHaveTextContent('error'));
    expect(screen.getByRole('alert')).toHaveTextContent('User rejected the connection (Rejected)');
  });

  it('lists each wallet once and connects to the one the user picked', async () => {
    const a = vi.fn().mockResolvedValue(connectedApi('undeployed'));
    const b = vi.fn().mockResolvedValue(connectedApi('undeployed'));
    const second = wallet('b', b);
    win.midnight = { 'a-uuid': wallet('a', a), 'b-uuid': second, bAlias: second };
    renderWallet();

    const picker = screen.getByLabelText('Wallet');
    expect(picker.querySelectorAll('option')).toHaveLength(2);
    await userEvent.selectOptions(picker, 'b-uuid');
    await userEvent.click(screen.getByText('connect now'));

    await vi.waitFor(() => expect(status()).toHaveTextContent('connected'));
    expect(b).toHaveBeenCalledWith('undeployed');
    expect(a).not.toHaveBeenCalled();
  });

  it('stays disconnected when a slow connect finishes after a disconnect', async () => {
    let approve: (api: unknown) => void = () => {};
    const connect = vi.fn().mockReturnValue(new Promise((resolve) => (approve = resolve)));
    win.midnight = { 'a-uuid': wallet('a', connect) };
    renderWallet();

    await userEvent.click(screen.getByText('connect now'));
    await userEvent.click(screen.getByText('disconnect now'));
    const api = connectedApi('undeployed');
    approve(api);
    await vi.waitFor(() => expect(api.getUnshieldedAddress).toHaveBeenCalled());

    expect(status()).toHaveTextContent('disconnected');
    expect(localStorage.getItem('strongchar:wallet-autoconnect')).toBeNull();
  });
});
