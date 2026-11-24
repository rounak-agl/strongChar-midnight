// SPDX-License-Identifier: Apache-2.0
//
// The sealed-contest API: deploy or join the contest contract, then host, enter, reveal, score and settle contests.
// Every action that needs a secret (labels, predictions, salts) first writes it into this user's private state, then
// calls the circuit, whose witnesses read it back. Secrets never leave the private state provider. Runs in Node and
// in the browser: it only touches the providers it is given.

import {
  deployContract,
  findDeployedContract,
  type FoundContract,
} from '@midnight-ntwrk/midnight-js-contracts';
import type { ContractAddress } from '@midnight-ntwrk/midnight-js-protocol/v9/compact-runtime';
import type { MidnightProviders } from '@midnight-ntwrk/midnight-js-types';
import type { CompiledContest } from '../../contract/compiled.js';
import {
  type Contract,
  type Contest,
  type Ledger,
  pureCircuits,
} from '../../contract/managed/contest/contract/index.js';
import {
  type ContestPrivateState,
  type ContestSecrets,
  ROWS,
  checkRow,
  createPrivateState,
  toHex,
  withSecrets,
} from '../../contract/witnesses.js';

export const CONTEST_STATE_ID = 'strongchar-contest';

export type ContestProviders = MidnightProviders<any>;
export type ContestHandle = FoundContract<Contract<ContestPrivateState>>;
export type Payout = { bytes: Uint8Array };

export const randomBytes32 = (): Uint8Array => globalThis.crypto.getRandomValues(new Uint8Array(32));

/** Deploy a fresh contest contract. Any number of contests then live inside it. */
export async function deployContests(
  providers: ContestProviders,
  compiled: CompiledContest,
  secretKey: Uint8Array = randomBytes32(),
): Promise<{ handle: ContestHandle; address: ContractAddress }> {
  const handle = await deployContract(providers, {
    compiledContract: compiled,
    privateStateId: CONTEST_STATE_ID,
    initialPrivateState: createPrivateState(secretKey),
  });
  return { handle: handle as unknown as ContestHandle, address: handle.deployTxData.public.contractAddress };
}

/**
 * Attach to a deployed contest contract. A stored private state is reused, because handing findDeployedContract an
 * initial state overwrites the stored one, and the stored one holds this user's key and every salt.
 */
export async function joinContests(
  providers: ContestProviders,
  compiled: CompiledContest,
  address: ContractAddress,
  secretKey: () => Uint8Array = randomBytes32,
): Promise<ContestHandle> {
  const stored = await providers.privateStateProvider.forContract(address).get(CONTEST_STATE_ID);
  const found = await findDeployedContract(providers, {
    compiledContract: compiled,
    contractAddress: address,
    privateStateId: CONTEST_STATE_ID,
    ...(stored === null ? { initialPrivateState: createPrivateState(secretKey()) } : {}),
  });
  return found as unknown as ContestHandle;
}

async function privateState(providers: ContestProviders, address: ContractAddress): Promise<ContestPrivateState> {
  const ps = (await providers.privateStateProvider.forContract(address).get(CONTEST_STATE_ID)) as ContestPrivateState | null;
  if (ps === null) throw new Error('no private state for this contract on this device; join it first');
  return ps;
}

async function remember(providers: ContestProviders, address: ContractAddress, contest: Uint8Array, s: ContestSecrets) {
  const ps = await privateState(providers, address);
  await providers.privateStateProvider.forContract(address).set(CONTEST_STATE_ID, withSecrets(ps, contest, s));
}

const addressOf = (h: ContestHandle): ContractAddress => h.deployTxData.public.contractAddress;

export type HostOptions = {
  /** One class index (0-255) per test row; exactly ROWS of them. */
  labels: readonly number[];
  /** A commitment to the public test inputs, e.g. a hash of the dataset file. */
  dataset: Uint8Array;
  /** Unix seconds. */
  closesAt: bigint;
  revealBy: bigint;
  scoreBy: bigint;
  /** In the smallest unit of NIGHT. */
  prize: bigint;
  contest?: Uint8Array;
};

