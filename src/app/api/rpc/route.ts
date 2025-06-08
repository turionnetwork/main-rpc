// src/app/api/rpc/route.ts

export async function POST(req: Request) {
  const body = await req.json()

  const response = await fetch('http://main1.turion.network:23999', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        'Basic ' + Buffer.from('rpc_turion:dR2oBQ3K1zYMZQtJFZeAerhWxaJ5Lqeq9J2').toString('base64'),
    },
    body: JSON.stringify(body),
  })

  const data = await response.json()
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
