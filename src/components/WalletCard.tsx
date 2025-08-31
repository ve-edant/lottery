"use client";

import { FiRefreshCcw } from "react-icons/fi";
import { FaWallet } from "react-icons/fa";
import Link from "next/link";

export default function WalletCard({
  wallet,
  isRefreshing,
  isInitialLoading,
  onRefresh,
}: {
  wallet: number;
  isRefreshing: boolean;
  isInitialLoading: boolean;
  onRefresh: () => void;
}) {

  return (
    <div className="w-full max-w-xl bg-gradient-to-br from-[#fef6e4] to-[#f7d9bd] rounded-3xl shadow-lg p-6 flex flex-col gap-4">
      {/* Top Row */}
      <div className="flex items-center justify-between">
        {/* Left: Wallet Info */}
        <div className="flex items-center gap-4">
          <FaWallet className="text-red-500 text-4xl drop-shadow-sm" />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Total Balance
            </h2>
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
              <span className="text-xl font-bold text-gray-900">
                ₹{wallet.toLocaleString()}
              </span>
              <button
                onClick={onRefresh}
                disabled={isRefreshing}
                className={`text-gray-500 cursor-pointer hover:text-gray-700 transition-all duration-300 ${
                  isRefreshing ? "animate-spin" : "hover:rotate-180"
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
        <Link href="/transaction/withdrawal">
          <button
            disabled={isInitialLoading}
            className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 px-5 rounded-full shadow transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Withdraw
          </button>
        </Link>
        <Link href="/transaction/recharge">
          <button
            disabled={isInitialLoading}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-5 rounded-full shadow transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Recharge
          </button>
        </Link>
      </div>
    </div>
  );
}
