import test from 'node:test'
import assert from 'node:assert'
import { isDoneToday } from './streak.mjs'

const now = new Date('2026-10-12T12:00:00')

test('отметка сегодня → привычка выполнена', () => {
  assert.equal(isDoneToday([new Date('2026-10-12T08:00:00')], now), true)
})

test('отметка вчера → ещё не выполнена', () => {
  assert.equal(isDoneToday([new Date('2026-10-11T23:00:00')], now), false)
})

test('нет отметок → не выполнена', () => {
  assert.equal(isDoneToday([], now), false)
})
