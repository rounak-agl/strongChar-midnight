// SPDX-License-Identifier: Apache-2.0
//
// End-to-end sealed training jobs on a live network (local devnet by default), with four wallets: the owner (also the
// admin who deployed), a trainer node and two verifiers. One job passes and pays the trainer; a second fails, slashes
// the trainer's bond and repays the owner twice the budget. Every balance move is checked in the wallets themselves.
//
//   npm run env:up && npm run wait:dust && npm run test:local

import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { ContractAddress } from '@midnight-ntwrk/midnight-js-protocol/v9/compact-runtime';
import { CompiledJobsContract, JobState, jobsLedger, jobsZkPath } from '../../contract/index.js';
import type { JobsPrivateState } from '../../contract/jobs-witnesses.js';
import { ledgerState } from '../net/providers.js';
import { randomBytes32 } from '../api/contest.js';
import {
  JOBS_STATE_ID,
  collect,
  deployJobs,
  joinJobs,
  myRole,
  postJob,
  publicKeys,
  registerNode,
  seatVerifier,
  submitResult,
  vote,
  withdrawEarnings,
  type JobsHandle,
} from '../api/jobs.js';
import {
  type Actor,
  bringUp,
  chainTime,
  isRemote,
  sameWallet,
  logger,
  network,
  nightBalance,
  payoutOf,
  tearDown,
  waitForNight,
} from './devnet.js';

const BOND = 2_000_000n;
const BUDGET = 500_000n;

describe(`sealed jobs (${network})`, () => {
  let owner: Actor;
  let trainer: Actor;
  let v1: Actor;
  let v2: Actor;
  let address: ContractAddress;
  const h: Record<string, JobsHandle> = {};

  const ledger = async () => jobsLedger(ledgerState(await owner.providers.publicDataProvider.queryContractState(address)));
  const keyOf = async (a: Actor) =>
    ((await a.providers.privateStateProvider.forContract(address).get(JOBS_STATE_ID)) as JobsPrivateState).secretKey;

  const post = async () => {
    const now = await chainTime();
    return postJob(h['owner']!, {
      spec: randomBytes32(),
      budget: BUDGET,
      trainer: publicKeys(await keyOf(trainer)).node,
      submitBy: now + 1_800n,
      verdictBy: now + 3_600n,
    });
  };

  beforeAll(async () => {
    owner = await bringUp('OWNER', jobsZkPath);
    trainer = await bringUp('TRAINER', jobsZkPath);
    v1 = await bringUp('VERIFIER_ONE', jobsZkPath);
    // The local devnet funds three wallets; the second verifier pays from the first verifier's wallet with its own key.
    v2 = isRemote ? await bringUp('VERIFIER_TWO', jobsZkPath) : sameWallet(v1, 'VERIFIER_TWO', jobsZkPath);
  });

  afterAll(() => tearDown(isRemote ? [owner, trainer, v1, v2] : [owner, trainer, v1]));

  it('deploys with the owner as admin, who seats two verifiers by their public keys', async () => {
    const d = await deployJobs(owner.providers, CompiledJobsContract);
    address = d.address;
    h['owner'] = d.handle;
    logger.info(`jobs contract at ${address}`);
    h['trainer'] = await joinJobs(trainer.providers, CompiledJobsContract, address);
    h['v1'] = await joinJobs(v1.providers, CompiledJobsContract, address);
    h['v2'] = await joinJobs(v2.providers, CompiledJobsContract, address);

    await expect(seatVerifier(h['v1']!, publicKeys(await keyOf(v1)).verifier)).rejects.toThrow();
    await seatVerifier(h['owner']!, publicKeys(await keyOf(v1)).verifier);
    await seatVerifier(h['owner']!, publicKeys(await keyOf(v2)).verifier);
    expect((await ledger()).verifiers.size()).toBe(2n);
  });

  it('registers the trainer node with a bond', async () => {
    const before = await nightBalance(trainer);
    await registerNode(h['trainer']!, randomBytes32(), BOND);
    expect((await ledger()).nodes.lookup(publicKeys(await keyOf(trainer)).node).bond).toBe(BOND);
    expect(await waitForNight(trainer, before - BOND)).toBe(before - BOND);
  });

  it('pays the trainer when both verifiers pass the result', async () => {
    const job = await post();
    const result = randomBytes32();
    expect(myRole(await ledger(), job, await keyOf(owner)).owner).toBe(true);
    await submitResult(h['trainer']!, job, result);
    await vote(h['v1']!, job, result, true);
    await expect(vote(h['v1']!, job, result, true)).rejects.toThrow();
    await vote(h['v2']!, job, result, true);
    expect((await ledger()).jobs.lookup(job).state).toBe(JobState.PASSED);

    const before = await nightBalance(trainer);
    await withdrawEarnings(h['trainer']!, payoutOf(trainer));
    expect(await waitForNight(trainer, before + BUDGET)).toBe(before + BUDGET);
  });

  it('slashes the trainer and repays the owner twice the budget when both verifiers fail it', async () => {
    const job = await post();
    const result = randomBytes32();
    await submitResult(h['trainer']!, job, result);
    await vote(h['v1']!, job, result, false);
    await vote(h['v2']!, job, result, false);
    const l = await ledger();
    expect(l.jobs.lookup(job).state).toBe(JobState.FAILED);
    expect(l.nodes.lookup(publicKeys(await keyOf(trainer)).node).bond).toBe(BOND - BUDGET);

    const before = await nightBalance(owner);
    await collect(h['owner']!, job, payoutOf(owner));
    expect(await waitForNight(owner, before + 2n * BUDGET)).toBe(before + 2n * BUDGET);
  });
});
