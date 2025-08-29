"use client";

import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#f95959] to-[#ff988d] text-white font-medium shadow-md hover:shadow-lg hover:from-cyan-500 hover:to-purple-500 transition-all duration-200"
    >
      <FiArrowLeft className="text-lg" />
      Back
    </button>
  );
}
