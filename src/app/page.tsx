"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useSendTransaction } from "wagmi";
import { useFormattedBalance } from "@/hooks/useFormattedBalance";
import { useEffect } from "react";
import Counter from "@/components/Counter";
import SendTrans from "@/components/SendTrans";
import DaoVote from "@/components/DaoVote";

export default function HomePage() {
  const { address, isConnected } = useAccount();
  const { formatted, symbol, refetch: refetchBalance } = useFormattedBalance(address);
  const { data: hash, isSuccess } = useSendTransaction();

  useEffect(() => {
    if (isSuccess && hash) {
      console.log("交易哈希:", hash);
      refetchBalance?.();
    }
  }, [isSuccess, hash, refetchBalance]);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="fixed top-4 right-4">
        <ConnectButton />
      </div>

      <div>
        {isConnected && (
          <>
            <div className="mt-8 bg-white p-6 rounded-xl shadow-md w-120 text-center">
              <div className="flex gap-2">
                <span className="font-semibold">Address:</span>
                <span className="text-sm break-all text-gray-600">{address}</span>
              </div>

              <div className="flex gap-2">
                <span className="font-semibold">Balance:</span>
                <span className="text-sm">
                  {formatted} {symbol}
                </span>
              </div>
            </div>
            <SendTrans />
            <Counter />
            <DaoVote />
          </>
        )}
      </div>
    </main>
  );
}
