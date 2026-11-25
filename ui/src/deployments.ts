// Where the two contracts live on each network. Public testnet addresses come from the committed records that
// scripts/deploy.ts writes (deployments/<network>.json). The local devnet starts empty on every run, so its addresses
// come from the dev server's environment instead (VITE_CONTEST_ADDRESS and VITE_JOBS_ADDRESS).

export type Deployment = { contest?: string; jobs?: string };

type DeploymentsFile = { networkId: string; contracts: Partial<Record<string, { address: string }>> };
type DevAddresses = { VITE_CONTEST_ADDRESS?: string; VITE_JOBS_ADDRESS?: string };

const LOCAL_NETWORK = 'undeployed';

export function resolveDeployment(
  networkId: string,
  files: Record<string, DeploymentsFile>,
  env: DevAddresses,
  dev: boolean,
): Deployment {
  const record = Object.values(files).find((f) => f.networkId === networkId);
  const local = dev && networkId === LOCAL_NETWORK;
  const contest = (local && env.VITE_CONTEST_ADDRESS?.trim()) || record?.contracts.contest?.address;
  const jobs = (local && env.VITE_JOBS_ADDRESS?.trim()) || record?.contracts.jobs?.address;
  return { ...(contest ? { contest } : {}), ...(jobs ? { jobs } : {}) };
}

// A pattern, so the build works before a network has been deployed to.
const committed = import.meta.glob<DeploymentsFile>('../../deployments/{preview,preprod}.json', {
  eager: true,
  import: 'default',
});

export const deploymentFor = (networkId: string): Deployment =>
  resolveDeployment(networkId, committed, import.meta.env, import.meta.env.DEV);
