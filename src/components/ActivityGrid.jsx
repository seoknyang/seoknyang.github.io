import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { dayKey, shortTitle } from '../lib/project'

const WEEKS = 30
const DAY_MS = 24 * 60 * 60 * 1000
const WEEKDAYS = ['일', '', '화', '', '목', '', '토']

const level = (n) => (n === 0 ? 0 : n === 1 ? 1 : n === 2 ? 2 : 3)
const CELL = [
  'bg-white/[0.04]',
  'bg-signal/35',
  'bg-signal/65',
  'bg-signal shadow-[0_0_10px_rgb(196_243_106_/_0.6)]',
]

/** 잔디 모양 기록 달력: 날마다 AI가 쓴 기록 수. 칸을 누르거나 올리면 그날의 글이 보인다 */
function ActivityGrid({ posts }) {
  const scrollRef = useRef(null)

  const { weeks, byDay, months } = useMemo(() => {
    const byDay = {}
    for (const p of posts) (byDay[dayKey(p.publishedAt)] ??= []).push(p)

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    // 마지막 열은 이번 주(일요일 시작)
    const start = new Date(today.getTime() - (today.getDay() + (WEEKS - 1) * 7) * DAY_MS)
    const weeks = []
    const months = []
    for (let w = 0; w < WEEKS; w++) {
      const col = []
      for (let d = 0; d < 7; d++) {
        const date = new Date(start.getTime() + (w * 7 + d) * DAY_MS)
        const key = dayKey(date)
        col.push({ key, date, future: date > today, posts: byDay[key] ?? [] })
      }
      const first = col[0].date
      if (w === 0 || first.getDate() <= 7) months.push({ w, label: `${first.getMonth() + 1}월` })
      weeks.push(col)
    }
    return { weeks, byDay, months }
  }, [posts])

  const latestKey = posts[0] ? dayKey(posts[0].publishedAt) : null
  const [selected, setSelected] = useState(null)
  const current = selected ?? latestKey
  const dayPosts = current ? byDay[current] ?? [] : []

  // 좁은 화면에선 최근 쪽(오른쪽)부터 보이게
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollLeft = el.scrollWidth
  }, [weeks])

  const activeDays = Object.keys(byDay).length

  return (
    <div className="min-w-0 rounded-2xl border border-white/[0.08] bg-panel/70 p-5 backdrop-blur md:p-6">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm text-gray-400">
          최근 {WEEKS}주 동안 <span className="font-semibold text-white">{activeDays}일</span> 기록했어요
        </p>
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-gray-500">
          적음
          {CELL.map((c, i) => (
            <span key={i} className={`h-2.5 w-2.5 rounded-[3px] ${c}`} />
          ))}
          많음
        </div>
      </div>

      <div ref={scrollRef} className="no-scrollbar overflow-x-auto">
        <div className="inline-flex flex-col gap-1.5">
          <div className="relative ml-6 h-4 font-mono text-[10px] text-gray-500">
            {months.map((m) => (
              <span key={m.w} className="absolute" style={{ left: `${m.w * 16}px` }}>
                {m.label}
              </span>
            ))}
          </div>
          <div className="flex gap-1">
            <div className="mr-1 flex w-5 flex-col gap-1 font-mono text-[10px] text-gray-600">
              {WEEKDAYS.map((d, i) => (
                <span key={i} className="h-3 leading-3">
                  {d}
                </span>
              ))}
            </div>
            {weeks.map((col, w) => (
              <div key={w} className="flex flex-col gap-1">
                {col.map((cell) => {
                  const on = cell.key === current
                  return (
                    <button
                      key={cell.key}
                      disabled={cell.future}
                      aria-label={`${cell.key} 기록 ${cell.posts.length}개`}
                      onMouseEnter={() => cell.posts.length && setSelected(cell.key)}
                      onFocus={() => setSelected(cell.key)}
                      onClick={() => setSelected(cell.key)}
                      className={`h-3 w-3 rounded-[3px] transition duration-200 hover:scale-150 ${
                        cell.future ? 'opacity-0' : CELL[level(cell.posts.length)]
                      } ${on ? 'ring-2 ring-white ring-offset-1 ring-offset-panel' : ''}`}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 border-t border-white/[0.08] pt-4">
        <p className="font-mono text-xs text-gray-500">
          {current ?? '날짜를 골라 보세요'}
          {current && <span className="ml-2 text-signal/80">기록 {dayPosts.length}개</span>}
        </p>
        {dayPosts.length > 0 ? (
          <ul className="mt-2 space-y-1">
            {dayPosts.map((p) => (
              <li key={p._id}>
                <Link to={`/blog/${p.slug}`} className="group flex items-baseline gap-2 text-sm">
                  <span className="shrink-0 text-xs text-signal/70">{p.project}</span>
                  <span className="truncate text-gray-300 group-hover:text-white group-hover:underline underline-offset-4">
                    {shortTitle(p.title)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          current && <p className="mt-2 text-sm text-gray-500">이날은 쉬었어요</p>
        )}
      </div>
    </div>
  )
}

export default ActivityGrid
