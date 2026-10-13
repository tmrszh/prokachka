'use client'

import { useState } from 'react'

export default function FeedbackPage() {
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  async function send(event: React.FormEvent) {
    event.preventDefault()
    if (!message.trim()) return
    await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: message.trim() }),
    })
    setMessage('')
    setSent(true)
  }

  return (
    <main className="mx-auto max-w-xl p-10">
      <h1 className="text-2xl font-bold">Напиши нам</h1>
      <form onSubmit={send} className="mt-4 grid gap-3">
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Что улучшить в «Прокачке»?" className="min-h-28 rounded-xl border p-4 text-black" />
        <button type="submit" className="rounded-xl bg-black py-3 font-semibold text-white">Отправить</button>
        {sent && <p className="text-green-700">Спасибо! Сообщение отправлено.</p>}
      </form>
    </main>
  )
}
