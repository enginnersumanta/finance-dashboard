import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useFinance } from "../context/useFinance"

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value)

export default function AdvancedAnalyticsReports() {
  const { monthlyReportData, advancedAnalytics } = useFinance()

  const {
    savingsRate,
    dailyBurnRate,
    runwayDays,
    monthOverMonthNetChange,
    latestMonthLabel,
    previousMonthLabel,
  } = advancedAnalytics

  const csvContent = useMemo(() => {
    if (monthlyReportData.length === 0) return ""

    const rows = monthlyReportData.map(
      (row) => `${row.monthLabel},${row.income},${row.expense},${row.net}`,
    )

    return ["Month,Income,Expense,Net", ...rows].join("\n")
  }, [monthlyReportData])

  const handleDownloadReport = () => {
    if (!csvContent) return

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute("download", "finance-monthly-report.csv")
    link.style.visibility = "hidden"

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Advanced Analytics & Reports</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Deep trends and downloadable monthly finance summary.
          </p>
        </div>
        <button
          type="button"
          onClick={handleDownloadReport}
          disabled={!csvContent}
          className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Download CSV Report
        </button>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Savings Rate</p>
          <p className="mt-1 text-lg font-semibold text-slate-800 dark:text-slate-100">{savingsRate.toFixed(1)}%</p>
        </article>

        <article className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Avg Burn / Expense</p>
          <p className="mt-1 text-lg font-semibold text-slate-800 dark:text-slate-100">
            {formatCurrency(dailyBurnRate)}
          </p>
        </article>

        <article className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Runway</p>
          <p className="mt-1 text-lg font-semibold text-slate-800 dark:text-slate-100">
            {Number.isFinite(runwayDays) ? `${Math.max(0, runwayDays).toFixed(1)} periods` : "N/A"}
          </p>
        </article>

        <article className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Net Change (MoM)</p>
          <p
            className={`mt-1 text-lg font-semibold ${
              monthOverMonthNetChange >= 0
                ? "text-emerald-700 dark:text-emerald-300"
                : "text-rose-700 dark:text-rose-300"
            }`}
          >
            {formatCurrency(monthOverMonthNetChange)}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {latestMonthLabel} vs {previousMonthLabel}
          </p>
        </article>
      </div>

      {monthlyReportData.length === 0 ? (
        <div className="mt-4 rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-600 dark:text-slate-400">
          No monthly report data available yet.
        </div>
      ) : (
        <div className="mt-5 grid gap-4 lg:grid-cols-5">
          <div className="rounded-xl border border-slate-200 p-4 lg:col-span-3 dark:border-slate-700">
            <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">Income vs Expenses by Month</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer>
                <BarChart data={monthlyReportData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="monthLabel" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="income" fill="#16a34a" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="expense" fill="#e11d48" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-4 lg:col-span-2 dark:border-slate-700">
            <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">Monthly Report</h3>
            <div className="max-h-72 overflow-auto">
              <table className="min-w-full text-left text-xs">
                <thead className="sticky top-0 bg-white text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                  <tr>
                    <th className="px-2 py-2">Month</th>
                    <th className="px-2 py-2">Income</th>
                    <th className="px-2 py-2">Expense</th>
                    <th className="px-2 py-2">Net</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyReportData.map((row) => (
                    <tr key={row.monthKey} className="border-t border-slate-100 dark:border-slate-800">
                      <td className="px-2 py-2">{row.monthLabel}</td>
                      <td className="px-2 py-2">{formatCurrency(row.income)}</td>
                      <td className="px-2 py-2">{formatCurrency(row.expense)}</td>
                      <td
                        className={`px-2 py-2 font-semibold ${
                          row.net >= 0
                            ? "text-emerald-700 dark:text-emerald-300"
                            : "text-rose-700 dark:text-rose-300"
                        }`}
                      >
                        {formatCurrency(row.net)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
