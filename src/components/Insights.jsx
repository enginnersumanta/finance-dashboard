import { useFinance } from "../context/useFinance"

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)

export default function Insights() {
  const { insights } = useFinance()
  const {
    highestSpendingCategory,
    monthlyExpenseChange,
    currentMonthLabel,
    previousMonthLabel,
    averageExpense,
    totalTransactions,
  } = insights

  const trendText =
    monthlyExpenseChange > 0
      ? `${monthlyExpenseChange.toFixed(1)}% increase`
      : `${Math.abs(monthlyExpenseChange).toFixed(1)}% decrease`

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Smart Insights</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Highest Spending</p>
          <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
            {highestSpendingCategory
              ? `${highestSpendingCategory.name} (${formatCurrency(highestSpendingCategory.value)})`
              : "No expense data yet"}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Monthly Comparison</p>
          <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
            {currentMonthLabel} vs {previousMonthLabel}: {trendText}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Average Expense</p>
          <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
            {formatCurrency(averageExpense)} over {totalTransactions} transactions
          </p>
        </div>
      </div>
    </section>
  )
}
