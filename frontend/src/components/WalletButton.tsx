import React from 'react';
import { Wallet } from 'lucide-react';

export const WalletButton: React.FC = () => {
  return (
    <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/50 hover:bg-zinc-800 transition-all duration-300 backdrop-blur-sm border border-zinc-700/50">
      <Wallet className="w-4 h-4 text-zinc-400" />
      <span className="text-sm font-medium text-zinc-300">Argent</span>
    </button>
  );
};