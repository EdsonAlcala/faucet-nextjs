import { requestTokens } from "@app/web3"

export const dynamic = 'force-dynamic' // defaults to auto
export const maxDuration = 25; // This function can run for a maximum of 5 seconds

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
        return new Response(JSON.stringify({ message: 'Success!', result }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        })
    } catch (error) {
        return new Response('Error!', {
            status: 500,
        })
    }
}