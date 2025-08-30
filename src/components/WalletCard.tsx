"use client";

import { useState, useEffect } from "react";
import { FiRefreshCcw } from "react-icons/fi";
import { FaWallet } from "react-icons/fa";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface WalletCardProps {
  initialBalance?: number;
}

export default function WalletCard({ initialBalance = 0 }: WalletCardProps) {
  const [wallet, setWallet] = useState(initialBalance);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  // Set initial balance when prop changes
  useEffect(() => {
    setWallet(initialBalance);
  }, [initialBalance]);

  // Function to fetch current balance
  const fetchBalance = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch('/api/user/wallet');
      if (!response.ok) {
        throw new Error('Failed to fetch balance');
      }
      
      const data = await response.json();
      setWallet(data.balance);
      toast.success('Balance updated!');
    } catch (error) {
      console.error('Error fetching balance:', error);
      toast.error('Failed to refresh balance');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle refresh button click
  const handleRefresh = () => {
    if (!isRefreshing) {
      fetchBalance();
    }
  };

  return (
    <div className="w-full max-w-xl bg-gradient-to-br from-[#fef6e4] to-[#f7d9bd] rounded-3xl shadow-lg p-6 flex flex-col gap-4">
      {/* Top Row */}
      <div className="flex items-center justify-between">
        {/* Left: Wallet Info */}
        <div className="flex items-center gap-4">
          <FaWallet className="text-red-500 text-4xl drop-shadow-sm" />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Total Balance</h2>
            <p className="text-sm text-gray-500">Wallet</p>
          </div>
        </div>
        {/* Right: Amount + Refresh */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-gray-900">₹{wallet.toLocaleString()}</span>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`text-gray-500 cursor-pointer hover:text-gray-700 transition-all duration-300 ${
              isRefreshing ? 'animate-spin' : 'hover:rotate-180'
            } disabled:cursor-not-allowed`}
            title="Refresh Balance"
          >
            <FiRefreshCcw className="text-xl" />
          </button>
        </div>
      </div>
      {/* Bottom Row: Buttons */}
      <div className="flex gap-3 justify-end">
        <button 
          onClick={() => router.push("/transaction/withdrawal")} 
          className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 px-5 rounded-full shadow transition-all duration-200 hover:scale-105"
        >
          Withdraw
        </button>
        <button 
          onClick={() => router.push("/transaction/recharge")} 
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-5 rounded-full shadow transition-all duration-200 hover:scale-105"
        >
          Recharge
        </button>
      </div>
    </div>
  );
}