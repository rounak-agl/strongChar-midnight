// SPDX-License-Identifier: Apache-2.0
//
// Private state for the sealed-jobs contract: only the actor's secret key, which enters proofs and never the chain.
// Runs in the browser too, so no node:* imports.

import type { WitnessContext } from '@midnight-ntwrk/midnight-js-protocol/v9/compact-runtime';
import type { Ledger } from './managed/jobs/contract/index.js';

export type JobsPrivateState = { readonly secretKey: Uint8Array };

export const createJobsPrivateState = (secretKey: Uint8Array): JobsPrivateState => ({ secretKey });

export const jobsWitnesses = {
  localSecretKey: ({ privateState }: WitnessContext<Ledger, JobsPrivateState>): [JobsPrivateState, Uint8Array] => [
    privateState,
    privateState.secretKey,
  ],
};
