import React from "react";
import { motion } from "framer-motion";

const CircularTimer = ({ timeLeft, mode }: { timeLeft: number; mode: number }) => {
  return (
    <div className="relative w-36 h-36">
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute inset-0 rounded-full bg-cyan-400/20 blur-2xl"
      />
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="72"
          cy="72"
          r="70"
          stroke="gray"
          strokeWidth="6"
          fill="transparent"
        />
        <motion.circle
          cx="72"
          cy="72"
          r="70"
          stroke="url(#timerGradient)"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={2 * Math.PI * 70}
          strokeDashoffset={(timeLeft / (mode * 60)) * 2 * Math.PI * 70}
          strokeLinecap="round"
          className="drop-shadow-[0_0_15px_rgba(0,200,255,0.8)]"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-3xl font-extrabold text-yellow-300">
        {timeLeft}s
      </div>
    </div>
  );
};

export default CircularTimer;
