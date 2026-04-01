export default function SummaryCard({ title, value, accent = "emerald" }) {
  const accentStyles = {
    emerald: "from-emerald-500/15 to-emerald-100/40 text-emerald-800 dark:text-emerald-300",
    sky: "from-sky-500/15 to-sky-100/40 text-sky-800 dark:text-sky-300",
    rose: "from-rose-500/15 to-rose-100/40 text-rose-800 dark:text-rose-300",
  }

  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-gradient-to-br p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 ${accentStyles[accent]}`}
    >
      <p className="text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{title}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  )
}
