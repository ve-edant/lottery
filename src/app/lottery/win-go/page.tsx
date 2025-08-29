"use client";

import CasinoCoin from "@/components/CasioCoin";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WalletCard from "@/components/WalletCard";
import Timer from "@/components/Timer";
import CircularTimer from "@/components/Timer";

export const dynamic = "force-dynamic";

const getRandomResult = () => Math.floor(Math.random() * 10);

const getColor = (num: number) => {
  if (num === 0) return "Red/Violet";
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
  const [mode, setMode] = useState<number>(1);
  const [modeLocked, setModeLocked] = useState(false);

  const [betModalOpen, setBetModalOpen] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [betAmount, setBetAmount] = useState(1);
  const [betQuantity, setBetQuantity] = useState(1);
  const [multiplier, setMultiplier] = useState(1);

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

    bets.forEach((bet) => {
      if (
        bet.choice === color ||
        bet.choice === number.toString() ||
        bet.choice === size ||
        bet.amount < 500
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
    if (timeLeft <= 10) return;
    if (wallet < amount) {
      alert("Not enough balance!");
      return;
    }
    setWallet((w) => w - amount);
    setBets((b) => [...b, { choice, amount }]);
    setModeLocked(true);
  };

  // Define the function
  const handleBetClick = (label: string) => {
    setSelectedChoice(label);
    setBetAmount(1);
    setBetQuantity(1);
    setMultiplier(1);
    setBetModalOpen(true);
  };

  const cancelBet = (idx: number) => {
    setWallet((w) => w + bets[idx].amount);
    setBets((b) => b.filter((_, i) => i !== idx));
  };

  useEffect(() => {
    if (bets.length === 0) {
      setModeLocked(false);
    }
  }, [bets]);

  return (
    <div className="flex flex-col items-center min-h-screen w-xl p-4 gap-6 bg-gradient-to-br from-black via-[#1a002e] to-black text-white">
      {/* Header */}
      <div className="flex justify-between w-full items-center">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg">
          🎰 Win-Go
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="text-sm text-cyan-300 hover:underline"
        >
          How to Play?
        </button>
      </div>

      {/* Wallet */}
      <div className="w-full max-w-sm">
        <WalletCard wallet={wallet} />
      </div>

      {/* Mode Selector */}
      <div className="flex gap-2">
        {[1, 3, 5, 10].map((m) => (
          <button
            key={m}
            disabled={modeLocked && mode !== m}
            onClick={() => setMode(m)}
            className={`px-5 py-2 rounded-full text-sm font-semibold shadow-md transition-all ${
              mode === m
                ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black scale-105"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            } ${
              modeLocked && mode !== m ? "opacity-40 cursor-not-allowed" : ""
            }`}
          >
            {m}x
          </button>
        ))}
      </div>

      {/* Circular Timer */}
      <CircularTimer timeLeft={timeLeft} mode={mode} />

      {/* Betting Panel */}
      <div className="flex flex-col items-center w-full gap-6 relative">
        {/* Overlay when last 10s remain */}
        {timeLeft <= 10 && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center rounded-2xl z-20">
            <p className="text-red-400 font-bold text-lg">
              Betting Closed for : {timeLeft}s
            </p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 w-full max-w-lg relative z-10">
          {[
            { label: "Red", color: "from-red-500 to-pink-600" },
            { label: "Green", color: "from-green-500 to-emerald-600" },
            { label: "Violet", color: "from-purple-500 to-pink-700" },
          ].map(({ label, color }) => (
            <button
              key={label}
              onClick={() => handleBetClick(label)}
              disabled={timeLeft <= 10} // extra safeguard
              className={`bg-gradient-to-r ${color} text-white py-4 rounded-lg w-full shadow-lg hover:scale-105 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Bet {label}
            </button>
          ))}
        </div>

        {/* Big/Small */}
        <div className="grid grid-cols-2 w-full max-w-lg mt-3 relative z-10">
          <button
            onClick={() => handleBetClick("Big")}
            disabled={timeLeft <= 10}
            className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-4 rounded-l-full w-full shadow-lg hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Bet Big
          </button>
          <button
            onClick={() => handleBetClick("Small")}
            disabled={timeLeft <= 10}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black py-4 rounded-r-full w-full shadow-lg hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Bet Small
          </button>
        </div>

        {/* Number Bets */}
        <div className="grid grid-cols-5 gap-3 relative z-10">
          {Array.from({ length: 10 }, (_, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.15, rotate: 10 }}
              className={`cursor-pointer ${
                timeLeft <= 10 ? "pointer-events-none opacity-50" : ""
              }`}
              onClick={() => handleBetClick(i.toString())}
            >
              <CasinoCoin label={i} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Current Bets */}
      {bets.length > 0 && (
        <div className="w-full max-w-md bg-gradient-to-br from-purple-900/40 to-cyan-900/40 backdrop-blur-lg rounded-2xl shadow-xl border border-cyan-400/20 p-5">
          <h2 className="text-lg font-extrabold text-cyan-300 mb-3 tracking-wide">
            🎲 Your Current Bets
          </h2>
          <ul className="space-y-3">
            {bets.map((bet, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-center bg-white/10 hover:bg-white/20 transition rounded-xl px-4 py-3 text-sm"
              >
                <div>
                  <span className="font-bold text-white">{bet.choice}</span>
                  <span className="ml-2 text-yellow-300 font-semibold">
                    ₹{bet.amount}
                  </span>
                </div>
                <button
                  onClick={() => cancelBet(idx)}
                  disabled={timeLeft <= 0}
                  className="text-xs font-semibold text-red-400 hover:text-red-300 disabled:opacity-40"
                >
                  ✖ Cancel
                </button>
              </motion.li>
            ))}
          </ul>
        </div>
      )}

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center bg-gradient-to-r from-purple-900/50 to-cyan-900/50 backdrop-blur-md shadow-lg rounded-2xl px-6 py-6 border border-cyan-400/20"
          >
            <h2 className="text-2xl font-extrabold text-yellow-300 drop-shadow-md">
              🎉 Result
            </h2>
            <p className="text-5xl mt-3 font-extrabold text-white drop-shadow-lg">
              {result.number}
            </p>
            <p
              className={`text-2xl font-bold mt-2 ${
                result.color.includes("Red")
                  ? "text-red-400"
                  : result.color.includes("Green")
                  ? "text-green-400"
                  : "text-purple-400"
              }`}
            >
              {result.color} ({getSize(result.number)})
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History */}
      <div className="bg-white/5 backdrop-blur-md rounded-lg w-full max-w-3xl overflow-hidden border border-white/10 mt-4">
        <table className="w-full text-sm text-center">
          <thead className="bg-white/10 text-gray-300">
            <tr>
              <th className="px-2 py-2">Period</th>
              <th className="px-2 py-2">Number</th>
              <th className="px-2 py-2">Size</th>
              <th className="px-2 py-2">Color</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h, i) => (
              <tr key={i} className="border-t border-white/10">
                <td className="px-2 py-2">{h.period}</td>
                <td className="px-2 py-2 font-bold">{h.number}</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold ${
                      h.size === "Big"
                        ? "bg-blue-500/20 text-blue-300"
                        : "bg-yellow-500/20 text-yellow-300"
                    }`}
                  >
                    {h.size}
                  </span>
                </td>
                <td>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold ${
                      h.color.includes("Red")
                        ? "bg-red-500/20 text-red-300"
                        : h.color.includes("Green")
                        ? "bg-green-500/20 text-green-300"
                        : "bg-purple-500/20 text-purple-300"
                    }`}
                  >
                    {h.color}
                  </span>
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

      <AnimatePresence>
        {betModalOpen && selectedChoice && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md mx-auto p-6 shadow-xl relative"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 250, damping: 28 }}
            >
              {/* Header */}
              <h2 className="text-xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
                You are betting on{" "}
                <span className="text-red-500">{selectedChoice}</span>
              </h2>

              {/* Amount Selection */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 text-center">
                  Choose Amount
                </h3>
                <div className="flex justify-center gap-3 flex-wrap">
                  {[1, 10, 100, 1000].map((val) => (
                    <button
                      key={val}
                      onClick={() => setBetAmount(val)}
                      className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all border 
                  ${
                    betAmount === val
                      ? "bg-yellow-400 text-black shadow-md scale-105"
                      : "bg-gray-100 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-200"
                  }`}
                    >
                      ₹{val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6 text-center">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                  Quantity
                </h3>
                <div className="flex items-center justify-center gap-6">
                  <button
                    onClick={() => setBetQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-110 transition-all text-lg font-bold"
                  >
                    -
                  </button>
                  <span className="font-bold text-lg text-gray-800 dark:text-gray-100">
                    {betQuantity}
                  </span>
                  <button
                    onClick={() => setBetQuantity((q) => q + 1)}
                    className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-110 transition-all text-lg font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Multipliers */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 text-center">
                  Multiplier
                </h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {[1, 5, 10, 20, 50, 100].map((mul) => (
                    <button
                      key={mul}
                      onClick={() => setMultiplier(mul)}
                      className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-all
                  ${
                    multiplier === mul
                      ? "bg-purple-600 text-white shadow-md scale-105"
                      : "bg-gray-100 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-200"
                  }`}
                    >
                      x{mul}
                    </button>
                  ))}
                </div>
              </div>

              {/* Total */}
              <p className="text-center font-bold text-xl mb-6 text-gray-800 dark:text-gray-100">
                Total: ₹{betAmount * betQuantity * multiplier}
              </p>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={() => setBetModalOpen(false)}
                  className="flex-1 px-4 py-3 rounded-xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    placeBet(
                      selectedChoice,
                      betAmount * betQuantity * multiplier
                    );
                    setBetModalOpen(false);
                  }}
                  className="flex-1 px-4 py-3 rounded-xl bg-green-500 hover:bg-green-600 transition-all text-white font-bold shadow-md"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
