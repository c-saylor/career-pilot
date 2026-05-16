import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signUp } from '../lib/auth'

export default function SignupPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await signUp(email, password)
      setSuccess(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="bg-slate-800 p-8 rounded-xl w-full max-w-md border border-slate-700 text-center">
          <div className="text-4xl mb-4">✉️</div>
          <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
          <p className="text-slate-400 text-sm">
            We sent a confirmation link to <span className="text-white">{email}</span>. 
            Click it to activate your account then{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300">
              sign in
            </Link>.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="bg-slate-800 p-8 rounded-xl w-full max-w-md border border-slate-700">
        <h1 className="text-2xl font-bold text-white mb-2">Create an account</h1>
        <p className="text-slate-400 mb-6 text-sm">Start managing your job search</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg p-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-slate-400 block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400 block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
            />
            <p className="text-slate-500 text-xs mt-1">Minimum 6 characters</p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-slate-400 text-sm text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}