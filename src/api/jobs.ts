// SPDX-License-Identifier: Apache-2.0
//
// The sealed-jobs API: deploy or join the jobs contract, then seat verifiers, register trainer nodes, post jobs, submit
// results, vote and settle. A user holds one secret key; the contract derives a separate, domain-separated public key
// from it for each role (admin, node, verifier, and an owner key per job), so the roles cannot be linked on chain.
// Runs in Node and in the browser.

import {
  deployContract,
  findDeployedContract,
  type FoundContract,
} from '@midnight-ntwrk/midnight-js-contracts';
import type { ContractAddress } from '@midnight-ntwrk/midnight-js-protocol/v9/compact-runtime';
import type { MidnightProviders } from '@midnight-ntwrk/midnight-js-types';
import type { CompiledJobs } from '../../contract/compiled.js';
import {
  type Contract,
  type Job,
  type Ledger,
  JobState,
  pureCircuits,
} from '../../contract/managed/jobs/contract/index.js';
import { type JobsPrivateState, createJobsPrivateState } from '../../contract/jobs-witnesses.js';
import { randomBytes32, type Payout } from './contest.js';
import { toHex } from '../../contract/witnesses.js';

export const JOBS_STATE_ID = 'strongchar-jobs';

export type JobsProviders = MidnightProviders<any>;
export type JobsHandle = FoundContract<Contract<JobsPrivateState>>;

/** Deploy the jobs contract. The deployer's key becomes the admin, who alone seats verifiers. */
export async function deployJobs(
  providers: JobsProviders,
  compiled: CompiledJobs,
  secretKey: Uint8Array = randomBytes32(),
): Promise<{ handle: JobsHandle; address: ContractAddress }> {
  const handle = await deployContract(providers, {
    compiledContract: compiled,
    privateStateId: JOBS_STATE_ID,
    initialPrivateState: createJobsPrivateState(secretKey),
  });
  return { handle: handle as unknown as JobsHandle, address: handle.deployTxData.public.contractAddress };
}

/** Attach to a deployed jobs contract, reusing this device's stored key when there is one. */
export async function joinJobs(
  providers: JobsProviders,
  compiled: CompiledJobs,
  address: ContractAddress,
  secretKey: () => Uint8Array = randomBytes32,
): Promise<JobsHandle> {
  const stored = await providers.privateStateProvider.forContract(address).get(JOBS_STATE_ID);
  const found = await findDeployedContract(providers, {
    compiledContract: compiled,
    contractAddress: address,
    privateStateId: JOBS_STATE_ID,
    ...(stored === null ? { initialPrivateState: createJobsPrivateState(secretKey()) } : {}),
  });
  return found as unknown as JobsHandle;
}

/** The public keys a user hands out: to the admin to be seated as a verifier, to owners to be named as a trainer. */
export const publicKeys = (secretKey: Uint8Array) => ({
  node: pureCircuits.nodeKey(secretKey),
  verifier: pureCircuits.verifierKey(secretKey),
});

export const seatVerifier = (h: JobsHandle, verifierKey: Uint8Array) => h.callTx.addVerifier(verifierKey);

/**
 * Join as a trainer node with a bond. `kemKey` is a hash of the node's ML-KEM-1024 public key: owners seal training
 * inputs to the full key off chain and check it against this hash.
 */
export const registerNode = (h: JobsHandle, kemKey: Uint8Array, bond: bigint) => h.callTx.registerNode(kemKey, bond);

export type PostOptions = {
  /** Commitment to the sealed job spec (data, script, hyperparameters). */
  spec: Uint8Array;
  budget: bigint;
  /** The trainer's node key (publicKeys(sk).node). */
  trainer: Uint8Array;
  /** Unix seconds. */
  submitBy: bigint;
  verdictBy: bigint;
  job?: Uint8Array;
};

/** Post a job to a named trainer and escrow its budget. Returns the job id. */
export async function postJob(h: JobsHandle, o: PostOptions): Promise<Uint8Array> {
  const job = o.job ?? randomBytes32();
  await h.callTx.createJob(job, o.spec, o.budget, o.trainer, o.submitBy, o.verdictBy);
  return job;
}

export const submitResult = (h: JobsHandle, job: Uint8Array, result: Uint8Array) => h.callTx.submitResult(job, result);
export const vote = (h: JobsHandle, job: Uint8Array, result: Uint8Array, pass: boolean) =>
  h.callTx.vote(job, result, pass);
export const collect = (h: JobsHandle, job: Uint8Array, to: Payout) => h.callTx.collect(job, to);
export const withdrawEarnings = (h: JobsHandle, to: Payout) => h.callTx.withdrawEarnings(to);
export const leave = (h: JobsHandle, to: Payout) => h.callTx.leave(to);

export type JobRole = { owner: boolean; trainer: boolean; verifier: boolean; voted: boolean };

/** Which roles this user's key plays in one job, computed locally from public state. */
export function myRole(l: Ledger, job: Uint8Array, secretKey: Uint8Array): JobRole {
  const j: Job | null = l.jobs.member(job) ? l.jobs.lookup(job) : null;
  if (j === null) return { owner: false, trainer: false, verifier: false, voted: false };
  const v = pureCircuits.verifierKey(secretKey);
  return {
    owner: toHex(pureCircuits.ownerKey(secretKey, job)) === toHex(j.owner),
    trainer: toHex(pureCircuits.nodeKey(secretKey)) === toHex(j.trainer),
    verifier: l.verifiers.member(v),
    voted: j.votes > 0n && toHex(j.firstVerifier) === toHex(v),
  };
}

export { JobState };
