import { DEFAULT_PROOF_SERVER_URL, type ProvingMode } from '../midnight/providers';
import { useMidnightProviders } from './MidnightProviders';

const CHOICES: { mode: ProvingMode; label: string }[] = [
  { mode: 'wallet', label: 'Prove in wallet' },
  { mode: 'local', label: 'Local proof server' },
];

export function ProvingSettings() {
  const { provingMode, setProvingMode } = useMidnightProviders();
  return (
    <fieldset className="flex flex-wrap items-center gap-4">
      <legend className="sr-only">Where proofs are made</legend>
      {CHOICES.map(({ mode, label }) => (
        <label key={mode} className="flex items-center gap-2">
          <input type="radio" name="proving" checked={provingMode === mode} onChange={() => setProvingMode(mode)} />
          {label}
        </label>
      ))}
      {provingMode === 'local' && (
        <span className="text-ink-soft">
          Expects a proof server you run at <code>{DEFAULT_PROOF_SERVER_URL}</code>.
        </span>
      )}
    </fieldset>
  );
}
