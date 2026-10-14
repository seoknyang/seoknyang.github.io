import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowIcon, SearchIcon, SparkIcon } from './ui'
import { OTHER_PROJECT, fetchPostSummaries, formatDate, groupProjects, shortTitle } from '../lib/project'

const PAGES = [
  { kind: '페이지', title: '홈', to: '/' },
  { kind: '페이지', title: '프로젝트', to: '/projects' },
  { kind: '페이지', title: '개발 기록', to: '/blog' },
  { kind: '페이지', title: '소개', to: '/portfolio' },
]

/** Ctrl+K 로 여는 검색창: 페이지, 프로젝트, 글을 한 번에 찾아 이동. 열 때마다 새로 그린다 */
function CommandPalette({ onClose }) {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  useEffect(() => {
    fetchPostSummaries().then(setPosts).catch(() => {})
    requestAnimationFrame(() => inputRef.current?.focus())
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  const items = useMemo(() => {
    const projects = groupProjects(posts)
      .filter((p) => p.name !== OTHER_PROJECT)
      .map((p) => ({
        kind: '프로젝트',
        title: p.name,
        meta: `기록 ${p.count}개`,
        to: `/blog?project=${encodeURIComponent(p.name)}`,
        haystack: [p.name, ...p.tags].join(' '),
      }))
    const postItems = posts.map((p) => ({
      kind: '기록',
      title: shortTitle(p.title),
      meta: `${p.project}, ${formatDate(p.publishedAt)}`,
      to: `/blog/${p.slug}`,
      haystack: [p.title, p.summary, p.project, ...(p.tags ?? [])].join(' '),
    }))
    const all = [...PAGES.map((p) => ({ ...p, haystack: p.title })), ...projects, ...postItems]
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
    if (words.length === 0) return [...PAGES, ...projects, ...postItems.slice(0, 5)]
    return all.filter((it) => words.every((w) => it.haystack.toLowerCase().includes(w))).slice(0, 30)
  }, [posts, query])

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const go = (item) => {
    if (!item) return
    onClose()
    navigate(item.to)
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(i + 1, items.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      go(items[active])
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]" role="dialog" aria-modal="true" aria-label="검색">
      <button aria-label="닫기" onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm rise" style={{ animationDuration: '.25s' }} />
      <div className="rise relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-panel/95 shadow-2xl shadow-black/60" style={{ animationDuration: '.3s' }}>
        <div className="flex items-center gap-3 border-b border-white/10 px-4">
          <SearchIcon className="w-4 h-4 text-gray-500" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActive(0)
            }}
            onKeyDown={onKeyDown}
            placeholder="프로젝트, 기록, 태그 검색"
            className="h-14 flex-1 bg-transparent text-base text-white outline-none placeholder:text-gray-500"
          />
          <kbd className="rounded border border-white/15 px-1.5 py-0.5 font-mono text-[10px] text-gray-500">ESC</kbd>
        </div>
        <ul ref={listRef} className="max-h-[55vh] overflow-y-auto p-2">
          {items.length === 0 && <li className="px-3 py-10 text-center text-sm text-gray-500">찾는 결과가 없어요</li>}
          {items.map((item, i) => (
            <li key={`${item.kind}-${item.to}`} data-index={i}>
              <button
                onMouseMove={() => setActive(i)}
                onClick={() => go(item)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                  i === active ? 'bg-white/[0.07]' : ''
                }`}
              >
                <span
                  className={`w-14 shrink-0 text-[11px] ${
                    item.kind === '기록' ? 'text-signal/80' : 'text-gray-500'
                  }`}
                >
                  {item.kind}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm text-gray-100">{item.title}</span>
                  {item.meta && <span className="block truncate text-xs text-gray-500">{item.meta}</span>}
                </span>
                {i === active && <ArrowIcon className="w-4 h-4 shrink-0 text-signal" />}
              </button>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between gap-3 border-t border-white/10 px-4 py-2.5 font-mono text-[10px] text-gray-500">
          <span className="flex items-center gap-1.5">
            <SparkIcon className="w-3 h-3 text-signal" />
            모든 기록은 AI가 작성했어요
          </span>
          <span className="hidden sm:inline">↑↓ 이동 ↵ 열기</span>
        </div>
      </div>
    </div>
  )
}

export default CommandPalette
