import { useFinance } from "../context/useFinance"
import { useAuth } from "../context/useAuth"

export default function RoleSwitcher() {
  const { role, darkMode, setDarkMode } = useFinance()
  const { user, logout } = useAuth()

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800">
        <p className="font-medium text-slate-700 dark:text-slate-200">{user?.name}</p>
        <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{role}</p>
      </div>

      <button
        type="button"
        onClick={() => setDarkMode((prev) => !prev)}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700"
      >
        {darkMode ? "Light mode" : "Dark mode"}
      </button>

      <button
        type="button"
        onClick={logout}
        className="rounded-lg border border-rose-300 bg-white px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50 dark:border-rose-500/40 dark:bg-slate-800 dark:text-rose-300 dark:hover:bg-rose-500/10"
      >
        Logout
      </button>
    </div>
  )
}
