// Adapted from examples/battleship/ui/scripts/copy-zk.mjs in midnightntwrk/midnight-examples; modified for strongChar.
//
// Copies the compiled ZK artifacts of both contracts into public/ so the browser
// can fetch them.
//
// Why: in Node the harness reads keys from disk (NodeZkConfigProvider). A browser
// can't, so the UI uses FetchZkConfigProvider, which GETs
//   <base>/keys/<circuit>.prover, <base>/keys/<circuit>.verifier, <base>/zkir/<circuit>.bzkir
// and checks each one against <base>/compiler/contract-manifest.json, the
// compiler's integrity manifest (Midnight.js 5 refuses unverified artifacts by
// default), so compiler/ is copied too.
// We serve them from /managed/<contract>/ (see src/midnight/contracts.ts).
//
// `npm run dev` and `npm run build` run it first.
// The source is the gitignored output of `npm run compile` at the repo root,
// and the destination (public/managed/) is gitignored too.
//
// It also refuses to run on a Node older than the repo root's engines.node:
// npm doesn't enforce `engines`, and an old default Node crashes the dev server
// with an unrelated-looking error. This is the first thing `dev` and `build`
// run, so it fails early and clearly.
import { cpSync, existsSync, readdirSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

const range = JSON.parse(readFileSync(path.resolve(here, "../../package.json"), "utf8")).engines?.node;
const min = Number(/^>=\s*(\d+)/.exec(range ?? "")?.[1]);
if (min && Number(process.versions.node.split(".")[0]) < min) {
  console.error(`[copy:zk] Node ${process.versions.node} is too old: this repo needs Node ${range}.`);
  process.exit(1);
}

const managed = path.resolve(here, "../../contract/managed");
const contracts = ["contest", "jobs"];

const has = (file) => existsSync(file) && readdirSync(file).length > 0;
// `compile:fast` leaves zkir/ but no keys, so check for the key files themselves.
const hasKeys = (dir) => has(dir) && readdirSync(dir).some((f) => f.endsWith(".prover"));

for (const c of contracts) {
  const source = path.join(managed, c);
  if (!hasKeys(path.join(source, "keys")) || !has(path.join(source, "zkir")) || !has(path.join(source, "compiler"))) {
    console.error(
      `[copy:zk] ${source} has no compiled ZK keys.\n` +
        "Compile the contracts first (from the repo root):  npm run compile",
    );
    process.exit(1);
  }
}

const destRoot = path.resolve(here, "../public/managed");
rmSync(destRoot, { recursive: true, force: true });
for (const c of contracts) {
  for (const dir of ["keys", "zkir", "compiler"]) {
    cpSync(path.join(managed, c, dir), path.join(destRoot, c, dir), { recursive: true });
  }
}
console.log(
  `[copy:zk] copied keys/, zkir/ and compiler/ of ${contracts.join(", ")} to ${path.relative(process.cwd(), destRoot)}`,
);
