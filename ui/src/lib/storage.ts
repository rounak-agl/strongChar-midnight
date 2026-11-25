// Adapted from examples/battleship/ui/src/lib/storage.ts in midnightntwrk/midnight-examples; modified for strongChar.
/**
 * localStorage wrapper for per-browser conveniences (last network, proving
 * mode). Storage can be missing or throw (private
 * windows, blocked site data), so every access is guarded and the app still
 * works without it.
 */
export const storage = {
  get(key: string): string | null {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string): void {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      /* ignore */
    }
  },
  remove(key: string): void {
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  },
};
