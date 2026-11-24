// SPDX-License-Identifier: Apache-2.0
//
// In-memory tests for the sealed-contest contract: the full flow, every guard, and the privacy claims (no prediction,
// label salt or secret key ever reaches public state). `npm run compile:fast && npm run test:sim`.

import { randomBytes } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { Contract, ledger, pureCircuits } from '../../contract/managed/contest/contract/index.js';
import { ROWS, createPrivateState, withSecrets, type ContestPrivateState } from '../../contract/witnesses.js';
import { witnesses } from '../../contract/witnesses.js';
import { Sim, expectRejects, findInPublicState } from './sim.js';

const bytes32 = () => new Uint8Array(randomBytes(32));
const T0 = 1_800_000_000;
const CLOSE = T0 + 100;
const REVEAL = T0 + 200;
const SCORE = T0 + 300;
const PRIZE = 900n;
const ADDR = { bytes: new Uint8Array(32).fill(7) };

const HOST_SK = bytes32();
const ALICE_SK = bytes32();
const BOB_SK = bytes32();
const CAROL_SK = bytes32();

// Labels cycle through 4 classes; a prediction row matches the first `right` rows and misses the rest.
const LABELS = Array.from({ length: ROWS }, (_, i) => i % 4);
const predictionsWith = (right: number) => LABELS.map((l, i) => (i < right ? l : (l + 1) % 4));

const id = bytes32();
const labelSalt = bytes32();

type Who = { sk: Uint8Array; right?: number; salt?: Uint8Array };

function stateFor(who: Who): ContestPrivateState {
  const base = createPrivateState(who.sk);
  if (who.sk === HOST_SK) return withSecrets(base, id, { labelSalt });
  return withSecrets(base, id, { predictions: predictionsWith(who.right ?? 0), predictionSalt: who.salt ?? bytes32() });
}

async function deployed() {
  const sim = await Sim.deploy({ contract: new Contract(witnesses), ledger, privateState: stateFor({ sk: HOST_SK }) });
  sim.at(T0);
  await sim.call(
    'createContest',
    id,
    pureCircuits.commitLabels(LABELS.map(BigInt), labelSalt),
    bytes32(),
    BigInt(CLOSE),
    BigInt(REVEAL),
    BigInt(SCORE),
    PRIZE,
  );
  return sim;
}

const as = (sim: Awaited<ReturnType<typeof deployed>>, who: Who) => {
  sim.privateState = stateFor(who);
  return sim;
};

