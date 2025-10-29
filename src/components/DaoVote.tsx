"use client";

import { useChainId, useReadContract, useWriteContract, useWatchContractEvent, usePublicClient, useAccount } from "wagmi";

import daoVoteArtifact from "../abi/MiniDaoVote.json";
import { useState } from "react";
import dayjs from "dayjs";
import { ContractFunctionExecutionError, ContractFunctionRevertedError } from "viem";
import toast from "react-hot-toast";
import clsx from "clsx";
import contractConfig from "../../contract-config.json";

const abi = daoVoteArtifact.abi;

const contractAddress = contractConfig.dao as `0x${string}`;

interface Proposal {
  id: number;
  description: string;
  deadline: number;
  votesFor: number;
  votesAgainst: number;
  executed: boolean;
  hasVoted: boolean;
  support: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type _ = any;

export default function DaoVote() {
  const { address } = useAccount();
  const { data: proposals, refetch: refetchProposals } = useReadContract<typeof abi, "getAllProposals", [], _, Proposal[]>({
    address: contractAddress,
    abi,
    functionName: "getAllProposals",
    account: address,
  });
  const [description, setDescription] = useState<string | null>(null);
  const [durationSeconds, setDurationSeconds] = useState<number | null>(null);
  const chainId = useChainId();

  console.log(proposals);
  const publicClient = usePublicClient();
  const { writeContractAsync, isPending } = useWriteContract();

  useWatchContractEvent({
    address: contractAddress,
    abi,
    eventName: "ProposalCreated",
    chainId,
    onLogs(logs) {
      console.log("🟢 ProposalCreated event:", logs);
      refetchProposals();
    },
    onError(error) {
      console.error("❌ Event watch error:", error);
    },
  });

  useWatchContractEvent({
    address: contractAddress,
    abi,
    eventName: "VoteCast",
    chainId,
    onLogs(logs) {
      console.log("🟢 ProposalCreated event:", logs);
      refetchProposals();
    },
    onError(error) {
      console.error("❌ Event watch error:", error);
    },
  });

  const handleCreateProposal = async () => {
    try {
      const tx = await writeContractAsync({
        address: contractAddress,
        abi,
        functionName: "createProposal",
        args: [description, durationSeconds],
        chainId,
      });
      console.log(tx);
    } catch (err) {
      console.error("❌ Write failed:", err);
    }
  };

  const handleVote = async (proposalId: number, vote: boolean) => {
    try {
      const result = await publicClient?.simulateContract({
        address: contractAddress,
        abi,
        functionName: "vote",
        args: [proposalId, vote],
        account: address, // 重要：指定 msg.sender
      });

      console.log("Simulate result:", result);

      await writeContractAsync({
        address: contractAddress,
        abi,
        functionName: "vote",
        args: [proposalId, vote],
        chainId,
      });
    } catch (err) {
      if (err instanceof ContractFunctionExecutionError) {
        const error = err as ContractFunctionExecutionError;
        console.error("Execution error:", error.shortMessage);
        if (error.cause instanceof ContractFunctionRevertedError) {
          console.error("Revert reason:", error.cause?.reason);
          toast.error(`${error.cause?.reason}`);
        }
      } else {
        console.error("Other error:", err);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-80  mt-6">
      <input
        value={description ?? ""}
        onChange={(e) => {
          const value = e.target.value;
          setDescription(value);
        }}
        className="w-full mt-1 p-2 border rounded-md"
        placeholder="Proposal description"
      />
      <input
        value={durationSeconds ?? ""}
        onChange={(e) => {
          const value = e.target.value;
          setDurationSeconds(Number(value));
        }}
        className="w-full mt-1 p-2 border rounded-md"
        placeholder="Proposal duration (seconds)"
      />
      <button onClick={handleCreateProposal} disabled={isPending} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        {isPending ? "Submitting..." : "Create Proposal"}
      </button>
      {proposals?.map((proposal) => (
        <div key={proposal.id} className="mt-2 border-b pb-2">
          <div className="font-semibold">
            <span>{proposal.description}</span>
            <span className="text-xs text-gray-500 pl-2">{proposal.hasVoted ? "Voted" : "Not voted"}</span>
          </div>
          <div className="text-sm text-gray-500">Deadline: {dayjs(Number(proposal.deadline) * 1000).format("YYYY-MM-DD HH:mm:ss")}</div>
          {proposal.executed ? (
            <div className="text-sm text-gray-500">Executed</div>
          ) : (
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleVote(proposal.id, true)}
                className={clsx("px-2 py-1 border border-lime-500 text-lime-500 rounded-md", proposal.hasVoted && proposal.support && "bg-lime-500 text-white")}
              >
                👍 {proposal.votesFor}
              </button>
              <button
                onClick={() => handleVote(proposal.id, false)}
                className={clsx(
                  "px-2 py-1 border border-orange-600 text-orange-600 rounded-md",
                  proposal.hasVoted && !proposal.support && "bg-orange-600 text-white",
                )}
              >
                👎 {proposal.votesAgainst}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
