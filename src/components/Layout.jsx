import { Link, Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-800">
        <Link to="/" className="text-xl font-bold text-white hover:text-indigo-400 transition-colors">
          seoknyang
        </Link>
        <div className="flex gap-6">
          <Link to="/portfolio" className="text-gray-300 hover:text-white transition-colors">Portfolio</Link>
          <Link to="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-8 py-12">
        <Outlet />
      </main>

      <footer className="text-center py-8 text-gray-500 text-sm border-t border-gray-800">
        © 2025 seoknyang
      </footer>
    </div>
  )
}

export default Layout
