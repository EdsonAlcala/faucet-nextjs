import { keyStores, KeyPair, connect, Account, Near } from "near-api-js";
import { Hex, encodeFunctionData, serializeTransaction, TransactionSerializable, keccak256, toBytes, Address, serializeSignature, parseTransaction, hexToNumber } from "viem";
import { publicKeyToAddress } from "viem/utils";
import { secp256k1 } from "@noble/curves/secp256k1";

import { deriveChildPublicKey, najPublicKeyStrToUncompressedHexPoint, uncompressedHexPointToEvmAddress } from "./kdf";

import { TransactionWithSignature } from "./types";
import { TESTNET_CONFIG } from "./config";
import { SEPOLIA_CHAIN_ID } from "./constants";
import { abiItem } from "./abis";

// env utils
export const nearAccountFromEnv = async (): Promise<{ account: Account, near: Near }> => {
    const keyPair = KeyPair.fromString(process.env.NEAR_ACCOUNT_PRIVATE_KEY!);
    return nearAccountFromKeyPair({
        keyPair,
        accountId: process.env.NEAR_ACCOUNT_ID!
    });
};

export const nearAccountFromKeyPair = async (config: {
    keyPair: KeyPair;
    accountId: string;
}): Promise<{ account: Account, near: Near }> => {
    const keyStore = new keyStores.InMemoryKeyStore();
    await keyStore.setKey("testnet", config.accountId, config.keyPair);
    const near = await connect({
        ...TESTNET_CONFIG,
        keyStore,
    });
    const account = await near.account(config.accountId);
    return { account, near };
};

// address utils
export const deriveAddress = async (accountId: string) => {
    const publicKey = await deriveChildPublicKey(najPublicKeyStrToUncompressedHexPoint(), accountId);
    const address = await uncompressedHexPointToEvmAddress(publicKey);
    return { publicKey: Buffer.from(publicKey, 'hex'), address };
}

// mpc signing serialization
export const prepareTransactionForSigning = (unsignedTxHash: `0x${string}`) => {
    return toPayload(keccak256(unsignedTxHash));
}

export function toPayload(hexString: Hex): number[] {
    if (hexString.slice(2).length !== 32 * 2) {
        throw new Error(`Payload Hex must have 32 bytes: ${hexString}`);
    }
    return Array.from(toBytes(hexString).reverse());
}

// transaction serialization
export const serializeRawTransactionData = async (transactionData: TransactionSerializable) => {
    return serializeTransaction(transactionData);
}

export const createRawTransactionData = async (client: any, sender: Hex, receiver: Hex) => {
    // Generate data for the payload
    const data = encodeFunctionData({
        abi: [abiItem],
        args: [receiver]
    })

    console.log(`Data: ${data}`);

    // Get the nonce & gas price
    const nonce = await client.getTransactionCount({
        address: sender as any,
    });

    console.log(`Nonce: ${nonce}`);

    console.log("Ethereum Faucet Address: ", process.env.ETH_FAUCET);

    // Construct transaction
    const transactionData = {
        nonce,
        account: sender,
        to: process.env.ETH_FAUCET as Hex,
        value: 0n,
        data
    };

    console.log(`Transaction data: ${JSON.stringify(transactionData, bigintReplacer)}`);

    const [estimatedGas, { maxFeePerGas, maxPriorityFeePerGas }] =
        await Promise.all([
            client.estimateGas(transactionData),
            client.estimateFeesPerGas(),
        ]);

    return {
        ...transactionData,
        gas: estimatedGas,
        maxFeePerGas,
        maxPriorityFeePerGas,
        chainId: SEPOLIA_CHAIN_ID,
    };
}

// format utils
export const bigintReplacer = (_key: string, value: any): any => {
    if (typeof value === 'bigint') {
        return value.toString(); // Convertir BigInt a string
    }
    return value;
}

// relay utils
export const reconstructSignature = (tx: TransactionWithSignature, sender: Address): Hex => {
    return addSignature(tx, sender);
}

const addSignature = ({ transaction, signature: { big_r, big_s } }: TransactionWithSignature, sender: Address): Hex => {
    const txData = parseTransaction(transaction);
    const r = `0x${big_r.substring(2)}` as Hex;
    const s = `0x${big_s}` as Hex;

    const candidates = [27n, 28n].map((v) => {
        return {
            v,
            r,
            s,
            ...txData,
        };
    });

    const signedTx = candidates.find((tx) => {
        const signature = serializeSignature({
            r: tx.r!,
            s: tx.s!,
            v: tx.v!,
        });
        const pk = publicKeyToAddress(
            recoverPublicKey(keccak256(transaction), signature)
        );
        return pk.toLowerCase() === sender.toLowerCase();
    });
    if (!signedTx) {
        throw new Error("Signature is not valid");
    }
    return serializeTransaction(signedTx);
}

// This method is mostly pasted from viem since they use an unnecessary async import.
// import { secp256k1 } from "@noble/curves/secp256k1";
// TODO - fix their async import!
export function recoverPublicKey(hash: Hex, signature: Hex): Hex {
    // Derive v = recoveryId + 27 from end of the signature (27 is added when signing the message)
    // The recoveryId represents the y-coordinate on the secp256k1 elliptic curve and can have a value [0, 1].
    let v = hexToNumber(`0x${signature.slice(130)}`);
    if (v === 0 || v === 1) v += 27;

    const publicKey = secp256k1.Signature.fromCompact(signature.substring(2, 130))
        .addRecoveryBit(v - 27)
        .recoverPublicKey(hash.substring(2))
        .toHex(false);
    return `0x${publicKey}`;
}
