import { createPublicClient, http } from "viem";

export const client = createPublicClient({
    transport: http(process.env.ETH_RPC_URL!),
});
