// The proving setting: where zero-knowledge proofs are made. Only two choices exist, both on the user's own machine.
// There is deliberately no field for another URL: whoever runs a proof server sees the labels and predictions.
import { DEFAULT_PROOF_SERVER_URL, type ProvingMode, type ProvingOptions } from '../midnight/providers';
import { storage } from '../lib/storage';

const KEY = 'strongchar:proving';

export const proving = {
  load: (): ProvingMode => (storage.get(KEY) === 'local' ? 'local' : 'wallet'),
  save: (mode: ProvingMode): void => storage.set(KEY, mode),
  options: (mode: ProvingMode): ProvingOptions => ({ mode, proofServerUrl: DEFAULT_PROOF_SERVER_URL }),
};
