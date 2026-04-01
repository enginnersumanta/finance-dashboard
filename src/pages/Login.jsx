import { useState } from "react"
import { useAuth } from "../context/useAuth"

export default function Login() {
  const { login, authError, setAuthError } = useAuth()
  const [email, setEmail] = useState("admin@finance.com")
  const [password, setPassword] = useState("admin123")
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    login(email, password)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-100 via-sky-50 to-emerald-100 px-4 py-8 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Finance Dashboard Login</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Sign in as Admin or Viewer to continue.
        </p>

        <div className="mt-3 rounded-lg bg-slate-50 p-3 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <p>Admin: admin@finance.com / admin123</p>
          <p>Viewer: viewer@finance.com / viewer123</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                setAuthError("")
              }}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                  setAuthError("")
                }}
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 pr-20 text-sm text-slate-900 placeholder:text-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 px-3 text-xs font-semibold text-sky-700 transition hover:text-sky-600 dark:text-sky-300 dark:hover:text-sky-200"
              >
                <span className="mr-1">{showPassword ? "🙈" : "👁"}</span>
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {authError && (
            <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-300">
              {authError}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
          >
            Sign In
          </button>
        </form>
      </section>
    </main>
  )
}
