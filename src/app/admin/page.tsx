"use client";
import { useEffect, useState } from "react";
import { FiTrash2, FiEdit } from "react-icons/fi";
import toast from "react-hot-toast";
import { SignOutButton } from "@clerk/nextjs";
import { deleteUser } from "./_actions";

interface Wallet {
  id: string;
  balance: number;
}

interface User {
  clerkid: string;
  username?: string | null;
  email?: string | null;
  wallet?: Wallet | null;
}

interface EditBalanceModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (userId: string, newBalance: number) => void;
}

function EditBalanceModal({ user, isOpen, onClose, onSave }: EditBalanceModalProps) {
  const [balance, setBalance] = useState(user?.wallet?.balance || 0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.wallet?.balance !== undefined) {
      setBalance(user.wallet.balance);
    }
  }, [user?.wallet?.balance]);

  const handleSave = async () => {
    if (!user) return;
    
    if (balance < 0) {
      toast.error("Balance cannot be negative");
      return;
    }

    setLoading(true);
    try {
      await onSave(user.clerkid, balance);
      onClose();
    } catch (error) {
      console.error("Error updating balance:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#111] border border-gray-700 rounded-xl p-6 w-96 max-w-[90vw]">
        <h2 className="text-2xl font-bold text-indigo-400 mb-4">
          Edit Wallet Balance
        </h2>
        
        <div className="mb-4">
          <p className="text-gray-300 mb-2">
            User: {user.username || user.email || "Unknown"}
          </p>
          <p className="text-gray-400 text-sm mb-4">
            Current Balance: ₹{user.wallet?.balance || 0}
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-gray-300 text-sm font-medium mb-2">
            New Balance (₹)
          </label>
          <input
            type="number"
            value={balance}
            onChange={(e) => setBalance(Number(e.target.value))}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
            placeholder="Enter new balance"
            min="0"
          />
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Fetch users with wallet info
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/admin/users");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  // Delete user from DB + Clerk
  async function handleDeleteUser(userId: string) {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const result = await deleteUser(userId);
      if (result.error) throw new Error(result.error);
      toast.success("User deleted successfully");
      setUsers((prev) => prev.filter((u) => u.clerkid !== userId));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user");
    }
  }

  // Update wallet balance
  async function handleUpdateBalance(userId: string, newBalance: number) {
    try {
      const res = await fetch("/api/admin/update-balance", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          balance: newBalance,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update balance");
      }

      const updatedUser = await res.json();
      
      // Update the users state
      setUsers((prev) =>
        prev.map((user) =>
          user.clerkid === userId
            ? { ...user, wallet: updatedUser.wallet }
            : user
        )
      );

      toast.success("Balance updated successfully");
    } catch (error) {
      console.error("Error updating balance:", error);
      toast.error("Failed to update balance");
      throw error;
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center w-xl min-h-screen bg-[#111] text-gray-300">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-xl bg-gradient-to-b from-[#0c0c0c] to-[#1a1a1a] text-gray-200 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-indigo-400">
          Admin Dashboard
        </h1>
        <SignOutButton />
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-800 bg-[#111]">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-900/70">
            <tr>
              <th className="p-4 text-left text-sm font-semibold">Name</th>
              <th className="p-4 text-left text-sm font-semibold">Email</th>
              <th className="p-4 text-left text-sm font-semibold">
                Wallet Balance
              </th>
              <th className="p-4 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {users.map((user) => (
              <tr
                key={user.clerkid}
                className="hover:bg-gray-800/60 transition-colors duration-200"
              >
                <td
                  className="p-4 text-sm font-medium cursor-pointer"
                >
                  {user.username || (
                    <span className="italic text-gray-500">No Name</span>
                  )}
                </td>
                <td
                  className="p-4 text-sm text-gray-400 cursor-pointer"
                >
                  {user.email || (
                    <span className="italic text-gray-500">No Email</span>
                  )}
                </td>
                <td className="p-4 text-sm">
                  <div className="flex items-center gap-2">
                    {user.wallet ? (
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-500/20 text-green-400">
                        💰 ₹{user.wallet.balance}
                      </span>
                    ) : (
                      <span className="italic text-gray-500">No Wallet</span>
                    )}
                    {user.wallet && (
                      <button
                        onClick={() => setEditingUser(user)}
                        className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition"
                        title="Edit Balance"
                      >
                        <FiEdit className="text-xs" />
                        Edit
                      </button>
                    )}
                  </div>
                </td>
                <td className="p-4 text-sm">
                  <button
                    onClick={() => handleDeleteUser(user.clerkid)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-red-700 text-white text-xs font-semibold rounded-lg hover:bg-red-800 transition"
                  >
                    <FiTrash2 className="text-sm" />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Balance Modal */}
      {editingUser && (
        <EditBalanceModal
          user={editingUser}
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleUpdateBalance}
        />
      )}
    </div>
  );
}