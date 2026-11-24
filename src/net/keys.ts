// SPDX-License-Identifier: Apache-2.0
//
// Per-network secret keys for the Node tools, one 32-byte key per identity under .strongchar/<network>/ (gitignored,
// mode 0600). A key is the user's whole identity in a contract: losing the jobs admin key means no more verifiers
// can be seated, and losing a host key means a contest's labels can never be opened. Back the folder up off local.

import { randomBytes } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../../.strongchar/', import.meta.url));

const keyFile = (network: string, name: string) => {
  if (!/^[a-z0-9-]+$/.test(network) || !/^[a-z0-9-]+$/.test(name)) throw new Error(`bad key name ${network}/${name}`);
  return path.join(ROOT, network, `${name}.key`);
};

/** The stored key, or a new one written with owner-only permissions. */
export function loadOrCreateKey(network: string, name: string): Uint8Array {
  const file = keyFile(network, name);
  if (fs.existsSync(file)) {
    const hex = fs.readFileSync(file, 'utf8').trim();
    if (!/^[0-9a-f]{64}$/.test(hex)) throw new Error(`${file} is not a 32-byte hex key`);
    return Uint8Array.from(Buffer.from(hex, 'hex'));
  }
  const key = new Uint8Array(randomBytes(32));
  fs.mkdirSync(path.dirname(file), { recursive: true, mode: 0o700 });
  fs.writeFileSync(file, `${Buffer.from(key).toString('hex')}\n`, { mode: 0o600, flag: 'wx' });
  return key;
}
