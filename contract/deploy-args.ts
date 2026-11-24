// SPDX-License-Identifier: Apache-2.0
//
// What `npm run deploy [contest|jobs]` deploys. Neither constructor takes arguments. The deploying key is read from
// .strongchar/<network>/ (created on first use): for jobs it becomes the admin that seats verifiers.

import { deployable, type Deployable } from '../src/net/deployments.js';
import { loadOrCreateKey } from '../src/net/keys.js';
import { CONTEST_STATE_ID } from '../src/api/contest.js';
import { JOBS_STATE_ID } from '../src/api/jobs.js';
import { CompiledContestContract, CompiledJobsContract, contestZkPath, jobsZkPath } from './index.js';
import { createPrivateState } from './witnesses.js';
import { createJobsPrivateState } from './jobs-witnesses.js';

const network = () => process.env['MIDNIGHT_NETWORK'] ?? 'local';

export const deployables: Record<string, Deployable<any>> = {
  contest: deployable({
    compiledContract: CompiledContestContract,
    zkConfigPath: contestZkPath,
    privateStateId: CONTEST_STATE_ID,
    get initialPrivateState() {
      return createPrivateState(loadOrCreateKey(network(), 'contest-deployer'));
    },
  }),
  jobs: deployable({
    compiledContract: CompiledJobsContract,
    zkConfigPath: jobsZkPath,
    privateStateId: JOBS_STATE_ID,
    get initialPrivateState() {
      return createJobsPrivateState(loadOrCreateKey(network(), 'jobs-admin'));
    },
  }),
};