/** Post a contest and escrow its prize. The labels stay in private state; only their commitment goes on chain. */
export async function hostContest(providers: ContestProviders, h: ContestHandle, o: HostOptions): Promise<Uint8Array> {
  const labels = checkRow(o.labels);
  const contest = o.contest ?? randomBytes32();
  const labelSalt = randomBytes32();
  // Saved before the call: if the tx fails the secrets are unused, but if it succeeds and they were lost the host
  // could never reveal and would forfeit the prize.
  await remember(providers, addressOf(h), contest, { labels: [...o.labels], labelSalt });
  await h.callTx.createContest(
    contest,
    pureCircuits.commitLabels(labels, labelSalt),
    o.dataset,
    o.closesAt,
    o.revealBy,
    o.scoreBy,
    o.prize,
  );
  return contest;
}

/** Enter with sealed predictions. Only a commitment to them goes on chain. */
export async function enterContest(
  providers: ContestProviders,
  h: ContestHandle,
  contest: Uint8Array,
  predictions: readonly number[],
): Promise<void> {
  checkRow(predictions);
  await remember(providers, addressOf(h), contest, { predictions: [...predictions], predictionSalt: randomBytes32() });
  await h.callTx.enter(contest);
}

/** Host: open the committed labels once entries have closed. */
export async function revealLabels(providers: ContestProviders, h: ContestHandle, contest: Uint8Array): Promise<void> {
  const ps = await privateState(providers, addressOf(h));
  const labels = ps.contests[toHex(contest)]?.labels;
  if (!labels) throw new Error('this device does not hold the labels for that contest');
  await h.callTx.revealLabels(contest, checkRow(labels));
}

/** Entrant: prove how many committed predictions match the opened labels. Only the count is published. */
export const proveScore = (h: ContestHandle, contest: Uint8Array) => h.callTx.proveScore(contest);
export const claimPrize = (h: ContestHandle, contest: Uint8Array, to: Payout) => h.callTx.claimPrize(contest, to);
export const reclaimPrize = (h: ContestHandle, contest: Uint8Array, to: Payout) => h.callTx.reclaimPrize(contest, to);
export const claimForfeit = (h: ContestHandle, contest: Uint8Array, to: Payout) => h.callTx.claimForfeit(contest, to);

export type Phase = 'open' | 'revealing' | 'scoring' | 'settling' | 'forfeited' | 'settled';

/** Where a contest is, at block time `now` (unix seconds). */
export function phaseOf(c: Contest, now: bigint): Phase {
  if (c.settled) return 'settled';
  if (now < c.closesAt) return 'open';
  if (!c.revealed) return now < c.revealBy ? 'revealing' : 'forfeited';
  return now < c.scoreBy ? 'scoring' : 'settling';
}

export type MyStanding = {
  isHost: boolean;
  entered: boolean;
  score: bigint | null;
  leading: boolean;
  forfeitTaken: boolean;
};

/** What this user's key means in one contest, read from public state with local key derivation only. */
export function myStanding(l: Ledger, contest: Uint8Array, secretKey: Uint8Array): MyStanding {
  const c = l.contests.member(contest) ? l.contests.lookup(contest) : null;
  const me = pureCircuits.entrantKey(secretKey, contest);
  const isHost = c !== null && toHex(pureCircuits.hostKey(secretKey, contest)) === toHex(c.host);
  return {
    isHost,
    entered: l.entries.member(me),
    score: l.scores.member(me) ? l.scores.lookup(me) : null,
    leading: c !== null && c.best > 0n && toHex(c.leader) === toHex(me),
    forfeitTaken: l.forfeitClaims.member(me),
  };
}

export { ROWS };
