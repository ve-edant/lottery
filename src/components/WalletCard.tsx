import { FiRefreshCcw } from "react-icons/fi";
import { FaWallet } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function WalletCard({ wallet }: { wallet: number }) {
  const router = useRouter();
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
          <span className="text-xl font-bold text-gray-900">{wallet}</span>
          <FiRefreshCcw className="text-gray-500 cursor-pointer hover:rotate-180 transition-transform duration-300" />
        </div>
      </div>

      {/* Bottom Row: Buttons */}
      <div className="flex gap-3 justify-end">
        <button onClick={()=>router.push("/transaction/withdrawal")} className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 px-5 rounded-full shadow transition-all duration-200">
          Withdraw
        </button>
        <button onClick={()=>router.push("/transaction/recharge")} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-5 rounded-full shadow transition-all duration-200">
          Recharge
        </button>
      </div>
    </div>
  );
}
