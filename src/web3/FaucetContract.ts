import { Contract, Connection, Account } from "near-api-js";

import { FaucetContractInterface, MPCSignature, SignArgs } from "./types";
import { NO_DEPOSIT, TGAS } from "./constants";

export class FaucetContract {
    contract: FaucetContractInterface;
    connectedAccount: Account;
    contractId: string;
    constructor(connection: Connection, contractId: string) {
        this.connectedAccount = new Account(connection, contractId);
        this.contractId = contractId;
        this.contract = new Contract(this.connectedAccount, contractId, {
            changeMethods: ["request_tokens"],
            viewMethods: [],
            useLocalViewExecution: false,
        }) as FaucetContractInterface;
    }

    requestTokens = async (signArgs: SignArgs): Promise<MPCSignature> => {
        const [big_r, big_s] = await this.contract.request_tokens({
            args: signArgs,
            gas: (TGAS * 300n).toString(),
            attachedDeposit: NO_DEPOSIT,
        });
        return { big_r, big_s };
    };
}
