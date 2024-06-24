import { requestTokens } from "@app/web3"

export const dynamic = 'force-dynamic' // defaults to auto

export async function POST(request: Request) {
    const info = await request.json()
    const address = info.address;

    if (!address) {
        return new Response('Missing address', {
            status: 400,
        })
    }

    try {
        const result = await requestTokens(address as string)
        return new Response('Success!', {
            status: 200,
        })
    } catch (error) {
        return new Response('Error!', {
            status: 500,
        })
    }
}