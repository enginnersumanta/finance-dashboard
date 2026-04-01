import {
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { useFinance } from "../context/useFinance"

const PIE_COLORS = ["#16a34a", "#0ea5e9", "#f59e0b", "#e11d48", "#8b5cf6", "#06b6d4"]

export default function Charts() {
  const { balanceTrendData, spendingByCategoryData } = useFinance()

  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Balance Trend</h2>
        <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">Track cumulative balance over time.</p>
        {balanceTrendData.length === 0 ? (
          <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            No transactions available for trend analysis.
          </p>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <LineChart data={balanceTrendData}>
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="balance" stroke="#0ea5e9" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </article>

      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Spending Breakdown</h2>
        <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">Expenses grouped by category.</p>
        {spendingByCategoryData.length === 0 ? (
          <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            No expense entries available for category breakdown.
          </p>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={spendingByCategoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={90}
                  dataKey="value"
                  nameKey="name"
                >
                  {spendingByCategoryData.map((entry, index) => (
                    <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </article>
    </section>
  )
}
