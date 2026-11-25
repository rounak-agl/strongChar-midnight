import { describe, it, expect } from 'vitest';
import { resolveDeployment } from '../deployments';

const preview = {
  './preview.json': {
    networkId: 'preview',
    contracts: { contest: { address: 'aa' }, jobs: { address: 'bb' } },
  },
};
const env = { VITE_CONTEST_ADDRESS: 'c1', VITE_JOBS_ADDRESS: ' j1 ' };

describe('contract addresses per network', () => {
  it("reads the committed record for the wallet's network", () => {
    expect(resolveDeployment('preview', preview, {}, false)).toEqual({ contest: 'aa', jobs: 'bb' });
  });

  it('has nothing for a network without a record', () => {
    expect(resolveDeployment('preprod', preview, {}, false)).toEqual({});
    expect(resolveDeployment('undeployed', {}, {}, true)).toEqual({});
  });

  it('takes the local devnet addresses from the dev environment', () => {
    expect(resolveDeployment('undeployed', {}, env, true)).toEqual({ contest: 'c1', jobs: 'j1' });
  });

  it('never applies the dev addresses to a public network or a production build', () => {
    expect(resolveDeployment('preview', preview, env, true)).toEqual({ contest: 'aa', jobs: 'bb' });
    expect(resolveDeployment('preprod', {}, env, true)).toEqual({});
    expect(resolveDeployment('undeployed', {}, env, false)).toEqual({});
  });

  it('keeps a contract that is deployed alone', () => {
    const half = { './preprod.json': { networkId: 'preprod', contracts: { jobs: { address: 'bb' } } } };
    expect(resolveDeployment('preprod', half, { VITE_JOBS_ADDRESS: '' }, true)).toEqual({ jobs: 'bb' });
  });
});
