"use client";

import CasinoCoin from "@/components/CasioCoin";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WalletCard from "@/components/WalletCard";

// Helpers
const getRandomResult = () => Math.floor(Math.random() * 10);

const getColor = (num: number) => {
  if (num === 0) return "Violet";
  if ([1, 3, 7, 9].includes(num)) return "Green";
  if ([2, 4, 6, 8].includes(num)) return "Red";
  if (num === 5) return "Violet/Green";
  return "Red/Purple";
};

const getSize = (num: number) => (num >= 5 ? "Big" : "Small");

export default function WinGoPage() {
  const [wallet, setWallet] = useState(1000);
  const [timeLeft, setTimeLeft] = useState(60);
  const [bets, setBets] = useState<{ choice: string; amount: number }[]>([]);
  const [result, setResult] = useState<{
    number: number;
    color: string;
  } | null>(null);
  const [history, setHistory] = useState<
    { period: number; number: number; color: string; size: string }[]
  >([]);
  const [period, setPeriod] = useState(10001);
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState(1); // 1, 3, 5, 10 mins

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      handleRoundEnd();
      return;
    }
    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleRoundEnd = () => {
    const number = getRandomResult();
    const color = getColor(number);
    const size = getSize(number);

    setResult({ number, color });
    setHistory((h) => [{ period, number, color, size }, ...h.slice(0, 19)]);
    setPeriod((p) => p + 1);

    // Payout check
    bets.forEach((bet) => {
      if (
        bet.choice === color ||
        bet.choice === number.toString() ||
        bet.choice === size
      ) {
        setWallet((w) => w + bet.amount * 2);
      }
    });

    setBets([]);
    setTimeout(() => {
      setResult(null);
      setTimeLeft(mode * 60);
    }, 3000);
  };

  const placeBet = (choice: string, amount: number) => {
    if (wallet < amount) {
      alert("Not enough balance!");
      return;
    }
    setWallet((w) => w - amount);
    setBets((b) => [...b, { choice, amount }]);
  };

  const cancelBet = (idx: number) => {
    setWallet((w) => w + bets[idx].amount);
    setBets((b) => b.filter((_, i) => i !== idx));
  };

  return (
    <div className="flex flex-col items-center min-h-screen w-xl p-2 gap-6 bg-white">
      {/* Header */}
      <div className="flex justify-between w-full max-w-3xl items-center">
        <h1 className="text-3xl font-bold text-gray-800">🎲 Win-Go</h1>
        <button
          onClick={() => setShowModal(true)}
          className="text-sm text-blue-600 hover:underline"
        >
          How to Play?
        </button>
      </div>

      {/* Wallet */}
      <WalletCard />

      {/* Mode Selector */}
      <div className="flex gap-2">
        {[1, 3, 5, 10].map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setTimeLeft(m * 60);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              mode === m
                ? "bg-[#f95959] text-black"
                : "bg-gray-200 text-gray-800 hover:bg-gray-500"
            }`}
          >
            {m} Min
          </button>
        ))}
      </div>

      {/* Circular Timer */}
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="60"
            stroke="gray"
            strokeWidth="6"
            fill="transparent"
          />
          <motion.circle
            cx="64"
            cy="64"
            r="60"
            stroke="blue"
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={2 * Math.PI * 60}
            strokeDashoffset={(timeLeft / (mode * 60)) * 2 * Math.PI * 60}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-blue-600">
          {timeLeft}s
        </div>
      </div>

      {/* Betting Panel */}
      <div className="grid grid-cols-3 gap-4 w-full px-4">
        <button
          onClick={() => placeBet("Red", 100)}
          className="bg-red-500 hover:bg-red-600 text-white py-4 rounded-lg w-full"
        >
          Bet Red
        </button>
        <button
          onClick={() => placeBet("Green", 100)}
          className="bg-green-500 hover:bg-green-600 text-white py-4 rounded-lg w-full"
        >
          Bet Green
        </button>
        <button
          onClick={() => placeBet("Violet", 100)}
          className="bg-purple-500 hover:bg-purple-600 text-white py-4 rounded-lg w-full"
        >
          Bet Violet
        </button>
      </div>

      <div className="grid grid-cols-2 w-full px-4 mt-4">
        <button
          onClick={() => placeBet("Big", 100)}
          className="bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-l-full w-full"
        >
          Bet Big
        </button>
        <button
          onClick={() => placeBet("Small", 100)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white py-4 rounded-r-full w-full"
        >
          Bet Small
        </button>
      </div>

      {/* Number Bets */}
      <div className="grid grid-cols-5 gap-3">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} onClick={() => placeBet(i.toString(), 100)}>
            <CasinoCoin label={i} />
          </div>
        ))}
      </div>

      {/* Current Bets */}
      {bets.length > 0 && (
        <div className="bg-white rounded-lg shadow text-black p-4 w-full max-w-md">
          <h2 className="font-semibold mb-2">Your Bets</h2>
          <ul className="space-y-2 text-sm">
            {bets.map((bet, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center bg-gray-100 rounded px-3 py-2"
              >
                <span>
                  {bet.choice} — ₹{bet.amount}
                </span>
                <button
                  onClick={() => cancelBet(idx)}
                  className="text-red-500 hover:text-red-700 text-xs font-semibold"
                  disabled={timeLeft <= 0}
                >
                  Cancel
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center bg-white shadow-lg rounded-lg px-6 py-4"
          >
            <h2 className="text-xl font-bold">Result</h2>
            <p className="text-3xl mt-2">
              {result.number}{" "}
              <span className="text-gray-500">({getSize(result.number)})</span>{" "}
              <span className="text-gray-500">({result.color})</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History Table */}
      <div className="bg-white shadow-md rounded-lg w-full max-w-3xl overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-900">
            <tr>
              <th className="px-4 py-2">Period</th>
              <th className="px-4 py-2">Number</th>
              <th className="px-4 py-2">Big/Small</th>
              <th className="px-4 py-2">Color</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h, i) => (
              <tr key={i} className="border-t text-black">
                <td className="px-4 py-2">{h.period}</td>
                <td className="px-4 py-2 font-bold">{h.number}</td>
                <td className="px-4 py-2">{h.size}</td>
                <td
                  className={`px-4 py-2 font-semibold ${
                    h.color.includes("Red")
                      ? "text-red-600"
                      : h.color.includes("Green")
                      ? "text-green-600"
                      : "text-purple-600"
                  }`}
                >
                  {h.color}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-lg max-w-md w-full p-6"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <h2 className="text-xl font-bold mb-4 text-[#f95959]">
                How to Play
              </h2>
              <p className="text-gray-700 text-sm mb-2">
                1. Select a game mode (1, 3, 5, or 10 minutes).
              </p>
              <p className="text-gray-700 text-sm mb-2">
                2. Place bets on numbers, colors, or Big/Small before the timer
                ends.
              </p>
              <p className="text-gray-700 text-sm mb-2">
                3. When the round ends, a random number (0–9) is drawn.
              </p>
              <p className="text-gray-700 text-sm mb-4">
                4. Payouts are given if your bet matches the winning number,
                color, or size.
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="bg-[#f95959]/80 hover:bg-[#f95959] text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
