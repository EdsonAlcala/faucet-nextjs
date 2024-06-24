import { Hex } from "viem";
import { FaucetContract } from "./FaucetContract";
import { client } from "./client";
import { createRawTransactionData, serializeRawTransactionData, deriveAddress, nearAccountFromEnv, prepareTransactionForSigning, bigintReplacer, reconstructSignature } from "./utils";
import { SEPOLIA_EXPLORER } from "./constants";

export const requestTokens = async (receiver: string) => {
    console.log(`Receiver: ${receiver}`);

    await sleep(5000);
    return;

    // Load the NEAR account
    const { account, near } = await nearAccountFromEnv();
    console.log(`Your NEAR account ID: ${account.accountId}`);

    // Derive the Ethereum address
    const ethereumAddress = await deriveAddress(account.accountId);
    console.log(`Your ethereum address 1: ${ethereumAddress.address}`);

    // Create payload
    const rawTransactionData = await createRawTransactionData(client, ethereumAddress.address, receiver as any);
    console.log(`Your rawTransactionData: ${JSON.stringify(rawTransactionData, bigintReplacer)}`);

    const serializedTransaction = await serializeRawTransactionData(rawTransactionData);
    console.log(`Your serializedTransaction: ${serializedTransaction}`);

    // request signature
    const payload = prepareTransactionForSigning(serializedTransaction);

    const signatureRequestArgs = {
        rlp_payload: payload,
    };

    console.log(`Signature request args: ${JSON.stringify(signatureRequestArgs, bigintReplacer)}`);

    console.log("Requesting signature from Near...");

    const faucetContractAccount = account.accountId
    const faucetInstance = new FaucetContract(near.connection, faucetContractAccount);

    const { big_r, big_s } = await faucetInstance.requestTokens(
        signatureRequestArgs
    );

    console.log(`Signature received: ${big_r}, ${big_s}`);

    // relay signature
    const signedTx: Hex = await reconstructSignature({
        transaction: serializedTransaction, // TODO: Are you sure this is the right format?
        signature: { big_r, big_s }
    }, ethereumAddress.address);

    console.log(`Relaying transaction`);
    console.log(`Signed transaction: ${signedTx}`);

    const hash = await client.sendRawTransaction({
        serializedTransaction: signedTx
    });

    console.log(`Transaction Confirmed: ${SEPOLIA_EXPLORER}/tx/${hash}`);
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));