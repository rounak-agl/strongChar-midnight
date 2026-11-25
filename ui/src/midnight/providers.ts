// Adapted from examples/battleship/ui/src/midnight/providers.ts in midnightntwrk/midnight-examples; modified for strongChar.
// Builds the MidnightProviders bundle for the browser.
//
// This mirrors src/net/providers.ts (the Node side), with
// each Node-only piece swapped for a browser one:
//
//   provider              Node                          Browser (here)
//   --------------------  ----------------------------  ---------------------------------------
//   publicDataProvider    indexer (src/net/config.ts)   indexer URIs from the wallet's config
//   zkConfigProvider      NodeZkConfigProvider (disk)   FetchZkConfigProvider (HTTP, /managed/…)
//   proofProvider         local proof server            wallet-delegated OR local proof server
//   privateStateProvider  LevelDB (disk)                LevelDB on IndexedDB (./private-state.ts)
//   walletProvider        wallet-sdk WalletFacade       the wallet, via the DApp Connector API
//   midnightProvider      wallet-sdk WalletFacade       the wallet, via the DApp Connector API
import type { ConnectedAPI } from "@midnight-ntwrk/dapp-connector-api";
import { dappConnectorProofProvider } from "@midnight-ntwrk/midnight-js-dapp-connector-proof-provider";
import { FetchZkConfigProvider } from "@midnight-ntwrk/midnight-js-fetch-zk-config-provider";
import { httpClientProofProvider } from "@midnight-ntwrk/midnight-js-http-client-proof-provider";
import { indexerPublicDataProvider } from "@midnight-ntwrk/midnight-js-indexer-public-data-provider";
import {
  CostModel,
  Transaction,
  type FinalizedTransaction,
} from "@midnight-ntwrk/midnight-js-protocol/v9";
import { ContractState } from "@midnight-ntwrk/midnight-js-protocol/v9/compact-runtime";
import {
  createLedger9MidnightProvider,
  createLedger9WalletProvider,
  type ContractStateRead,
  type MidnightProviders,
  type ProofProvider,
} from "@midnight-ntwrk/midnight-js-types";
import {
  fromHex,
  parseCoinPublicKeyToHex,
  parseEncPublicKeyToHex,
  toHex,
} from "@midnight-ntwrk/midnight-js-utils";
import { persistentPrivateStateProvider } from "./private-state";

/**
 * A providers bundle for one of the compiled contracts, keyed by its circuit
 * ids. src/api accepts any of these.
 */
export type ContractProviders<C extends string> = MidnightProviders<C>;

/**
 * Where ZK proofs get generated.
 *  - "wallet": the connected wallet proves (ConnectedAPI.getProvingProvider).
 *    There's nothing else to run, and witness data never leaves the wallet.
 *  - "local": a proof server you run yourself (`npm run proof:up` at the repo
 *    root), same as the Node tests.
 * Avoid public/hosted proof servers: whoever runs them sees your proof inputs.
 */
export type ProvingMode = "wallet" | "local";

export interface ProvingOptions {
  mode: ProvingMode;
  /** Used only when mode === "local". */
  proofServerUrl: string;
}

export const DEFAULT_PROOF_SERVER_URL = "http://127.0.0.1:6300";

/**
 * The state data the compiler-generated `ledger()` decodes, from a contract
 * state as the public-data provider serves it. Midnight.js 5 serves the
 * serialized state tagged with the ledger era that wrote it; a contract
 * deployed from this UI is always ledger 9, so only a ledger 9 decoder is given.
 */
export function contractStateData(read: ContractStateRead) {
  if (read.contractState.era !== "v9") throw new Error("Expected a ledger 9 contract state");
  return read.contractState.deserialize({ v9: ContractState }).data;
}

/**
 * How long a built transaction stays valid (MidnightConfig.ttlSeconds). The
 * wallet behind the DApp Connector picks its own TTL for what it adds; this
 * one covers the contract call midnight-js builds.
 */
const TX_TTL_SECONDS = 3600;

/**
 * Build the providers for one compiled contract, whose keys and zkir are
 * served from `zkAssetsPath` (`managed/<contract>`; scripts/copy-zk.mjs copies
 * both). Call this once per contract.
 *
 * `passphrase` unlocks the encrypted private-state store.
 *
 * Every call gets its own private-state provider; midnight-js scopes every
 * read and write by contract address (`forContract`).
 */
