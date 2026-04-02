import { useFinance } from "../context/useFinance"

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value)

export default function TransactionTable({ onAdd, onEdit }) {
  const { filteredTransactions, filters, setFilters, canManageTransactions, deleteTransaction } = useFinance()

  const handleSortChange = (sortBy) => {
    setFilters((prev) => ({ ...prev, sortBy }))
  }

  const handleSortOrderToggle = () => {
    setFilters((prev) => ({ ...prev, sortOrder: prev.sortOrder === "asc" ? "desc" : "asc" }))
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Transactions</h2>
        {canManageTransactions && (
          <button
            type="button"
            onClick={onAdd}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
          >
            Add Transaction
          </button>
        )}
      </div>

      <div className="mb-4 grid gap-3 md:grid-cols-4">
        <input
          type="text"
          placeholder="Search by category or date"
          value={filters.searchTerm}
          onChange={(event) => setFilters((prev) => ({ ...prev, searchTerm: event.target.value }))}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2 dark:border-slate-600 dark:bg-slate-800"
        />

        <select
          value={filters.type}
          onChange={(event) => setFilters((prev) => ({ ...prev, type: event.target.value }))}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
        >
          <option value="all">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <div className="flex gap-2">
          <select
            value={filters.sortBy}
            onChange={(event) => handleSortChange(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
          </select>
          <button
            type="button"
            onClick={handleSortOrderToggle}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800"
          >
            {filters.sortOrder === "asc" ? "Asc" : "Desc"}
          </button>
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-600 dark:text-slate-400">
          No transactions found. Try changing filters or add a new transaction.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400">
              <tr>
                <th className="px-3 py-3 font-medium">Date</th>
                <th className="px-3 py-3 font-medium">Category</th>
                <th className="px-3 py-3 font-medium">Type</th>
                <th className="px-3 py-3 font-medium">Amount</th>
                {canManageTransactions && <th className="px-3 py-3 font-medium">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="px-3 py-3">{transaction.date}</td>
                  <td className="px-3 py-3">{transaction.category}</td>
                  <td className="px-3 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        transaction.type === "income"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                          : "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300"
                      }`}
                    >
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-3 py-3 font-semibold">{formatCurrency(transaction.amount)}</td>
                  {canManageTransactions && (
                    <td className="px-3 py-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(transaction)}
                          className="rounded-md border border-slate-300 px-2 py-1 text-xs hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteTransaction(transaction.id)}
                          className="rounded-md border border-rose-300 px-2 py-1 text-xs text-rose-700 hover:bg-rose-50 dark:border-rose-500/40 dark:text-rose-300 dark:hover:bg-rose-500/10"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
