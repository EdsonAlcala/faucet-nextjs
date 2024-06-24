export const requestTokens = async (address: string) => {
    await sleep(5000);
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));