export async function createContractProviders<C extends string>(
  api: ConnectedAPI,
  proving: ProvingOptions,
  passphrase: string,
  zkAssetsPath: string,
): Promise<ContractProviders<C>> {
  // The wallet decides which network we're on. Everything below (indexer
  // endpoints, network id for address encoding) follows from its config, so
  // the same build works on local `undeployed`, preview, and preprod.
  const config = await api.getConfiguration();
  // Pass the browser's WebSocket explicitly. The provider's default comes from
  // `import * as ws from 'isomorphic-ws'` and reads `ws.WebSocket`, but the
  // browser build of isomorphic-ws only has a default export, so that default
  // is `undefined` once bundled (Vite warns about this at build time). The
  // Node side gets around it with `globalThis.WebSocket = WebSocket`.
  const publicDataProvider = indexerPublicDataProvider(
    config.indexerUri,
    config.indexerWsUri,
    window.WebSocket as unknown as Parameters<typeof indexerPublicDataProvider>[2],
  );

  // Fetches keys/<circuit>.{prover,verifier} and zkir/<circuit>.bzkir for
  // each circuit from the page's own origin, and checks them against
  // compiler/contract-manifest.json. scripts/copy-zk.mjs puts them there.
  const zkConfigProvider = new FetchZkConfigProvider<C>(
    new URL(zkAssetsPath, window.location.origin).toString(),
    { fetchFunc: fetch.bind(window) },
  );

  const proofProvider = await createProofProvider(api, zkConfigProvider, proving);

  // The connector returns Bech32m-encoded keys. The ledger works with hex, so
  // normalize both here. parse*ToHex passes hex through unchanged.
  const { shieldedCoinPublicKey, shieldedEncryptionPublicKey } =
    await api.getShieldedAddresses();
  const coinPublicKey = parseCoinPublicKeyToHex(shieldedCoinPublicKey, config.networkId);
  const encryptionPublicKey = parseEncPublicKeyToHex(
    shieldedEncryptionPublicKey,
    config.networkId,
  );

  // createLedger9WalletProvider / createLedger9MidnightProvider lift these
  // Ledger 9-only implementations into midnight-js's era-tagged interfaces:
  // they hand us ledger 9 transaction handles (bytes plus era), seal what we
  // return, and declare supportedEras = ['v9'].
  const walletProvider = createLedger9WalletProvider({
    getCoinPublicKey: () => coinPublicKey,
    getEncryptionPublicKey: () => encryptionPublicKey,
    // midnight-js hands us a proven but *unbound* transaction
    // (Transaction<SignatureEnabled, Proof, PreBinding>). The Node side
    // balances it with WalletFacade.balanceUnboundTransaction. In the browser
    // the connected wallet does the same job: it adds DUST fee inputs, signs,
    // and binds. The connector speaks hex strings, so we send the handle's
    // bytes, and deserialize the result as a FinalizedTransaction
    // (Transaction<SignatureEnabled, Proof, Binding>). The TTL is up to the
    // wallet; the connector has no ttl parameter.
    balanceTx: async (tx, _ttl) => {
      const { tx: balancedHex } = await api.balanceUnsealedTransaction(
        toHex(tx.serialize()),
      );
      return Transaction.deserialize(
        "signature",
        "proof",
        "binding",
        fromHex(balancedHex),
      ) satisfies FinalizedTransaction;
    },
  });

  // submitTransaction resolves to void, so read the tx id off the
  // transaction itself (the same id the indexer reports).
  const midnightProvider = createLedger9MidnightProvider(async (handle) => {
    const bytes = handle.serialize();
    await api.submitTransaction(toHex(bytes));
    const tx = Transaction.deserialize("signature", "proof", "binding", bytes);
    const [txId] = tx.identifiers();
    if (!txId) throw new Error("Submitted transaction has no identifier");
    return txId;
  });

  const privateStateProvider = await createPrivateStateProvider(coinPublicKey, passphrase);

  return {
    privateStateProvider,
    publicDataProvider,
    zkConfigProvider,
    proofProvider,
    walletProvider,
    midnightProvider,
    config: { networkId: config.networkId, ttlSeconds: TX_TTL_SECONDS },
  };
}

// Scoped per wallet account: switching accounts in the wallet switches stores.
// Both contracts share one store instance per account and passphrase: one IndexedDB handle, one key derivation,
// and one place to back up (it already scopes every read and write by contract address). A failed open isn't
// kept, so a corrected passphrase is tried afresh.
let shared: { accountId: string; passphrase: string; store: ReturnType<typeof persistentPrivateStateProvider> } | null =
  null;

function createPrivateStateProvider(accountId: string, passphrase: string) {
  if (shared?.accountId !== accountId || shared.passphrase !== passphrase) {
    const store = persistentPrivateStateProvider({ accountId, passphrase });
    shared = { accountId, passphrase, store };
    store.catch(() => {
      if (shared?.store === store) shared = null;
    });
  }
  return shared.store;
}

async function createProofProvider<C extends string>(
  api: ConnectedAPI,
  zkConfigProvider: FetchZkConfigProvider<C>,
  proving: ProvingOptions,
): Promise<ProofProvider> {
  if (proving.mode === "local") {
    return httpClientProofProvider(proving.proofServerUrl, zkConfigProvider);
  }
  // The wallet gets the key material from zkConfigProvider and proves itself.
  // httpClientProofProvider uses CostModel.initialCostModel() internally, so we
  // pass the same one here.
  return dappConnectorProofProvider(
    api,
    zkConfigProvider,
    CostModel.initialCostModel(),
  );
}
