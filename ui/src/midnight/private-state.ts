// Adapted from examples/battleship/ui/src/midnight/private-state.ts in midnightntwrk/midnight-examples; modified for strongChar.
// The private-state store: midnight-js's own levelPrivateStateProvider on
// IndexedDB, AES-GCM encrypted under a passphrase the user types each session.
// It has to persist: it holds the secret key that is the user's on-chain
// identity, a host's labels until the reveal, and an entrant's predictions
// until scoring.
import type { PrivateStateProvider } from "@midnight-ntwrk/midnight-js-types";

/** The IndexedDB database the persistent store lives in (one per UI). */
export const PERSISTENT_DB_NAME = "strongchar-private-state";

/**
 * levelPrivateStateProvider scopes private state by contract address, and
 * never checks the password until it decrypts a value. We store one canary
 * under a reserved address so a wrong passphrase is reported at unlock time,
 * not later as an opaque decrypt failure in the middle of a tx. The address
 * must be 32 bytes of hex; a deployed contract's address is a hash, so none
 * is all zeros.
 */
const CANARY_ADDRESS = "00".repeat(32);
const CANARY_ID = "canary";

export class WrongPassphraseError extends Error {
  constructor(cause: unknown) {
    super(
      "That passphrase doesn't open this browser's private state for this wallet account. " +
        "Use the passphrase you chose the first time.",
      { cause },
    );
    this.name = "WrongPassphraseError";
  }
}

/**
 * Encrypted IndexedDB private state, via @midnight-ntwrk/midnight-js-level-private-state-provider
 * (the same provider the Node harness uses; `level` resolves to `browser-level`
 * in the browser build).
 *
 * - `accountId` scopes the store (the provider hashes it), so two wallet
 *   accounts in one browser never see each other's state. Use the wallet's
 *   shielded coin public key.
 * - `passphrase` must pass midnight-js-utils' `validatePassword` (16+ chars,
 *   3 character classes, no runs/sequences). It is only ever held in memory.
 * - There is no recovery: clearing site data or forgetting the passphrase
 *   loses the private state for good (the provider's own warning).
 *
 * Imported lazily, so the first page load doesn't bundle `level`.
 */
export async function persistentPrivateStateProvider<PSI extends string, PS>(options: {
  accountId: string;
  passphrase: string;
}): Promise<PrivateStateProvider<PSI, PS>> {
  const { levelPrivateStateProvider } = await import(
    "@midnight-ntwrk/midnight-js-level-private-state-provider"
  );
  const provider = levelPrivateStateProvider<PSI, PS>({
    midnightDbName: PERSISTENT_DB_NAME,
    accountId: options.accountId,
    privateStoragePasswordProvider: () => options.passphrase,
    cryptoBackend: "webcrypto",
  });

  // Validate the passphrase against the store before handing it out. The
  // canary lives under its own pseudo-address, so no contract's state sees it.
  const canary = (provider as unknown as PrivateStateProvider<string, { ok: true }>).forContract(
    CANARY_ADDRESS,
  );
  let existing: { ok: true } | null;
  try {
    existing = await canary.get(CANARY_ID);
  } catch (err: unknown) {
    throw new WrongPassphraseError(err);
  }
  if (existing === null) await canary.set(CANARY_ID, { ok: true });
  return provider;
}
