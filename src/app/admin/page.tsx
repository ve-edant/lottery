"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiLogOut, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import { SignOutButton } from "@clerk/nextjs";
import { deleteUser } from "./_actions";

interface Wallet {
  id: string;
  balance: number;
}

interface User {
  id: string;
  username?: string | null;
  email?: string | null;
  wallet?: Wallet | null;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user");
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
                  onClick={() => router.push(`/admin/user/${user.clerkid}`)}
                >
                  {user.username || (
                    <span className="italic text-gray-500">No Name</span>
                  )}
                </td>
                <td
                  className="p-4 text-sm text-gray-400 cursor-pointer"
                  onClick={() => router.push(`/admin/user/${user.clerkid}`)}
                >
                  {user.email || (
                    <span className="italic text-gray-500">No Email</span>
                  )}
                </td>
                <td className="p-4 text-sm">
                  {user.wallet ? (
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-500/20 text-green-400">
                      💰 {user.wallet.balance}
                    </span>
                  ) : (
                    <span className="italic text-gray-500">No Wallet</span>
                  )}
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
    </div>
  );
}
