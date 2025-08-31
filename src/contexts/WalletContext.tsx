"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';

interface WalletContextType {
  balance: number;
  isLoading: boolean;
  updateBalance: (newBalance: number) => void;
  deductBalance: (amount: number) => boolean;
  addBalance: (amount: number) => void;
  refreshBalance: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch current balance from API
  const fetchBalance = async (showToast = false) => {
    try {
      const response = await fetch('/api/user/wallet');
      if (!response.ok) {
        throw new Error('Failed to fetch balance');
      }
      
      const data = await response.json();
      setBalance(data.balance);
      
      if (showToast) {
        toast.success('Balance updated!');
      }
      
      return data.balance;
    } catch (error) {
      console.error('Error fetching balance:', error);
      if (showToast) {
        toast.error('Failed to refresh balance');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Load balance on mount
  useEffect(() => {
    fetchBalance(false);
  }, []);

  // Update balance locally (for immediate UI updates)
  const updateBalance = (newBalance: number) => {
    setBalance(newBalance);
  };

  // Deduct balance (for betting) - returns success/failure
  const deductBalance = (amount: number): boolean => {
    if (balance >= amount) {
      setBalance(prev => prev - amount);
      return true;
    }
    return false;
  };

  // Add balance (for winnings)
  const addBalance = (amount: number) => {
    setBalance(prev => prev + amount);
  };

  // Refresh balance from server
  const refreshBalance = async () => {
    await fetchBalance(true);
  };

  return (
    <WalletContext.Provider value={{
      balance,
      isLoading,
      updateBalance,
      deductBalance,
      addBalance,
      refreshBalance
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}