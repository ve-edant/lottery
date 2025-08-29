"use client";

import { useState } from "react";
import { IoWalletOutline } from "react-icons/io5";
import { BsCreditCard2Back } from "react-icons/bs";
import usdc from "../../../../public/usdc.svg"
import BackButton from "@/components/BackButton";

export default function DepositPage() {
  const [balance, setBalance] = useState(0.0);
  const [selectedChannel, setSelectedChannel] = useState("7Days - APP");
  const [depositAmount, setDepositAmount] = useState(0);

  const quickAmounts = [200, 500, 1000, 5000, 10000, 50000];

  const channels = [
    { name: "7Days - APP", range: "200 - 50K" },
    { name: "CpuPay-APP", range: "500 - 50K" },
    { name: "Rujia - APP", range: "200 - 50K" },
    { name: "Umoney-APP", range: "100 - 2K" },
    { name: "CloudPay - APP", range: "100 - 1K" },
    { name: "FunPay - APP", range: "300 - 1K" },
  ];

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-800">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <BackButton />
        <h1 className="font-semibold">Deposit</h1>
        <button className="text-sm text-gray-600">Deposit history</button>
      </div>

      <div className="p-4 space-y-5">
        {/* Balance Card */}
        <div className="bg-gradient-to-r from-[#f95959] to-red-500 text-white p-4 rounded-2xl shadow-md flex flex-col">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-90">Balance</p>
              <h1 className="text-3xl font-bold">₹{balance.toFixed(2)}</h1>
            </div>
            <IoWalletOutline className="w-8 h-8 opacity-80" />
          </div>
        </div>

        {/* Payment Options */}
        <div className="grid grid-cols-4 gap-3">
          {/* Active */}
          <div className="flex flex-col items-center bg-gradient-to-r from-[#f95959] to-red-500 text-white p-2 rounded-xl shadow-md scale-105 transition">
            <span className="text-xs bg-red-600 px-1 rounded">+1%</span>
            <BsCreditCard2Back className="w-8 h-8 my-1" />
            <span className="text-xs font-semibold">E-Wallet</span>
          </div>

          {/* Inactive */}
          <div className="flex flex-col items-center bg-white p-2 rounded-xl shadow hover:shadow-md transition">
            <span className="text-xs bg-red-600 px-1 rounded">+1%</span>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg"
              alt="UPI"
              className="w-16 h-8 my-1"
            />
            <span className="text-xs text-gray-700">UPI x QR</span>
          </div>

          <div className="flex flex-col items-center bg-white p-2 rounded-xl shadow hover:shadow-md transition">
            <span className="text-xs bg-red-600 px-1 rounded">+1%</span>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/4/42/Paytm_logo.png"
              alt="Paytm"
              className="w-16 h-8 my-1"
            />
            <span className="text-xs text-gray-700">Paytm x QR</span>
          </div>

          <div className="flex flex-col items-center bg-white p-2 rounded-xl shadow hover:shadow-md transition">
            <span className="text-xs bg-red-600 px-1 rounded">+2%</span>
            <img
              src="https://www.svgrepo.com/show/428649/usdc-usd-coin.svg"
              alt="USDT"
              className="w-16 h-8 my-1"
            />
            <span className="text-xs text-gray-700">USDT-TRC20</span>
          </div>
        </div>

        {/* Select Channel */}
        <div className="bg-white p-4 rounded-2xl shadow-md">
          <h2 className="font-semibold mb-3 flex items-center">
            <span className="mr-2">🖊</span> Select channel
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {channels.map((ch) => (
              <button
                key={ch.name}
                onClick={() => setSelectedChannel(ch.name)}
                className={`p-3 rounded-xl text-sm font-medium border transition duration-200 ${
                  selectedChannel === ch.name
                    ? "bg-gradient-to-r from-[#f95959] to-red-500 text-white shadow-md scale-105 border-red-500"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200"
                }`}
              >
                {ch.name}
                <br />
                <span
                  className={`text-xs ${
                    selectedChannel === ch.name
                      ? "text-white/80"
                      : "text-gray-500"
                  }`}
                >
                  Balance: {ch.range}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Deposit Amount */}
        <div className="bg-white p-4 rounded-2xl shadow-md space-y-3">
          <h2 className="font-semibold flex items-center">
            <span className="mr-2">💰</span> Deposit amount
          </h2>

          <div className="grid grid-cols-3 gap-2">
            {quickAmounts.map((amt) => (
              <button
                key={amt}
                onClick={() => setDepositAmount(amt)}
                className={`p-3 rounded-xl border transition duration-200 ${
                  depositAmount === amt
                    ? "bg-red-100 text-[#f95959] border-[#f95959] font-semibold shadow"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-200"
                }`}
              >
                ₹ {amt.toLocaleString()}
              </button>
            ))}
          </div>

          <div className="flex items-center bg-gray-100 p-2 rounded-xl border border-gray-200">
            <span className="text-[#f95959] font-bold">₹</span>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(Number(e.target.value))}
              placeholder="Enter amount"
              className="flex-1 bg-transparent outline-none px-2 text-gray-700"
            />
            <span className="text-gray-400 text-xs">₹200 - ₹50,000</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4">
          <p className="text-sm text-gray-600">
            Recharge Method:{" "}
            <span className="font-semibold">{selectedChannel}</span>
          </p>
          <button className="w-full mt-3 bg-gradient-to-r from-[#f95959] to-red-500 text-white py-2 rounded-xl font-semibold shadow hover:shadow-lg transition">
            Deposit
          </button>
        </div>
      </div>
    </div>
  );
}
