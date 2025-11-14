"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOutIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Loader from "./Loader";

export default function SignOutModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);

    const res = await fetch("/api/sign-out", { method: "POST" });

    if (res.ok) {
      router.push("/auth/login");
      toast.success("Successfully logged out");
    } else {
      toast.error("Logout failed. Try again.");
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-red-500 text-white p-2 m-2 rounded-lg hover:bg-red-600 font-medium flex items-center hover:-translate-y-px transition-all"
      >
        Sign Out
        <LogOutIcon className="inline-block w-5 h-5 ml-2" />
      </button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 w-[90%] max-w-sm"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Confirm Sign Out
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to sign out? You’ll need to log in again
                to access your account.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="px-4 py-2 min-w-20 bg-red-500 hover:bg-red-600 text-white rounded-md disabled:opacity-70"
                >
                  {loading ? <Loader /> : "Sign Out"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
