"use client";

import {
  useChainId,
  useReadContract,
  useWriteContract,
  useWatchContractEvent,
} from "wagmi";

import counterArtifact from "../../out/Counter.sol/Counter.json";
import process from "process";
import { useState } from "react";
const abi = counterArtifact.abi;

const contractAddress = process.env
  .NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export default function Counter() {
  const { data: count, refetch } = useReadContract({
    address: contractAddress,
    abi,
    functionName: "getCount",
  });
  const [inputCount, setInputCount] = useState<number | null>(null);
  console.log("🧩 当前链 ID:", useChainId());

  useWatchContractEvent({
    address: contractAddress,
    abi,
    eventName: "CountChanged",
    chainId: 31337,
    poll: true,
    pollingInterval: 1000,
    onLogs(logs) {
      console.log("🟢 CountChanged event:", logs);
      refetch();
    },
    onError(error) {
      console.error("❌ Event watch error:", error);
    },
  });

  const { writeContract, isPending } = useWriteContract();

  async function handleIncrement() {
    try {
      writeContract({
        address: contractAddress,
        abi,
        functionName: "increment",
      });
    } catch (err) {
      console.error(err);
    }
  }

  const handleClick = async () => {
    try {
      const tx = await writeContract({
        address: contractAddress,
        abi,
        functionName: "setCount", // ✅ 函数名
        args: [inputCount], // ✅ 参数数组（顺序与合约定义一致）
        chainId: 31337, // ✅ 指定链
      });

      console.log("📤 TX sent:", tx);
    } catch (err) {
      console.error("❌ Write failed:", err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-80 text-center mt-6">
      <h1 className="text-3xl font-bold mb-6">🧮 Counter DApp</h1>
      <p className="text-lg mb-4">
        当前计数：<b>{Number(count || 0)}</b>
      </p>

      <button
        onClick={handleIncrement}
        disabled={isPending}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {isPending ? "提交中..." : "增加 +1"}
      </button>

      <div>
        <input
          value={inputCount ?? ""}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "" || /^\d+$/.test(value)) {
              setInputCount(Number(value));
            } else {
              setInputCount(null);
            }
          }}
          className="w-full mt-1 p-2 border rounded-md"
          placeholder="0"
        />
        <button
          onClick={handleClick}
          disabled={isPending}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {isPending ? "提交中..." : "设置计数"}
        </button>
      </div>
    </div>
  );
}
