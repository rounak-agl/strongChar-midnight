// SPDX-License-Identifier: Apache-2.0
//
// Private state for the sealed-contest contract and the witnesses that feed it into circuits. Nothing here is ever
// written on chain: predictions, labels and salts only enter proofs. Runs in the browser too, so no node:* imports.

import type { WitnessContext } from '@midnight-ntwrk/midnight-js-protocol/v9/compact-runtime';
import type { Ledger } from './managed/contest/contract/index.js';

export const ROWS = 64;

export type ContestSecrets = {
  /** This entrant's predictions, one class index per test row. */
  readonly predictions?: readonly number[];
  readonly predictionSalt?: Uint8Array;
  /** Host side: the hidden labels, kept here until the reveal. No witness reads them. */
  readonly labels?: readonly number[];
  /** Host side: the hidden labels' salt. */
  readonly labelSalt?: Uint8Array;
};

export type ContestPrivateState = {
  readonly secretKey: Uint8Array;
  /** Keyed by contest id in hex. */
  readonly contests: Readonly<Record<string, ContestSecrets>>;
};

export const toHex = (b: Uint8Array): string => Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');

export const createPrivateState = (secretKey: Uint8Array): ContestPrivateState => ({ secretKey, contests: {} });

/** Returns a new state with this contest's secrets merged in. */
export const withSecrets = (ps: ContestPrivateState, contest: Uint8Array, s: ContestSecrets): ContestPrivateState => ({
  ...ps,
  contests: { ...ps.contests, [toHex(contest)]: { ...ps.contests[toHex(contest)], ...s } },
});

const secrets = (ps: ContestPrivateState, contest: Uint8Array): ContestSecrets => {
  const s = ps.contests[toHex(contest)];
  if (!s) throw new Error(`no private data for contest ${toHex(contest)}`);
  return s;
};

const need = <T>(v: T | undefined, what: string): T => {
  if (v === undefined) throw new Error(`missing ${what}`);
  return v;
};

export const checkRow = (values: readonly number[]): bigint[] => {
  if (values.length !== ROWS) throw new Error(`expected ${ROWS} values, got ${values.length}`);
  return values.map((v) => {
    if (!Number.isInteger(v) || v < 0 || v > 255) throw new Error(`class index out of range: ${v}`);
    return BigInt(v);
  });
};

type Ctx = WitnessContext<Ledger, ContestPrivateState>;

export const witnesses = {
  localSecretKey: ({ privateState }: Ctx): [ContestPrivateState, Uint8Array] => [privateState, privateState.secretKey],
  predictions: ({ privateState }: Ctx, contest: Uint8Array): [ContestPrivateState, bigint[]] => [
    privateState,
    checkRow(need(secrets(privateState, contest).predictions, 'predictions')),
  ],
  predictionSalt: ({ privateState }: Ctx, contest: Uint8Array): [ContestPrivateState, Uint8Array] => [
    privateState,
    need(secrets(privateState, contest).predictionSalt, 'prediction salt'),
  ],
  labelSalt: ({ privateState }: Ctx, contest: Uint8Array): [ContestPrivateState, Uint8Array] => [
    privateState,
    need(secrets(privateState, contest).labelSalt, 'label salt'),
  ],
  shareOf: ({ privateState }: Ctx, prize: bigint, entries: bigint): [ContestPrivateState, bigint] => [
    privateState,
    entries === 0n ? 0n : prize / entries,
  ],
};
