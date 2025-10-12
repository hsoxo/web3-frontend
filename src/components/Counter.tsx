"use client";

import { useChainId, useReadContract, useWriteContract, useWatchContractEvent } from "wagmi";

import counterArtifact from "../../out/Counter.sol/Counter.json";
import { useState } from "react";
import contractConfig from "../../contract-config.json";

const abi = counterArtifact.abi;

const contractAddress = contractConfig.counter as `0x${string}`;

export default function Counter() {
  const { data: count, refetch } = useReadContract({
    address: contractAddress,
    abi,
    functionName: "getCount",
  });
  const [inputCount, setInputCount] = useState<number | null>(null);
  const chainId = useChainId();

  useWatchContractEvent({
    address: contractAddress,
    abi,
    eventName: "CountChanged",
    chainId,
    // poll: true,
    // pollingInterval: 1000,
    onLogs(logs) {
      console.log("🟢 CountChanged event:", logs);
      refetch();
    },
    onError(error) {
      console.error("❌ Event watch error:", error);
    },
  });

  const { writeContract, isPending } = useWriteContract();

  const handleIncrement = () => {
    try {
      writeContract({
        address: contractAddress,
        abi,
        functionName: "increment",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleClick = () => {
    try {
      writeContract({
        address: contractAddress,
        abi,
        functionName: "setCount",
        args: [inputCount],
        chainId,
      });
    } catch (err) {
      console.error("❌ Write failed:", err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-80 text-center mt-6">
      <h1 className="text-3xl font-bold mb-6">🧮 Counter DApp</h1>
      <p className="text-lg mb-4">
        Current count: <b>{Number(count || 0)}</b>
      </p>

      <button onClick={handleIncrement} disabled={isPending} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        {isPending ? "Submitting..." : "Increase +1"}
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
        <button onClick={handleClick} disabled={isPending} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          {isPending ? "Submitting..." : "Set Count"}
        </button>
      </div>
    </div>
  );
}
