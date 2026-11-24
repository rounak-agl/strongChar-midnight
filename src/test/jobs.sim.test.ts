// SPDX-License-Identifier: Apache-2.0
//
// In-memory tests for the sealed-jobs contract: the three verdict outcomes, the deadlines, who may do what, and
// that no secret key reaches public state. `npm run compile:fast && npm run test:sim`.

import { randomBytes } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { Contract, JobState, ledger, pureCircuits } from '../../contract/managed/jobs/contract/index.js';
import { createJobsPrivateState, jobsWitnesses } from '../../contract/jobs-witnesses.js';
import { Sim, expectRejects, findInPublicState } from './sim.js';

const bytes32 = () => new Uint8Array(randomBytes(32));
const T0 = 1_800_000_000;
const SUBMIT = T0 + 100;
const VERDICT = T0 + 200;
const BUDGET = 500n;
const BOND = 800n;
const ADDR = { bytes: new Uint8Array(32).fill(9) };

const ADMIN = bytes32();
const OWNER = bytes32();
const TRAINER = bytes32();
const OTHER_NODE = bytes32();
const V1 = bytes32();
const V2 = bytes32();
const V3 = bytes32();
const STRANGER = bytes32();

const job = bytes32();
const spec = bytes32();
const result = bytes32();

type S = Awaited<ReturnType<typeof Sim.deploy<Contract<ReturnType<typeof createJobsPrivateState>>, ReturnType<typeof createJobsPrivateState>, ReturnType<typeof ledger>>>>;

const as = (sim: S, sk: Uint8Array) => {
  sim.privateState = createJobsPrivateState(sk);
  return sim;
};

async function setup(): Promise<S> {
  const sim = (await Sim.deploy({
    contract: new Contract(jobsWitnesses),
    ledger,
    privateState: createJobsPrivateState(ADMIN),
  })) as S;
  sim.at(T0);
  for (const v of [V1, V2, V3]) await as(sim, ADMIN).call('addVerifier', pureCircuits.verifierKey(v));
  await as(sim, TRAINER).call('registerNode', bytes32(), BOND);
  return sim;
}

async function posted(): Promise<S> {
  const sim = await setup();
  await as(sim, OWNER).call(
    'createJob',
    job,
    spec,
    BUDGET,
    pureCircuits.nodeKey(TRAINER),
    BigInt(SUBMIT),
    BigInt(VERDICT),
  );
  return sim;
}

async function submitted(): Promise<S> {
  const sim = await posted();
  await as(sim, TRAINER).call('submitResult', job, result);
  return sim;
}

const node = (sim: S, sk: Uint8Array) => sim.ledger().nodes.lookup(pureCircuits.nodeKey(sk));
const jobOf = (sim: S) => sim.ledger().jobs.lookup(job);

