'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WalletContextType {
  isConnected: boolean;
  accountId: string | null;
  balance: number;
  connecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  refreshBalance: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);
  const [connecting, setConnecting] = useState(false);

  // Check for existing connection on mount
  useEffect(() => {
    const storedAccountId = localStorage.getItem('hedera_account_id');
    if (storedAccountId) {
      setAccountId(storedAccountId);
      setIsConnected(true);
      refreshBalance();
    }
  }, []);

  const connectWallet = async () => {
    setConnecting(true);
    try {
      // For MVP, we'll use a simple mock connection
      // In production, integrate Web3Auth or Hedera Wallet Connect

      // Mock account for testing
      const mockAccountId = '0.0.123456';
      setAccountId(mockAccountId);
      setIsConnected(true);
      localStorage.setItem('hedera_account_id', mockAccountId);

      await refreshBalance();

      console.log('✅ Wallet connected:', mockAccountId);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    } finally {
      setConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccountId(null);
    setIsConnected(false);
    setBalance(0);
    localStorage.removeItem('hedera_account_id');
    console.log('Wallet disconnected');
  };

  const refreshBalance = async () => {
    if (!accountId) return;

    try {
      // Mock balance for testing
      // In production, query actual balance from Hedera
      const mockBalance = 1000; // 1000 HBAR
      setBalance(mockBalance);
    } catch (error) {
      console.error('Failed to refresh balance:', error);
    }
  };

  const value: WalletContextType = {
    isConnected,
    accountId,
    balance,
    connecting,
    connectWallet,
    disconnectWallet,
    refreshBalance,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};
