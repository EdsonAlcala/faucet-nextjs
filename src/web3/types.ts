import { Contract } from "near-api-js";
import { Hex } from "viem";

export interface SignArgs {
    rlp_payload: number[];
}

export interface ChangeMethodArgs<T> {
    args: T;
    gas: string;
    attachedDeposit: string;
}

export interface FaucetContractInterface extends Contract {
    request_tokens: (args: ChangeMethodArgs<SignArgs>) => Promise<[string, string]>;
}

export interface MPCSignature {
    big_r: string;
    big_s: string;
}

export interface TransactionWithSignature {
    transaction: Hex;
    signature: MPCSignature;
}
