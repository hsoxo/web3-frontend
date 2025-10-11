"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useSendTransaction } from "wagmi";
import { useFormattedBalance } from "@/hooks/useFormattedBalance";
import { useState, useEffect } from "react";
import { parseEther } from "viem";

export default function HomePage() {
  const { address, isConnected } = useAccount();
  const {
    formatted,
    symbol,
    refetch: refetchBalance,
  } = useFormattedBalance(address);
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

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">🪙 My Web3 Wallet</h1>

      <ConnectButton />

      {isConnected && (
        <>
          <div className="mt-8 bg-white p-6 rounded-xl shadow-md w-80 text-center">
            <p className="font-semibold mb-2">Address:</p>
            <p className="text-sm break-all text-gray-600">{address}</p>

            <p className="mt-4 font-semibold mb-2">Balance:</p>
            <p className="text-xl">
              {formatted} {symbol}
            </p>
          </div>{" "}
          <div className="bg-white p-6 rounded-xl shadow-md w-96">
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
        </>
      )}
    </main>
  );
}
