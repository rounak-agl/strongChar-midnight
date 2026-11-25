import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createContractProviders } from '../midnight/providers';
import { WrongPassphraseError } from '../midnight/private-state';
import { MidnightProvidersProvider, useMidnightProviders } from '../wallet/MidnightProviders';
import { WalletProvider } from '../wallet/WalletContext';
import { useWallet } from '../wallet/useWallet';

vi.mock('../midnight/providers', () => ({
  DEFAULT_PROOF_SERVER_URL: 'http://127.0.0.1:6300',
  createContractProviders: vi.fn(),
}));
vi.mock('../midnight/contracts', () => ({ CONTEST_ZK: 'managed/contest', JOBS_ZK: 'managed/jobs' }));

const create = vi.mocked(createContractProviders);

function TestConsumer() {
  const { connect, disconnect } = useWallet();
  const { bundles, locked, unlock, unlockError, provingMode, setProvingMode } = useMidnightProviders();
  return (
    <div>
      <span data-testid="state">{locked ? 'locked' : bundles ? 'ready' : 'working'}</span>
      <span data-testid="unlock-error">{unlockError ?? 'none'}</span>
      <span data-testid="proving">{provingMode}</span>
      <button onClick={() => void connect()}>connect</button>
      <button onClick={disconnect}>disconnect</button>
      <button onClick={() => unlock('Correct-Horse-Battery-9')}>unlock</button>
      <button onClick={() => setProvingMode('local')}>prove locally</button>
    </div>
  );
}

const renderProviders = () =>
  render(
    <WalletProvider>
      <MidnightProvidersProvider>
        <TestConsumer />
      </MidnightProvidersProvider>
    </WalletProvider>,
  );

const state = () => screen.getByTestId('state');
const click = (name: string) => userEvent.click(screen.getByRole('button', { name }));

describe('providers for the two contracts', () => {
  beforeEach(() => {
    localStorage.clear();
    create.mockReset();
    create.mockResolvedValue({} as never);
    const api = {
      getConfiguration: vi.fn().mockResolvedValue({ networkId: 'undeployed' }),
      getUnshieldedAddress: vi.fn().mockResolvedValue({ unshieldedAddress: 'mn_addr_test1abc123' }),
    };
    (window as unknown as { midnight: unknown }).midnight = {
      'a-uuid': { name: 'a', connect: vi.fn().mockResolvedValue(api) },
    };
  });

  it('stays locked until a passphrase is entered, then builds one bundle per contract', async () => {
    renderProviders();
    await click('connect');
    expect(state()).toHaveTextContent('locked');
    expect(create).not.toHaveBeenCalled();

    await click('unlock');

    await vi.waitFor(() => expect(state()).toHaveTextContent('ready'));
    expect(create.mock.calls.map((c) => c[3])).toEqual(['managed/contest', 'managed/jobs']);
    expect(create.mock.calls[0]?.[1]).toEqual({ mode: 'wallet', proofServerUrl: 'http://127.0.0.1:6300' });
  });

  it('goes back to the prompt with the reason on a wrong passphrase', async () => {
    create.mockRejectedValue(new WrongPassphraseError(new Error('bad key')));
    renderProviders();
    await click('connect');

    await click('unlock');

    await vi.waitFor(() => expect(screen.getByTestId('unlock-error')).toHaveTextContent("doesn't open"));
    expect(state()).toHaveTextContent('locked');
  });

  it('rebuilds with the local proof server when chosen, and remembers the choice', async () => {
    renderProviders();
    await click('connect');
    await click('unlock');
    await vi.waitFor(() => expect(state()).toHaveTextContent('ready'));

    await click('prove locally');

    await vi.waitFor(() => expect(create).toHaveBeenCalledTimes(4));
    expect(create.mock.calls[3]?.[1]).toEqual({ mode: 'local', proofServerUrl: 'http://127.0.0.1:6300' });
    expect(localStorage.getItem('strongchar:proving')).toBe('local');
  });

  it('forgets the passphrase on disconnect', async () => {
    renderProviders();
    await click('connect');
    await click('unlock');
    await vi.waitFor(() => expect(state()).toHaveTextContent('ready'));

    await click('disconnect');
    await click('connect');

    expect(state()).toHaveTextContent('locked');
  });
});
