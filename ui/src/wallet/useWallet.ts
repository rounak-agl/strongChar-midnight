// Adapted from examples/battleship/ui/src/hooks/use-wallet.ts in midnightntwrk/midnight-examples; modified for strongChar.
import { useContext } from 'react';
import { WalletContext, type WalletContextValue } from './WalletContext';

export function useWallet(): WalletContextValue {
  const context = useContext(WalletContext);
  if (!context) throw new Error('useWallet must be used within a WalletProvider');
  return context;
}
