// Adapted from examples/battleship/ui/src/components/passphrase-card.tsx in midnightntwrk/midnight-examples; modified for strongChar.
import { useState } from 'react';
import { validatePassword } from '@midnight-ntwrk/midnight-js-utils';
import { errorMessage } from '../lib/errors';
import { useMidnightProviders } from './MidnightProviders';

/**
 * Unlocks the encrypted store in this browser. The first passphrase used with a
 * wallet account becomes that store's passphrase; later sessions must repeat
 * it (a wrong one is caught by persistentPrivateStateProvider's canary and
 * reported here). It is validated with the same policy the store enforces, so a
 * weak one fails here with a readable reason rather than on the first write.
 */
export function PassphraseCard() {
  const { unlock, unlockError } = useMidnightProviders();
  const [value, setValue] = useState('');
  const [invalid, setInvalid] = useState<string | null>(null);
  const problem = invalid ?? unlockError;

  return (
    <section className="panel">
      <h2>Unlock your secrets</h2>
      <p className="text-ink-soft">
        Your keys, labels and predictions are stored encrypted in this browser. The first passphrase you use for a
        wallet account becomes its passphrase. It isn&apos;t saved anywhere and can&apos;t be recovered: if you forget
        it or clear this site&apos;s data, they are lost.
      </p>
      <form
        className="mt-4 flex flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          try {
            validatePassword(value);
          } catch (err: unknown) {
            setInvalid(errorMessage(err, 'That passphrase is too weak.'));
            return;
          }
          setInvalid(null);
          unlock(value);
        }}
      >
        <input
          type="password"
          className="field min-w-64 flex-1"
          aria-label="Passphrase"
          autoComplete="current-password"
          placeholder="16+ characters, 3 of: upper, lower, digit, symbol"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button type="submit" className="button-primary" disabled={value.length === 0}>
          Unlock
        </button>
      </form>
      {problem && (
        <p className="mt-2 text-wax" role="alert">
          {problem}
        </p>
      )}
    </section>
  );
}
