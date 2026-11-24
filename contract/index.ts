// SPDX-License-Identifier: Apache-2.0
//
// Node entry point: both contracts compiled against their ZK assets on disk (contract/managed/<name>, written by
// `npm run compile`). The browser builds its own from contract/compiled.ts.

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { compiledContest, compiledJobs } from './compiled.js';

export {
  Contract as ContestContract,
  ledger as contestLedger,
  pureCircuits as contestCircuits,
  type Ledger as ContestLedger,
  type ImpureCircuits as ContestImpureCircuits,
} from './managed/contest/contract/index.js';
export {
  Contract as JobsContract,
  JobState,
  ledger as jobsLedger,
  pureCircuits as jobsCircuits,
  type Ledger as JobsLedger,
  type ImpureCircuits as JobsImpureCircuits,
} from './managed/jobs/contract/index.js';

import type { ImpureCircuits as CI } from './managed/contest/contract/index.js';
import type { ImpureCircuits as JI } from './managed/jobs/contract/index.js';

export type ContestCircuits = keyof CI<unknown>;
export type JobsCircuits = keyof JI<unknown>;

const here = path.dirname(fileURLToPath(import.meta.url));
export const contestZkPath = path.resolve(here, 'managed', 'contest');
export const jobsZkPath = path.resolve(here, 'managed', 'jobs');

export const CompiledContestContract = compiledContest(contestZkPath);
export const CompiledJobsContract = compiledJobs(jobsZkPath);
