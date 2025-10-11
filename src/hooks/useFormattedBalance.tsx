import { useBalance } from "wagmi";
import { formatUnits } from "viem";

export function useFormattedBalance(address?: `0x${string}`) {
  const { data, refetch } = useBalance({ address });
  if (!data) return { formatted: "0.0", symbol: "" };
  const formatted = formatUnits(data.value, data.decimals);
  return { formatted, symbol: data.symbol, refetch };
}
