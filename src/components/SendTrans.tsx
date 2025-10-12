"use client";

import { useAccount, useSendTransaction } from "wagmi";
import { useFormattedBalance } from "@/hooks/useFormattedBalance";
import { useState, useEffect } from "react";
import { parseEther } from "viem";

export default function HomePage() {
  const { address, isConnected } = useAccount();
  const { refetch: refetchBalance } = useFormattedBalance(address);
  const {
    sendTransaction,
    isPending,
    data: hash,
    isSuccess,
  } = useSendTransaction();
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");

  const handleSend = () => {
    if (!to || !amount) return;
    sendTransaction({
      to: to as `0x${string}`,
      value: parseEther(amount),
    });
  };

  useEffect(() => {
    if (isSuccess && hash) {
      console.log("交易哈希:", hash);
      refetchBalance?.();
    }
  }, [isSuccess, hash, refetchBalance]);

  if (!isConnected) return null;
  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-96 mt-6">
      <label className="block mb-3">
        <span className="text-gray-700">收款地址</span>
        <input
          type="text"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="w-full mt-1 p-2 border rounded-md"
          placeholder="0xRecipient..."
        />
      </label>

      <label className="block mb-3">
        <span className="text-gray-700">金额 (ETH)</span>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full mt-1 p-2 border rounded-md"
          placeholder="0.01"
        />
      </label>

      <button
        onClick={handleSend}
        disabled={isPending}
        className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
      >
        {isPending ? "交易提交中..." : "发送"}
      </button>

      <p className="text-sm text-gray-500 mt-3">
        连接地址：{address?.slice(0, 6)}...{address?.slice(-4)}
      </p>
    </div>
  );
}