describe('sealed jobs', () => {
  it('seats verifiers only through the admin', async () => {
    const sim = await setup();
    expect(sim.ledger().verifiers.member(pureCircuits.verifierKey(V1))).toBe(true);
    await expectRejects(() => as(sim, STRANGER).call('addVerifier', bytes32()), 'only the admin');
  });

  it('registers a node once, with a bond', async () => {
    const sim = await setup();
    expect(node(sim, TRAINER).bond).toBe(BOND);
    await expectRejects(() => as(sim, TRAINER).call('registerNode', bytes32(), BOND), 'already registered');
    await expectRejects(() => as(sim, OTHER_NODE).call('registerNode', bytes32(), 0n), 'must post a bond');
  });

  it('posts a job only to a free, registered trainer whose bond covers the budget', async () => {
    const sim = await setup();
    const post = (trainer: Uint8Array, budget: bigint, s = SUBMIT, v = VERDICT, id = bytes32()) =>
      as(sim, OWNER).call('createJob', id, spec, budget, trainer, BigInt(s), BigInt(v));
    await expectRejects(() => post(pureCircuits.nodeKey(STRANGER), BUDGET), 'not a registered node');
    await expectRejects(() => post(pureCircuits.nodeKey(TRAINER), BOND + 1n), 'bond is below the budget');
    await expectRejects(() => post(pureCircuits.nodeKey(TRAINER), 0n), 'needs a budget');
    await expectRejects(() => post(pureCircuits.nodeKey(TRAINER), BUDGET, VERDICT, SUBMIT), 'deadlines must be in order');
    await expectRejects(() => post(pureCircuits.nodeKey(TRAINER), BUDGET, T0 - 1, VERDICT), 'in the past');
    await post(pureCircuits.nodeKey(TRAINER), BUDGET, SUBMIT, VERDICT, job);
    await expectRejects(() => post(pureCircuits.nodeKey(TRAINER), BUDGET), 'on another job');
    expect(jobOf(sim).owner).toEqual(pureCircuits.ownerKey(OWNER, job));
  });

  it('pays the trainer when both verifiers pass the result', async () => {
    const sim = await submitted();
    await as(sim, V1).call('vote', job, result, true);
    await as(sim, V2).call('vote', job, result, true);
    expect(jobOf(sim).state).toBe(JobState.PASSED);
    expect(node(sim, TRAINER).earned).toBe(BUDGET);
    expect(node(sim, TRAINER).busy).toBe(false);
    await expectRejects(() => as(sim, OWNER).call('collect', job, ADDR), 'nothing left to collect');
    await as(sim, TRAINER).call('withdrawEarnings', ADDR);
    expect(node(sim, TRAINER).earned).toBe(0n);
    await expectRejects(() => as(sim, TRAINER).call('withdrawEarnings', ADDR), 'nothing earned');
  });

  it('slashes the trainer and repays the owner twice the budget when both verifiers fail it', async () => {
    const sim = await submitted();
    await as(sim, V1).call('vote', job, result, false);
    await as(sim, V3).call('vote', job, result, false);
    expect(jobOf(sim).state).toBe(JobState.FAILED);
    expect(node(sim, TRAINER).bond).toBe(BOND - BUDGET);
    await expectRejects(() => as(sim, STRANGER).call('collect', job, ADDR), 'only the job owner');
    await as(sim, OWNER).call('collect', job, ADDR);
    expect(jobOf(sim).settled).toBe(true);
    await expectRejects(() => as(sim, OWNER).call('collect', job, ADDR), 'nothing left to collect');
  });

  it('refunds the owner and slashes nobody on a split vote', async () => {
    const sim = await submitted();
    await as(sim, V1).call('vote', job, result, true);
    await as(sim, V2).call('vote', job, result, false);
    expect(jobOf(sim).state).toBe(JobState.REFUNDED);
    expect(node(sim, TRAINER).bond).toBe(BOND);
    await as(sim, OWNER).call('collect', job, ADDR);
  });

  it('only takes votes from seated verifiers, once each, for the submitted result, in time', async () => {
    const sim = await submitted();
    await expectRejects(() => as(sim, STRANGER).call('vote', job, result, true), 'not a seated verifier');
    await expectRejects(() => as(sim, V1).call('vote', job, bytes32(), true), 'different result');
    await as(sim, V1).call('vote', job, result, true);
    await expectRejects(() => as(sim, V1).call('vote', job, result, true), 'already voted');
    sim.at(VERDICT);
    await expectRejects(() => as(sim, V2).call('vote', job, result, true), 'verdict deadline has passed');
  });

  it('takes a result only from the named trainer, before the deadline', async () => {
    const sim = await posted();
    await expectRejects(() => as(sim, V1).call('vote', job, result, true), 'no result to verify');
    await as(sim, OTHER_NODE).call('registerNode', bytes32(), BOND);
    await expectRejects(() => as(sim, OTHER_NODE).call('submitResult', job, result), 'only the named trainer');
    sim.at(SUBMIT);
    await expectRejects(() => as(sim, TRAINER).call('submitResult', job, result), 'submit deadline has passed');
  });

  it('refunds the owner when the trainer never submits or the verifiers never reach two votes', async () => {
    const silent = await posted();
    await expectRejects(() => as(silent, OWNER).call('collect', job, ADDR), 'still running');
    silent.at(SUBMIT);
    await as(silent, OWNER).call('collect', job, ADDR);
    expect(node(silent, TRAINER).busy).toBe(false);

    const stuck = await submitted();
    await as(stuck, V1).call('vote', job, result, true);
    await expectRejects(() => as(stuck, OWNER).call('collect', job, ADDR), 'still running');
    stuck.at(VERDICT);
    await as(stuck, OWNER).call('collect', job, ADDR);
    expect(jobOf(stuck).state).toBe(JobState.REFUNDED);
  });

  it('lets a free node leave with its bond, but not mid-job or with unclaimed earnings', async () => {
    const sim = await submitted();
    await expectRejects(() => as(sim, TRAINER).call('leave', ADDR), 'node is on a job');
    await as(sim, V1).call('vote', job, result, true);
    await as(sim, V2).call('vote', job, result, true);
    await expectRejects(() => as(sim, TRAINER).call('leave', ADDR), 'withdraw earnings first');
    await as(sim, TRAINER).call('withdrawEarnings', ADDR);
    await as(sim, TRAINER).call('leave', ADDR);
    expect(sim.ledger().nodes.member(pureCircuits.nodeKey(TRAINER))).toBe(false);
  });

  it('keeps every secret key out of public state, and binds owner keys to one job', async () => {
    const sim = await submitted();
    await as(sim, V1).call('vote', job, result, true);
    for (const sk of [ADMIN, OWNER, TRAINER, V1]) expect(findInPublicState(sim.ledger(), sk)).toBeNull();
    expect(pureCircuits.ownerKey(OWNER, job)).not.toEqual(pureCircuits.ownerKey(OWNER, bytes32()));
  });
});
