"use client";

import { useState, useEffect } from "react";
import { FiRefreshCcw } from "react-icons/fi";
import { FaWallet } from "react-icons/fa";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function WalletCard() {
  const [wallet, setWallet] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const router = useRouter();

  // Function to fetch current balance
  const fetchBalance = async (showToast = false) => {
    setIsRefreshing(true);
    try {
      const response = await fetch('/api/user/wallet');
      if (!response.ok) {
        throw new Error('Failed to fetch balance');
      }
      
      const data = await response.json();
      setWallet(data.balance);
      
      if (showToast) {
        toast.success('Balance updated!');
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
      if (showToast) {
        toast.error('Failed to refresh balance');
      }
    } finally {
      setIsRefreshing(false);
      setIsInitialLoading(false);
    }
  };

  // Fetch balance on component mount
  useEffect(() => {
    fetchBalance(false); // Don't show toast on initial load
  }, []);

  // Handle refresh button click
  const handleRefresh = () => {
    if (!isRefreshing) {
      fetchBalance(true); // Show toast on manual refresh
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
          {isInitialLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-pulse bg-gray-300 h-6 w-16 rounded"></div>
              <div className="animate-spin h-5 w-5 border-2 border-gray-400 border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
      {/* Bottom Row: Buttons */}
      <div className="flex gap-3 justify-end">
        <button 
          onClick={() => router.push("/transaction/withdrawal")} 
          disabled={isInitialLoading}
          className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 px-5 rounded-full shadow transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Withdraw
        </button>
        <button 
          onClick={() => router.push("/transaction/recharge")} 
          disabled={isInitialLoading}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-5 rounded-full shadow transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Recharge
        </button>
      </div>
    </div>
  );
}