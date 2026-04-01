import { useMemo, useState } from "react"
import AdvancedAnalyticsReports from "../components/AdvancedAnalyticsReports"
import Charts from "../components/Charts"
import Insights from "../components/Insights"
import RoleSwitcher from "../components/RoleSwitcher"
import SummaryCard from "../components/SummaryCard"
import TransactionModal from "../components/TransactionModal"
import TransactionTable from "../components/TransactionTable"
import { useFinance } from "../context/useFinance"

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-In", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value)

export default function Dashboard() {
  const { summary, canManageTransactions, addTransaction, updateTransaction } = useFinance()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)

  const cards = useMemo(
    () => [
      { title: "Total Balance", value: formatCurrency(summary.totalBalance), accent: "sky" },
      { title: "Total Income", value: formatCurrency(summary.totalIncome), accent: "emerald" },
      { title: "Total Expenses", value: formatCurrency(summary.totalExpenses), accent: "rose" },
    ],
    [summary.totalBalance, summary.totalExpenses, summary.totalIncome],
  )

  const openAddModal = () => {
    if (!canManageTransactions) return
    setEditingTransaction(null)
    setIsModalOpen(true)
  }

  const openEditModal = (transaction) => {
    if (!canManageTransactions) return
    setEditingTransaction(transaction)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setEditingTransaction(null)
    setIsModalOpen(false)
  }

  const handleSaveTransaction = (payload) => {
    if (!canManageTransactions) return

    if (editingTransaction) {
      updateTransaction(editingTransaction.id, payload)
    } else {
      addTransaction(payload)
    }
    closeModal()
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-100 via-sky-50 to-emerald-100 px-4 py-8 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 dark:text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Finance Dashboard</p>
            <h1 className="text-3xl font-bold">Authenticated Finance Workspace</h1>
          </div>
          <RoleSwitcher />
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <SummaryCard key={card.title} title={card.title} value={card.value} accent={card.accent} />
          ))}
        </section>

        <Charts />
        <Insights />
        <AdvancedAnalyticsReports />
        <TransactionTable onAdd={openAddModal} onEdit={openEditModal} />

        {canManageTransactions && (
          <TransactionModal
            key={editingTransaction?.id || "new"}
            isOpen={isModalOpen}
            onClose={closeModal}
            onSave={handleSaveTransaction}
            initialData={editingTransaction}
          />
        )}
      </div>
    </main>
  )
}