describe('sealed contest', () => {
  it('creates a contest holding the label commitment and the prize', async () => {
    const sim = await deployed();
    const c = sim.ledger().contests.lookup(id);
    expect(c.prize).toBe(PRIZE);
    expect(c.entries).toBe(0n);
    expect(c.revealed).toBe(false);
    expect(c.host).toEqual(pureCircuits.hostKey(HOST_SK, id));
  });

  it('rejects a reused id, deadlines out of order, a past close and a zero prize', async () => {
    const sim = await deployed();
    const args = (i: Uint8Array, c: number, r: number, s: number, p: bigint) =>
      sim.call('createContest', i, bytes32(), bytes32(), BigInt(c), BigInt(r), BigInt(s), p);
    await expectRejects(() => args(id, CLOSE, REVEAL, SCORE, PRIZE), 'contest id already used');
    await expectRejects(() => args(bytes32(), REVEAL, CLOSE, SCORE, PRIZE), 'deadlines must be in order');
    await expectRejects(() => args(bytes32(), T0 - 1, REVEAL, SCORE, PRIZE), 'closing time is in the past');
    await expectRejects(() => args(bytes32(), CLOSE, REVEAL, SCORE, 0n), 'a contest needs a prize');
  });

  it('runs the whole contest: enter, reveal, prove, and the best score claims the prize', async () => {
    const sim = await deployed();
    const alice = { sk: ALICE_SK, right: 50, salt: bytes32() };
    const bob = { sk: BOB_SK, right: 61, salt: bytes32() };
    await as(sim, alice).call('enter', id);
    await as(sim, bob).call('enter', id);
    expect(sim.ledger().contests.lookup(id).entries).toBe(2n);

    sim.at(CLOSE);
    await as(sim, { sk: HOST_SK }).call('revealLabels', id, LABELS.map(BigInt));
    expect(sim.ledger().labels.lookup(id)).toEqual(LABELS.map(BigInt));

    await as(sim, alice).call('proveScore', id);
    await as(sim, bob).call('proveScore', id);
    const l = sim.ledger();
    expect(l.scores.lookup(pureCircuits.entrantKey(ALICE_SK, id))).toBe(50n);
    expect(l.scores.lookup(pureCircuits.entrantKey(BOB_SK, id))).toBe(61n);
    expect(l.contests.lookup(id).best).toBe(61n);
    expect(l.contests.lookup(id).leader).toEqual(pureCircuits.entrantKey(BOB_SK, id));

    sim.at(SCORE);
    await expectRejects(() => as(sim, alice).call('claimPrize', id, ADDR), 'not the winner');
    await as(sim, bob).call('claimPrize', id, ADDR);
    expect(sim.ledger().contests.lookup(id).settled).toBe(true);
    await expectRejects(() => as(sim, bob).call('claimPrize', id, ADDR), 'prize already paid');
  });

  it('never puts predictions, salts or secret keys in public state', async () => {
    const sim = await deployed();
    const alice = { sk: ALICE_SK, right: 40, salt: bytes32() };
    await as(sim, alice).call('enter', id);
    sim.at(CLOSE);
    await as(sim, { sk: HOST_SK }).call('revealLabels', id, LABELS.map(BigInt));
    await as(sim, alice).call('proveScore', id);
    const l = sim.ledger();
    for (const secret of [ALICE_SK, HOST_SK, alice.salt, labelSalt, Uint8Array.from(predictionsWith(40))]) {
      expect(findInPublicState(l, secret)).toBeNull();
    }
    // The entry on chain is only a commitment, and it does not equal a commitment under any other salt.
    const committed = l.entries.lookup(pureCircuits.entrantKey(ALICE_SK, id));
    expect(committed).toEqual(pureCircuits.commitPredictions(predictionsWith(40).map(BigInt), alice.salt));
    expect(committed).not.toEqual(pureCircuits.commitPredictions(predictionsWith(40).map(BigInt), bytes32()));
  });

  it('binds keys to one contest, so an entrant is unlinkable across contests', () => {
    const other = bytes32();
    expect(pureCircuits.entrantKey(ALICE_SK, id)).not.toEqual(pureCircuits.entrantKey(ALICE_SK, other));
    expect(pureCircuits.entrantKey(ALICE_SK, id)).not.toEqual(pureCircuits.hostKey(ALICE_SK, id));
  });

  it('closes entries at the deadline, stops double entry and keeps the host out', async () => {
    const sim = await deployed();
    await as(sim, { sk: ALICE_SK, right: 1 }).call('enter', id);
    await expectRejects(() => as(sim, { sk: ALICE_SK, right: 2 }).call('enter', id), 'already entered');
    await expectRejects(() => as(sim, { sk: HOST_SK }).call('enter', id), 'the host cannot enter');
    sim.at(CLOSE);
    await expectRejects(() => as(sim, { sk: BOB_SK, right: 1 }).call('enter', id), 'entries are closed');
  });

  it('only accepts the committed labels, from the host, inside the reveal window', async () => {
    const sim = await deployed();
    const host = { sk: HOST_SK };
    await expectRejects(() => as(sim, host).call('revealLabels', id, LABELS.map(BigInt)), 'entries are still open');
    sim.at(CLOSE);
    const wrong = LABELS.map((l, i) => BigInt(i === 0 ? (l + 1) % 4 : l));
    await expectRejects(() => as(sim, host).call('revealLabels', id, wrong), 'these are not the committed labels');
    await expectRejects(() => as(sim, { sk: ALICE_SK }).call('revealLabels', id, LABELS.map(BigInt)), 'only the host');
    sim.at(REVEAL);
    await expectRejects(() => as(sim, host).call('revealLabels', id, LABELS.map(BigInt)), 'reveal deadline has passed');
  });

  it('scores only the committed predictions, once, before the deadline', async () => {
    const sim = await deployed();
    const alice = { sk: ALICE_SK, right: 30, salt: bytes32() };
    await as(sim, alice).call('enter', id);
    sim.at(CLOSE);
    await expectRejects(() => as(sim, alice).call('proveScore', id), 'labels are not open yet');
    await as(sim, { sk: HOST_SK }).call('revealLabels', id, LABELS.map(BigInt));

    // Same key, better predictions after seeing the labels: the commitment check refuses it.
    await expectRejects(
      () => as(sim, { ...alice, right: 64 }).call('proveScore', id),
      'predictions differ from the committed entry',
    );
    await expectRejects(() => as(sim, { sk: BOB_SK, right: 64 }).call('proveScore', id), 'not entered');
    await as(sim, alice).call('proveScore', id);
    await expectRejects(() => as(sim, alice).call('proveScore', id), 'score already proven');
    sim.at(SCORE);
    await expectRejects(() => as(sim, { sk: CAROL_SK }).call('proveScore', id), 'scoring has closed');
  });

  it('gives a tie to whoever proved first', async () => {
    const sim = await deployed();
    const alice = { sk: ALICE_SK, right: 33, salt: bytes32() };
    const bob = { sk: BOB_SK, right: 33, salt: bytes32() };
    await as(sim, alice).call('enter', id);
    await as(sim, bob).call('enter', id);
    sim.at(CLOSE);
    await as(sim, { sk: HOST_SK }).call('revealLabels', id, LABELS.map(BigInt));
    await as(sim, bob).call('proveScore', id);
    await as(sim, alice).call('proveScore', id);
    expect(sim.ledger().contests.lookup(id).leader).toEqual(pureCircuits.entrantKey(BOB_SK, id));
  });

  it('lets the host reclaim only a prize nobody can win', async () => {
    const empty = await deployed();
    const host = { sk: HOST_SK };
    await expectRejects(() => as(empty, host).call('reclaimPrize', id, ADDR), 'the prize can still be won');
    empty.at(CLOSE);
    await as(empty, host).call('reclaimPrize', id, ADDR);
    expect(empty.ledger().contests.lookup(id).settled).toBe(true);

    const scored = await deployed();
    const alice = { sk: ALICE_SK, right: 5, salt: bytes32() };
    await as(scored, alice).call('enter', id);
    scored.at(CLOSE);
    await expectRejects(() => as(scored, host).call('reclaimPrize', id, ADDR), 'the prize can still be won');
    await as(scored, host).call('revealLabels', id, LABELS.map(BigInt));
    await as(scored, alice).call('proveScore', id);
    scored.at(SCORE);
    await expectRejects(() => as(scored, host).call('reclaimPrize', id, ADDR), 'the prize can still be won');
    await expectRejects(() => as(scored, { sk: ALICE_SK }).call('reclaimPrize', id, ADDR), 'only the host');
  });

  it('forfeits the prize to the entrants when the host never opens the labels', async () => {
    const sim = await deployed();
    const people = [ALICE_SK, BOB_SK].map((sk) => ({ sk, right: 1, salt: bytes32() }));
    for (const p of people) await as(sim, p).call('enter', id);
    sim.at(CLOSE);
    await expectRejects(() => as(sim, people[0]!).call('claimForfeit', id, ADDR), 'the host can still open the labels');
    sim.at(REVEAL);
    await as(sim, people[0]!).call('claimForfeit', id, ADDR);
    await expectRejects(() => as(sim, people[0]!).call('claimForfeit', id, ADDR), 'share already taken');
    await as(sim, people[1]!).call('claimForfeit', id, ADDR);
    await expectRejects(() => as(sim, { sk: CAROL_SK, right: 1 }).call('claimForfeit', id, ADDR), 'not entered');
    await expectRejects(() => as(sim, { sk: HOST_SK }).call('revealLabels', id, LABELS.map(BigInt)), 'reveal deadline');
  });

  it('refuses a forged forfeit share', async () => {
    const sim = await deployed();
    const alice = { sk: ALICE_SK, right: 1, salt: bytes32() };
    await as(sim, alice).call('enter', id);
    sim.at(REVEAL);
    // A doctored client that claims twice the whole prize as its share.
    const greedy: typeof witnesses = {
      ...witnesses,
      shareOf: ({ privateState }): [ContestPrivateState, bigint] => [privateState, PRIZE * 2n],
    };
    const forged = await Sim.deploy({ contract: new Contract(greedy), ledger, privateState: stateFor({ sk: HOST_SK }) });
    forged.at(T0);
    await forged.call('createContest', id, pureCircuits.commitLabels(LABELS.map(BigInt), labelSalt), bytes32(), BigInt(CLOSE), BigInt(REVEAL), BigInt(SCORE), PRIZE);
    await as(forged, alice).call('enter', id);
    forged.at(REVEAL);
    await expectRejects(() => as(forged, alice).call('claimForfeit', id, ADDR), 'wrong share');
  });

  it('scores against all 64 rows', () => {
    const l = LABELS.map(BigInt);
    expect(pureCircuits.score(l, l)).toBe(BigInt(ROWS));
    expect(pureCircuits.score(predictionsWith(0).map(BigInt), l)).toBe(0n);
    expect(pureCircuits.score(predictionsWith(17).map(BigInt), l)).toBe(17n);
  });
});
