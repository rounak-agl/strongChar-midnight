// SPDX-License-Identifier: Apache-2.0
//
// Shared setup for the devnet suites: bring up a funded wallet per role, build its providers, read balances and block
// time. Remote networks read their seeds from the gitignored .env.<network> (see src/net/wallet.ts).

import { firstValueFrom } from 'rxjs';
import { WebSocket } from 'ws';
import pino from 'pino';
import type { EnvironmentConfiguration } from '@midnight-ntwrk/testkit-js';
import { encodeUserAddress } from '@midnight-ntwrk/midnight-js-protocol/v9/compact-runtime';
import { getConfig } from '../net/config.js';
import { buildProviders, type StrongCharProviders } from '../net/providers.js';
import { MidnightWalletProvider, resolveWallet, syncWallet, waitForDust, waitForNightThenDust } from '../net/wallet.js';

// GraphQL subscriptions in Node need a global WebSocket.
// @ts-expect-error assigning the ws implementation for apollo
globalThis.WebSocket = WebSocket;

export const network = process.env['MIDNIGHT_NETWORK'] ?? 'local';
export const isRemote = network !== 'local';
export const config = getConfig();
export const logger = pino({ level: process.env['LOG_LEVEL'] ?? 'info', transport: { target: 'pino-pretty' } });

const envConfig: EnvironmentConfiguration = { walletNetworkId: config.networkId, ...config };
const syncTimeoutMs = Number(process.env['MIDNIGHT_SYNC_TIMEOUT_MS'] ?? (isRemote ? 120 * 60_000 : 10 * 60_000));

/** The NIGHT token's colour: 32 zero bytes. */
export const NIGHT = '0'.repeat(64);

export type Actor = { role: string; wallet: MidnightWalletProvider; providers: StrongCharProviders };

/** Build, sync and fund the wallet for `role`, then its providers against `zkConfigPath`. */
export async function bringUp(role: string, zkConfigPath: string): Promise<Actor> {
  const setup = resolveWallet(network, role);
  const wallet = await MidnightWalletProvider.build(logger, envConfig, setup.secret);
  await wallet.start();
  await syncWallet(logger, wallet.wallet, syncTimeoutMs);
  if (isRemote) {
    await waitForNightThenDust(logger, wallet.wallet, wallet.unshieldedKeystore, envConfig, config.faucet, {
      label: `${role} (${setup.role})`,
    });
  } else {
    await waitForDust(logger, wallet.wallet, 1, syncTimeoutMs, config.indexer);
  }
  return { role, wallet, providers: buildProviders(wallet, zkConfigPath, config) };
}

/**
 * A second identity paying from the same wallet: its own providers, so its own private-state store and secret key.
 * The local devnet funds only three wallets, and a contract identity is a key, not a wallet.
 */
export const sameWallet = (a: Actor, role: string, zkConfigPath: string): Actor => ({
  role,
  wallet: a.wallet,
  providers: buildProviders(a.wallet, zkConfigPath, config),
});

export async function tearDown(actors: (Actor | undefined)[]): Promise<void> {
  for (const a of actors) if (a) await a.wallet.stop().catch(() => undefined);
}

/** A wallet's own unshielded address, as the { bytes } struct a UserAddress argument takes. */
export const payoutOf = (a: Actor) => ({ bytes: encodeUserAddress(a.wallet.unshieldedKeystore.getAddress()) });

export async function nightBalance(a: Actor): Promise<bigint> {
  const s = await firstValueFrom(a.wallet.wallet.state());
  return BigInt((s.unshielded.balances as Record<string, bigint>)[NIGHT] ?? 0n);
}

/** Poll until a wallet's NIGHT balance reaches `expected` (wallets sync a moment after a tx is final). */
export async function waitForNight(a: Actor, expected: bigint, timeoutMs = 120_000): Promise<bigint> {
  const start = Date.now();
  let last = await nightBalance(a);
  while (last !== expected && Date.now() - start < timeoutMs) {
    await new Promise((r) => setTimeout(r, 2_000));
    last = await nightBalance(a);
  }
  return last;
}

/** The indexer's latest block time in unix seconds. */
export async function chainTime(): Promise<bigint> {
  const res = await fetch(config.indexer, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query: 'query { block { timestamp } }' }),
  });
  const body = (await res.json()) as { data?: { block?: { timestamp: number } } };
  const ts = body.data?.block?.timestamp;
  if (ts === undefined) throw new Error('indexer gave no block timestamp');
  // The indexer reports milliseconds.
  return BigInt(Math.floor(ts / 1000));
}

/** Wait until the chain's block time is at or past `deadline` (unix seconds). */
export async function waitForChainTime(deadline: bigint, timeoutMs = 15 * 60_000): Promise<void> {
  const start = Date.now();
  while ((await chainTime()) < deadline) {
    if (Date.now() - start > timeoutMs) throw new Error(`chain time never reached ${deadline}`);
    await new Promise((r) => setTimeout(r, 3_000));
  }
}
