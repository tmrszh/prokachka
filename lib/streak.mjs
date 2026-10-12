export function isDoneToday(checkInDates, now = new Date()) {
  const startOfToday = new Date(now)
  startOfToday.setHours(0, 0, 0, 0)
  return checkInDates.some((date) => date >= startOfToday)
}
