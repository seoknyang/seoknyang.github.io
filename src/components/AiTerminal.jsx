import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SparkIcon } from './ui'
import { shortTitle } from '../lib/project'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const FALLBACK = [{ project: 'my-project', title: '오늘의 개발 기록', slug: null }]

/**
 * 첫 화면 터미널: 최근 글이 실제로 어떻게 발행됐는지 재현한다.
 * 프로젝트 폴더에서 Claude Code를 열고 /publish-devlog 한 줄이면
 * AI가 커밋을 읽고 글을 써서 이 블로그에 올린다.
 */
function AiTerminal({ posts }) {
  const list = posts.length > 0 ? posts.slice(0, 3) : FALLBACK
  const [index, setIndex] = useState(0)
  const [lines, setLines] = useState([])
  const post = list[index % list.length]
  const dir = `~/${post.project.replace(/\s+/g, '-')}`

  useEffect(() => {
    let alive = true
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const push = (line) => alive && setLines((ls) => [...ls, line])
    const patchLast = (patch) => alive && setLines((ls) => [...ls.slice(0, -1), { ...ls[ls.length - 1], ...patch }])

    const type = async (kind, full) => {
      push({ kind, text: '', typing: true })
      if (reduce) return patchLast({ text: full, typing: false })
      for (let i = 1; i <= full.length; i++) {
        if (!alive) return
        patchLast({ text: full.slice(0, i) })
        await sleep(28 + Math.random() * 40)
      }
      patchLast({ typing: false })
    }

    const task = async (text) => {
      push({ kind: 'task', text, done: false })
      await sleep(reduce ? 0 : 700 + Math.random() * 500)
      patchLast({ done: true })
    }

    const run = async () => {
      setLines([])
      await sleep(400)
      await type('cmd', 'claude')
      await sleep(350)
      push({ kind: 'sys', text: 'Claude Code 세션 시작' })
      await sleep(500)
      await type('user', '/publish-devlog')
      await sleep(400)
      await task('오늘 커밋 내역 읽는 중')
      await task('바뀐 파일과 스크린샷 정리하는 중')
      await task('개발 기록 쓰는 중')
      await task('블로그에 발행하는 중')
      push({ kind: 'ok', text: '발행 완료' })
      push({ kind: 'link', text: shortTitle(post.title), slug: post.slug })
      await sleep(reduce ? 12000 : 5200)
      if (alive) setIndex((i) => i + 1)
    }
    run()
    return () => {
      alive = false
    }
  }, [index, post.title, post.slug])

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0c0e]/90 shadow-[0_40px_120px_-40px_rgb(196_243_106_/_0.35)] backdrop-blur">
      <div className="flex items-center gap-2 border-b border-white/[0.08] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 truncate font-mono text-xs text-gray-500">{dir}</span>
        <span className="ml-auto flex shrink-0 items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-signal/80">
          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-signal" />
          live replay
        </span>
      </div>
      <div className="min-h-[300px] p-5 font-mono text-[13px] leading-7 sm:text-sm" aria-live="off">
        {lines.map((l, i) => (
          <TerminalLine key={`${index}-${i}`} line={l} dir={dir} last={i === lines.length - 1} />
        ))}
        {lines.length === 0 && <span className="caret" />}
      </div>
      <div className="flex items-center gap-2 border-t border-white/[0.08] px-4 py-2.5 text-xs text-gray-500">
        <SparkIcon className="w-3 h-3 text-signal" />
        이 블로그의 글은 모두 이렇게 올라옵니다
        <span className="ml-auto font-mono">
          {(index % list.length) + 1}/{list.length}
        </span>
      </div>
    </div>
  )
}

function TerminalLine({ line, dir, last }) {
  const caret = line.typing || (last && line.kind === 'link') ? <span className="caret" /> : null
  switch (line.kind) {
    case 'cmd':
      return (
        <p className="truncate">
          <span className="text-teal-300">{dir}</span> <span className="text-gray-500">$</span> {line.text}
          {line.typing && caret}
        </p>
      )
    case 'sys':
      return (
        <p className="text-gray-500">
          <span className="text-signal">✻</span> {line.text}
        </p>
      )
    case 'user':
      return (
        <p className="mt-1 rounded-md bg-white/[0.04] px-2 -mx-2">
          <span className="text-gray-500">&gt;</span> <span className="text-white">{line.text}</span>
          {line.typing && caret}
        </p>
      )
    case 'task':
      return (
        <p className="flex items-center gap-2 text-gray-400">
          <span className={line.done ? 'text-signal' : 'animate-pulse text-amber-300'}>●</span>
          {line.text}
          {line.done && <span className="text-gray-600">완료</span>}
        </p>
      )
    case 'ok':
      return <p className="mt-1 text-signal">✓ {line.text}</p>
    case 'link':
      return (
        <p className="pl-4 text-gray-200">
          {line.slug ? (
            <Link to={`/blog/${line.slug}`} className="underline decoration-signal/40 underline-offset-4 hover:decoration-signal">
              {line.text}
            </Link>
          ) : (
            line.text
          )}
          {caret}
        </p>
      )
    default:
      return null
  }
}

export default AiTerminal
