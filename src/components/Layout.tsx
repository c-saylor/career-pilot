import { Link, useNavigate, useLocation } from 'react-router-dom'
import { signOut } from '../lib/auth'

interface Props {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  const navigate = useNavigate()
  const location = useLocation()

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  const navItems = [
    { label: 'Board', path: '/dashboard' },
    { label: 'Resumes', path: '/resumes' },
    { label: 'AI Tools', path: '/ai' },
    { label: 'Analytics', path: '/analytics' },
  ]

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-slate-800 border-r border-slate-700 flex flex-col">
        {/* Logo */}
        <div className="p-5 border-b border-slate-700">
          <h1 className="text-white font-bold text-lg">Career Pilot 🚀</h1>
          <p className="text-slate-400 text-xs mt-0.5">Job Search Manager</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Sign out */}
        <div className="p-3 border-t border-slate-700">
          <button
            onClick={handleSignOut}
            className="w-full px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors text-left"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}