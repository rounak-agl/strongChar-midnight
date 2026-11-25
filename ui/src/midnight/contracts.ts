// The two compiled contracts as the browser sees them. The ZK paths are served from the page's own origin
// (scripts/copy-zk.mjs puts the files there); each contract gets its own providers bundle for its path.
import { compiledContest, compiledJobs } from '../../../contract/compiled';

export const CONTEST_ZK = 'managed/contest';
export const JOBS_ZK = 'managed/jobs';

export const CompiledContest = compiledContest(CONTEST_ZK);
export const CompiledJobs = compiledJobs(JOBS_ZK);

export type ContestCircuits =
  | 'createContest'
  | 'enter'
  | 'revealLabels'
  | 'proveScore'
  | 'claimPrize'
  | 'reclaimPrize'
  | 'claimForfeit';

export type JobsCircuits =
  | 'addVerifier'
  | 'registerNode'
  | 'createJob'
  | 'submitResult'
  | 'vote'
  | 'collect'
  | 'withdrawEarnings'
  | 'leave';

// Private-state ids, one per contract, shared with the Node side.
export { CONTEST_STATE_ID } from '../../../src/api/contest';
export { JOBS_STATE_ID } from '../../../src/api/jobs';
