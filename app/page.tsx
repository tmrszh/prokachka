'use client'

import { useEffect, useState } from 'react'
import { Check, Flame, LogOut, Plus, X } from 'lucide-react'

type Habit = { id: string; name: string; streak: number; done: boolean; color: string }

const colorClasses: Record<Habit['color'], string> = { coral: 'bg-[#ef8968]', sky: 'bg-[#80c2d7]', lime: 'bg-[#b9d85e]', violet: 'bg-[#b9a7e8]' }

export default function Page() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [status, setStatus] = useState<'loading' | 'error' | 'ready'>('loading')
  const [isAdding, setIsAdding] = useState(false)
  const [name, setName] = useState('')
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

 async function loadHabits() {
    try {
      const response = await fetch('/api/habits')
      if (!response.ok) throw new Error('bad response')
      const data = await response.json()
      setHabits(data)
      setStatus('ready')
    } catch {
      setStatus('error')
    }
  }

  useEffect(() => {
    loadHabits()
  }, [])

  async function toggleHabit(id: string) {
    const habit = habits.find((h) => h.id === id)
    if (!habit || habit.done) return
    await fetch('/api/checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ habitId: id }),
    })
    await loadHabits()
  }

  async function addHabit(event: React.FormEvent) {
    event.preventDefault()
    if (!name.trim()) return
    await fetch('/api/habits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim() }),
    })
    setName('')
    setIsAdding(false)
    await loadHabits()
  }


  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#19201d] dark:bg-[#19201d] dark:text-[#f7f8f5]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-5 py-6 sm:px-10 sm:py-8">
        <header className="flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5" aria-label="Прокачка, на главную">
            <span className="grid size-9 place-items-center rounded-xl bg-[#19201d] text-[#d9f56c]"><Flame className="size-5 fill-current" /></span>
            <span className="text-xl font-bold tracking-[-0.04em]">Прокачка</span>
          </a>
          <button className="flex items-center gap-2 rounded-full border border-[#dfe4dc] bg-white px-4 py-2 text-sm font-medium text-[#59645d] transition hover:border-[#19201d] hover:text-[#19201d]" type="button">
            <span className="grid size-6 place-items-center rounded-full bg-[#d9f56c] text-xs font-bold">А</span>
            Алексей <LogOut className="size-4" />
          </button>
        </header>

        <section className="mt-16 max-w-2xl sm:mt-20">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#5b665f]">Среда, 1 октября</p>
          <h1 className="text-4xl font-bold tracking-[-0.06em] sm:text-6xl">Двигайся в своём<br /><span className="text-[#8ba53c]">ритме.</span></h1>
          <p className="mt-6 max-w-md text-lg leading-8 text-[#69756c]">Маленькие шаги складываются в большую привычку. Без давления, только вперёд.</p>
        </section>

        <section className="mt-12 sm:mt-16">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5b665f]">Заметки по дизайну</p>
              <h2 className="mt-2 text-2xl font-bold tracking-[-0.04em]">Лёгкий, поддерживающий стиль</h2>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              { title: 'Тон', text: 'Интерфейс должен чувствовать поддержку, а не давление: спокойные формулировки и мягкий позитив.' },
              { title: 'Палитра', text: 'Основной набор — тёмный графит, зелёные акценты и тёплые оттенки для контраста без перегруза.' },
              { title: 'Комфорт', text: 'Большие кнопки, много воздуха, закруглённые карточки и понятные статусы повышают вовлечённость.' },
            ].map((note) => (
              <article key={note.title} className="rounded-[22px] border border-[#e5e9e1] bg-white p-5 shadow-[0_5px_20px_rgba(29,43,34,0.03)]">
                <div className="mb-3 inline-flex rounded-full bg-[#eef4e5] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#52651e]">{note.title}</div>
                <p className="text-sm leading-7 text-[#5b665f]">{note.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12 flex flex-1 flex-col pb-10 sm:mt-16">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div><h2 className="text-2xl font-bold tracking-[-0.04em]">Твои привычки</h2><p className="mt-1 text-sm text-[#5b665f]">{habits.filter((habit) => habit.done).length} из {habits.length} на сегодня</p></div>
            <button onClick={() => setIsAdding(true)} className="flex shrink-0 items-center gap-2 rounded-full bg-[#19201d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#344039]" type="button"><Plus className="size-4" /> Добавить привычку</button>
            <button onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')} className="flex shrink-0 items-center gap-2 rounded-full bg-[#f3f5f1] px-5 py-3 text-sm font-semibold text-[#69756c] transition hover:bg-[#e7f5b5] hover:text-[#52651e]" type="button">{viewMode === 'list' ? 'Сетка' : 'Список'}</button>
          </div>
              {status === 'loading' && (
    <div className="grid gap-3">
      {[1, 2, 3].map((n) => (
        <div key={n} className="h-20 animate-pulse rounded-[22px] bg-[#e5e9e1]" />
      ))}
    </div>
  )}

  {status === 'error' && (
    <div className="rounded-[22px] bg-red-100 p-5 text-red-700">
      Не получилось загрузить привычки. Обнови страницу.
    </div>
  )}

  {status === 'ready' && habits.length === 0 && (
    <div className="rounded-[22px] border border-dashed border-[#cfd8c9] p-6 text-center text-[#5b665f]">
      Добавь первую цель — нажми «Добавить привычку»
    </div>
  )}

          <div className={`grid gap-3 ${viewMode === 'list' ? 'grid-cols-1' : 'md:grid-cols-3'}`}>
            {habits.map((habit) => (
              <article key={habit.id} className="group flex items-center justify-between rounded-[22px] border border-[#e5e9e1] bg-white p-4 pl-5 shadow-[0_5px_20px_rgba(29,43,34,0.03)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(29,43,34,0.07)] sm:p-5 sm:pl-6">
                <div className="flex items-center gap-4"><span className={`size-3 rounded-full ${colorClasses[habit.color]}`} /><div><h3 className="font-semibold">{habit.name}</h3><div className="mt-1 flex items-center gap-1.5 text-sm text-[#5b665f]"><Flame className="size-3.5 text-[#ef8968]" /> <span className="font-semibold text-[#556159]">{habit.streak}</span> {habit.streak === 1 ? 'день' : 'дней'} подряд</div></div></div>
                <button onClick={() => toggleHabit(habit.id)} aria-pressed={habit.done} className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition sm:px-4 ${habit.done ? 'bg-[#e7f5b5] text-[#52651e]' : 'bg-[#f3f5f1] text-[#5b665f]] hover:bg-[#e7f5b5] hover:text-[#52651e]'}`} type="button"><span className={`grid size-5 place-items-center rounded-full border ${habit.done ? 'border-[#9fba48] bg-[#9fba48] text-white' : 'border-[#c5cec4]'}`}>{habit.done && <Check className="size-3.5" strokeWidth={3} />}</span><span className="hidden sm:inline">{habit.done ? 'Сделано сегодня' : 'Сделать сегодня'}</span></button>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-[22px] border border-dashed border-[#cfd8c9] bg-[#eef4e5] px-6 py-5 text-center text-sm text-[#5b665f]">Пропустил день? Ничего страшного. Просто продолжай сегодня.</div>
        </section>
      </div>

      {isAdding && <div className="fixed inset-0 z-10 grid place-items-center bg-[#19201d]/30 p-5" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsAdding(false) }}><form onSubmit={addHabit} className="w-full max-w-md rounded-[26px] bg-white p-6 shadow-2xl sm:p-8"><div className="mb-6 flex items-start justify-between"><div><h2 className="text-2xl font-bold tracking-[-0.04em]">Новая привычка</h2><p className="mt-1 text-sm text-[#5b665f]">Что хочешь делать регулярно?</p></div><button type="button" onClick={() => setIsAdding(false)} aria-label="Закрыть"><X className="size-5 text-[#5b665f]" /></button></div><label className="text-sm font-semibold" htmlFor="habit-name">Название</label><input id="habit-name" autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="Например, бегать 20 минут" className="mt-2 w-full rounded-xl border border-[#dfe5dc] px-4 py-3 outline-none transition focus:border-[#9fba48] focus:ring-4 focus:ring-[#e7f5b5]" /><button type="submit" className="mt-5 w-full rounded-xl bg-[#19201d] py-3 font-semibold text-white transition hover:bg-[#344039]">Добавить привычку</button></form></div>}
    </main>
  )
}