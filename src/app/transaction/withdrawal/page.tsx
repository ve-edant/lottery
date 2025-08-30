/* eslint-disable */
"use client";

import { useState } from "react";
import { IoWalletOutline } from "react-icons/io5";
import { BsCreditCard2Back } from "react-icons/bs";


export default function WalletPage() {
  const [balance, setBalance] = useState(0.0);
  const [arbBalance, setArbBalance] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);

  return (
    <div className="min-h-screen w-xl bg-gray-50 p-4 space-y-4">
      {/* Available Balance Card */}
      <div className="bg-gradient-to-r from-[#f95959] to-[#ff988d] text-white p-4 rounded-2xl shadow-md flex flex-col">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm">Available balance</p>
            <h1 className="text-3xl font-bold">₹{balance.toFixed(2)}</h1>
          </div>
          <IoWalletOutline className="w-8 h-8 opacity-80" />
        </div>
      </div>

      {/* ARPay Section */}
      <div className="bg-gradient-to-r from-[#f95959] to-[#ff988d] p-4 rounded-2xl shadow-md text-white">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold">ARPay</h2>
          <span className="bg-red-600 px-2 py-1 rounded-lg text-xs">1%+1%</span>
        </div>
        <p className="text-xs mt-1 opacity-90">
          Supports UPI for fast payment, and bonuses for withdrawals
        </p>

        <div className="flex justify-around mt-3">
          <div className="flex flex-col items-center">
            <BsCreditCard2Back className="w-10 h-10 text-white mb-1" />
            <span className="text-sm">BANK CARD</span>
          </div>
          <div className="flex flex-col items-center">
            <img
              src="https://www.svgrepo.com/show/428649/usdc-usd-coin.svg"
              alt="USDT"
              className="w-10 h-10 mb-1"
            />
            <span className="text-sm">USDT</span>
          </div>
        </div>
      </div>

      {/* Rules */}
      <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm">
        <p className="text-sm font-medium">AR Pay transaction rules</p>
        <button className="text-red-500 text-sm font-semibold">Check &gt;</button>
      </div>

      {/* My ARB */}
      <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm">
        <div className="flex items-center space-x-2">
          <img
            src="https://cryptologos.cc/logos/arbitrum-arb-logo.png"
            alt="ARB"
            className="w-6 h-6"
          />
          <p className="font-medium">My ARB</p>
          <span className="text-gray-600">{arbBalance} ARB</span>
        </div>
        <button className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm">
          Enter wallet
        </button>
      </div>

      {/* Withdraw Section */}
      <div className="bg-white p-4 rounded-2xl shadow-md space-y-3">
        <h2 className="font-semibold">Withdraw as ARB</h2>

        <div className="flex items-center bg-gray-100 p-2 rounded-xl">
          <span className="text-red-500 font-bold">₹</span>
          <input
            type="number"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(Number(e.target.value))}
            placeholder="0"
            className="flex-1 bg-transparent outline-none px-2"
          />
          <button
            onClick={() => setWithdrawAmount(balance)}
            className="text-red-500 font-semibold"
          >
            All
          </button>
        </div>

        <p className="text-sm text-red-500">
          Withdrawable balance ₹{balance.toFixed(2)}
        </p>
        <p className="text-sm text-gray-600">
          Withdrawal amount received <span className="text-orange-500">₹{withdrawAmount.toFixed(2)}</span>
        </p>

        <button className="w-full bg-gradient-to-r from-[#f95959] to-[#ff988d] text-white py-2 rounded-xl shadow-md font-semibold">
          Withdraw
        </button>
      </div>
    </div>
  );
}