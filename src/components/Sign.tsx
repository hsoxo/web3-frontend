"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useSignMessage } from "wagmi";

const Sign = () => {
  const { address } = useAccount();
  const [signature, setSignature] = useState<string | null>(null);
  const [message, setMessage] = useState("Login to Aster: nonce=123456");
  const { signMessageAsync } = useSignMessage();
  const [copied, setCopied] = useState(false);
  const copyToClipboard = async () => {
    if (!signature) return;
    try {
      await navigator.clipboard.writeText(signature);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("复制失败:", err);
    }
  };

  const signMessage = async () => {
    if (!address) return;
    const signature = await signMessageAsync({ message });
    setSignature(signature);
  };

  return (
    <div className="bg-white w-96 p-6 mt-6 rounded-2xl shadow-lg border border-gray-100 transition-all hover:shadow-xl">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Sign Message</h2>

      {/* 签名消息输入区 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-600">Message:</label>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
          placeholder="请输入要签名的消息"
        />
      </div>

      {/* 按钮 */}
      <div className="mt-4">
        <button
          onClick={signMessage}
          disabled={!address}
          className={`w-full py-2 rounded-lg text-white font-medium transition-colors ${
            address ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Sign
        </button>
      </div>
      <div className="mt-6 space-y-2 relative">
        <label className="block text-sm font-medium text-gray-600">Signature:</label>
        <div className="relative">
          <textarea
            value={signature || ""}
            readOnly
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            placeholder="签名结果将显示在这里"
          />
        </div>

        <button
          onClick={copyToClipboard}
          disabled={!signature}
          className={`absolute top-0 right-0 text-sm px-3 py-1.5 rounded-md font-medium transition-all duration-200 shadow-sm ${
            signature
              ? "bg-white border border-gray-300 hover:bg-blue-600 hover:text-white"
              : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
          }`}
        >
          {copied ? "✅ Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
};

export default Sign;
