import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import CommandPalette from './CommandPalette'
import { Backdrop, SearchIcon, SparkIcon } from './ui'

const NAV = [
  { to: '/projects', label: 'Projects' },
  { to: '/blog', label: 'Devlog' },
  { to: '/portfolio', label: 'About' },
]

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)

function Layout() {
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Ctrl+K (맥은 Cmd+K) 또는 / 로 검색창
  useEffect(() => {
    const onKey = (e) => {
      const typing = /INPUT|TEXTAREA/.test(document.activeElement?.tagName)
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen((v) => !v)
      } else if (e.key === '/' && !typing) {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // 페이지를 옮기면 맨 위에서 시작
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="relative isolate min-h-screen text-gray-100 overflow-x-clip">
      <Backdrop />

      <header
        className={`sticky top-0 z-50 transition-colors duration-300 ${
          scrolled ? 'bg-ink/70 backdrop-blur-xl border-b border-white/[0.08]' : 'border-b border-transparent'
        }`}
      >
        <nav className="max-w-6xl mx-auto flex items-center justify-between gap-2 px-4 md:px-8 h-16">
          <Link to="/" className="group flex items-center gap-2.5 font-bold tracking-tight">
            <span className="grid place-items-center w-8 h-8 rounded-lg bg-signal text-ink shadow-[0_0_24px_-4px_rgb(196_243_106_/_0.7)] transition duration-500 group-hover:rotate-90">
              <SparkIcon className="w-4 h-4" />
            </span>
            <span className="hidden text-lg min-[400px]:inline">
              seoknyang<span className="hidden sm:inline font-mono text-sm font-medium text-gray-500">/lab</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5 rounded-full border border-white/10 bg-white/[0.03] p-1 text-sm backdrop-blur">
              {NAV.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `px-2.5 sm:px-4 py-1.5 rounded-full transition text-[13px] sm:text-sm ${
                      isActive ? 'bg-signal text-ink font-semibold' : 'text-gray-400 hover:text-white'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </div>
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="검색"
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] p-2.5 sm:px-3 sm:py-2 text-gray-400 backdrop-blur transition hover:border-white/30 hover:text-white"
            >
              <SearchIcon className="w-4 h-4" />
              <kbd className="hidden md:inline font-mono text-[11px]">{isMac ? '⌘K' : 'Ctrl K'}</kbd>
            </button>
          </div>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-10 md:py-14">
        <Outlet />
      </main>

      <footer className="mt-10 border-t border-white/[0.08] bg-ink/60 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 grid gap-8 md:grid-cols-[1.4fr_1fr] items-end">
          <div>
            <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-signal/80">
              <SparkIcon className="w-3.5 h-3.5" />
              Made with AI
            </p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-gray-400">
              이곳의 프로젝트는 AI와 대화하며 만들었고, 개발 기록은 AI가 그날의 커밋 내역을 읽고 직접 썼습니다. 사람은 무엇을 만들지 정하고 방향을 잡습니다.
            </p>
          </div>
          <div className="flex flex-col gap-2 text-sm text-gray-500 md:items-end">
            <p className="font-mono text-xs">Claude Code, React, Tailwind CSS, Sanity</p>
            <p>© {new Date().getFullYear()} 천석녕</p>
          </div>
        </div>
      </footer>

      {searchOpen && <CommandPalette onClose={() => setSearchOpen(false)} />}
    </div>
  )
}

export default Layout
