export async function POST(request: Request) {
  const { message } = await request.json()
  if (typeof message !== 'string' || !message.trim()) {
    return Response.json({ error: 'empty' }, { status: 400 })
  }
  console.log('Новое сообщение:', message.trim())
  return Response.json({ ok: true })
}
