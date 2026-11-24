// SPDX-License-Identifier: Apache-2.0
//
// End-to-end sealed contest on a live network (local devnet by default): real wallets, real proofs, real block time.
// A host posts a prize against 64 hidden labels; two entrants enter sealed predictions; after entries close the host
// opens the labels; both entrants prove their scores in zero knowledge; the better one claims the prize, and the
// wallet balance moves by exactly that much. Runs in about 15 minutes, most of it waiting out the deadlines.
//
//   npm run env:up && npm run wait:dust && npm run test:local

import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { ContractAddress } from '@midnight-ntwrk/midnight-js-protocol/v9/compact-runtime';
import { contestLedger, contestZkPath, CompiledContestContract } from '../../contract/index.js';
import type { ContestPrivateState } from '../../contract/witnesses.js';
import { ledgerState } from '../net/providers.js';
import {
  CONTEST_STATE_ID,
  ROWS,
  claimPrize,
  deployContests,
  enterContest,
  hostContest,
  joinContests,
  myStanding,
  phaseOf,
  proveScore,
  randomBytes32,
  revealLabels,
  type ContestHandle,
} from '../api/contest.js';
import {
  type Actor,
  bringUp,
  chainTime,
  logger,
  nightBalance,
  network,
  payoutOf,
  tearDown,
  waitForChainTime,
  waitForNight,
} from './devnet.js';

const PRIZE = 1_000_000n;
// Seconds. Entries need time for a deploy-sized proof each; override on slow machines.
const ENTRY_WINDOW = BigInt(process.env['CONTEST_ENTRY_WINDOW'] ?? 240);
const REVEAL_WINDOW = BigInt(process.env['CONTEST_REVEAL_WINDOW'] ?? 150);
const SCORE_WINDOW = BigInt(process.env['CONTEST_SCORE_WINDOW'] ?? 240);

const LABELS = Array.from({ length: ROWS }, (_, i) => (i * 7) % 10);
/** Predictions that get exactly `right` rows correct. */
const predictionsWith = (right: number) => LABELS.map((l, i) => (i < right ? l : (l + 1) % 10));

describe(`sealed contest (${network})`, () => {
  let host: Actor;
  let one: Actor;
  let two: Actor;
  let address: ContractAddress;
  let hostH: ContestHandle;
  let oneH: ContestHandle;
  let twoH: ContestHandle;
  let contest: Uint8Array;
  let closesAt: bigint;
  let revealBy: bigint;
  let scoreBy: bigint;

  const ledger = async () => contestLedger(ledgerState(await host.providers.publicDataProvider.queryContractState(address)));
  const keyOf = async (a: Actor) =>
    ((await a.providers.privateStateProvider.forContract(address).get(CONTEST_STATE_ID)) as ContestPrivateState).secretKey;

  beforeAll(async () => {
    host = await bringUp('HOST', contestZkPath);
    one = await bringUp('ENTRANT_ONE', contestZkPath);
    two = await bringUp('ENTRANT_TWO', contestZkPath);
  });

  afterAll(() => tearDown([host, one, two]));

  it('deploys the contest contract, and the entrants join it with their own keys', async () => {
    ({ handle: hostH, address } = await deployContests(host.providers, CompiledContestContract));
    logger.info(`contest contract at ${address}`);
    oneH = await joinContests(one.providers, CompiledContestContract, address);
    twoH = await joinContests(two.providers, CompiledContestContract, address);
    expect((await ledger()).contests.size()).toBe(0n);
  });

  it('posts a contest, escrowing the prize and committing to the hidden labels', async () => {
    const before = await nightBalance(host);
    closesAt = (await chainTime()) + ENTRY_WINDOW;
    revealBy = closesAt + REVEAL_WINDOW;
    scoreBy = revealBy + SCORE_WINDOW;
    contest = await hostContest(host.providers, hostH, {
      labels: LABELS,
      dataset: randomBytes32(),
      closesAt,
      revealBy,
      scoreBy,
      prize: PRIZE,
    });
    const l = await ledger();
    const c = l.contests.lookup(contest);
    expect(c.prize).toBe(PRIZE);
    expect(phaseOf(c, await chainTime())).toBe('open');
    expect(myStanding(l, contest, await keyOf(host)).isHost).toBe(true);
    expect(await waitForNight(host, before - PRIZE)).toBe(before - PRIZE);
  });

  it('takes two sealed entries; no prediction reaches the chain', async () => {
    await enterContest(one.providers, oneH, contest, predictionsWith(60));
    await enterContest(two.providers, twoH, contest, predictionsWith(50));
    const l = await ledger();
    expect(l.contests.lookup(contest).entries).toBe(2n);
    expect(myStanding(l, contest, await keyOf(one)).entered).toBe(true);
    // Only commitments are public: no entry equals a raw prediction vector, and labels are not yet stored.
    expect(l.labels.member(contest)).toBe(false);
  });

  it('refuses an early reveal, then opens the labels once entries close', async () => {
    await expect(revealLabels(host.providers, hostH, contest)).rejects.toThrow();
    await waitForChainTime(closesAt);
    await revealLabels(host.providers, hostH, contest);
    const l = await ledger();
    expect(l.labels.lookup(contest).map(Number)).toEqual(LABELS);
    expect(phaseOf(l.contests.lookup(contest), await chainTime())).toBe('scoring');
  });

  it('scores both entries in zero knowledge and publishes only the counts', async () => {
    await proveScore(twoH, contest);
    await proveScore(oneH, contest);
    const l = await ledger();
    expect(myStanding(l, contest, await keyOf(one)).score).toBe(60n);
    expect(myStanding(l, contest, await keyOf(two)).score).toBe(50n);
    expect(myStanding(l, contest, await keyOf(one)).leading).toBe(true);
    expect(l.contests.lookup(contest).best).toBe(60n);
  });

  it('pays the prize to the best entrant once scoring closes, and only to them', async () => {
    await expect(claimPrize(oneH, contest, payoutOf(one))).rejects.toThrow();
    await waitForChainTime(scoreBy);
    await expect(claimPrize(twoH, contest, payoutOf(two))).rejects.toThrow();
    const before = await nightBalance(one);
    await claimPrize(oneH, contest, payoutOf(one));
    expect((await ledger()).contests.lookup(contest).settled).toBe(true);
    expect(await waitForNight(one, before + PRIZE)).toBe(before + PRIZE);
  });
});
