// SPDX-License-Identifier: Apache-2.0
//
// The two contracts wired to their witnesses, for midnight-js. Shared by Node and the browser, so the place the ZK
// assets live is a parameter: an absolute directory in Node, a path under the page origin in the browser (where
// midnight-js reads the keys through the providers' zkConfigProvider and this path only satisfies the type).

import { CompiledContract } from '@midnight-ntwrk/midnight-js-protocol/v9/compact-js';
import { Contract as ContestContract } from './managed/contest/contract/index.js';
import { Contract as JobsContract } from './managed/jobs/contract/index.js';
import { witnesses } from './witnesses.js';
import { jobsWitnesses } from './jobs-witnesses.js';

export const compiledContest = (assetsPath: string) =>
  CompiledContract.make('SealedContest', ContestContract).pipe(
    CompiledContract.withWitnesses(witnesses),
    CompiledContract.withCompiledFileAssets(assetsPath),
  );

export const compiledJobs = (assetsPath: string) =>
  CompiledContract.make('SealedJobs', JobsContract).pipe(
    CompiledContract.withWitnesses(jobsWitnesses),
    CompiledContract.withCompiledFileAssets(assetsPath),
  );

export type CompiledContest = ReturnType<typeof compiledContest>;
export type CompiledJobs = ReturnType<typeof compiledJobs>;
