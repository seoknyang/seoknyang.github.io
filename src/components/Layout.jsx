import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Backdrop } from './ui'

const NAV = [
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/projects', label: 'Projects' },
  { to: '/blog', label: 'Blog' },
]

function Layout() {
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // 페이지를 옮기면 맨 위에서 시작
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="relative isolate min-h-screen bg-ink text-gray-100 overflow-x-clip">
      <Backdrop />

      <header
        className={`sticky top-0 z-50 transition-colors duration-300 ${
          scrolled ? 'bg-ink/70 backdrop-blur-xl border-b border-white/10' : 'border-b border-transparent'
        }`}
      >
        <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 md:px-8 h-16">
          <Link to="/" className="group flex items-center gap-2 font-bold tracking-tight">
            <span className="grid place-items-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-cyan-400 text-sm text-white shadow-lg shadow-indigo-500/30 transition group-hover:rotate-6">
              S
            </span>
            <span className="text-lg">seoknyang</span>
          </Link>
          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1 text-sm">
            {NAV.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `px-3 sm:px-4 py-1.5 rounded-full transition ${
                    isActive ? 'bg-white text-black font-semibold' : 'text-gray-400 hover:text-white'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-10 md:py-14">
        <Outlet />
      </main>

      <footer className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} seoknyang</p>
          <p className="font-mono text-xs">Built with React, Tailwind CSS, Sanity</p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
