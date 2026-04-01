import { useEffect, useMemo, useState } from "react"
import { FinanceContext } from "./FinanceContext"
import { useAuth } from "./useAuth"
import { mockTransactions } from "../data/mockData"

const TRANSACTIONS_STORAGE_KEY = "finance.transactions"
const DARK_MODE_STORAGE_KEY = "finance.darkMode"

const monthLabel = (date) =>
  new Date(date).toLocaleDateString("en-US", { month: "short", year: "numeric" })

const safeNumber = (value) => Number(value) || 0

export function FinanceProvider({ children }) {
  const { role } = useAuth()

  const [transactions, setTransactions] = useState(() => {
    const stored = localStorage.getItem(TRANSACTIONS_STORAGE_KEY)
    return stored ? JSON.parse(stored) : mockTransactions
  })

  const [darkMode, setDarkMode] = useState(() => localStorage.getItem(DARK_MODE_STORAGE_KEY) === "true")

  const [filters, setFilters] = useState({
    searchTerm: "",
    type: "all",
    sortBy: "date",
    sortOrder: "desc",
  })

  const canManageTransactions = role === "admin"

  useEffect(() => {
    localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    localStorage.setItem(DARK_MODE_STORAGE_KEY, String(darkMode))
    document.documentElement.classList.toggle("dark", darkMode)
  }, [darkMode])

  const filteredTransactions = useMemo(() => {
    const term = filters.searchTerm.trim().toLowerCase()

    const base = transactions.filter((transaction) => {
      const matchesType = filters.type === "all" || transaction.type === filters.type
      const matchesSearch =
        term.length === 0 ||
        transaction.category.toLowerCase().includes(term) ||
        transaction.date.includes(term)

      return matchesType && matchesSearch
    })

    return [...base].sort((a, b) => {
      if (filters.sortBy === "amount") {
        return filters.sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount
      }

      const aTime = new Date(a.date).getTime()
      const bTime = new Date(b.date).getTime()
      return filters.sortOrder === "asc" ? aTime - bTime : bTime - aTime
    })
  }, [filters, transactions])

  const summary = useMemo(() => {
    const totals = transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === "income") {
          acc.totalIncome += safeNumber(transaction.amount)
        } else {
          acc.totalExpenses += safeNumber(transaction.amount)
        }
        return acc
      },
      { totalIncome: 0, totalExpenses: 0 },
    )

    return {
      ...totals,
      totalBalance: totals.totalIncome - totals.totalExpenses,
    }
  }, [transactions])

  const balanceTrendData = useMemo(() => {
    const sorted = [...transactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    )

    return sorted
      .reduce(
        (acc, transaction) => {
          const nextBalance =
            acc.runningBalance +
            (transaction.type === "income" ? transaction.amount : -transaction.amount)

          return {
            runningBalance: nextBalance,
            points: [
              ...acc.points,
              {
                date: transaction.date,
                label: new Date(transaction.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                }),
                balance: nextBalance,
              },
            ],
          }
        },
        { runningBalance: 0, points: [] },
      )
      .points
  }, [transactions])

  const spendingByCategoryData = useMemo(() => {
    const grouped = transactions.reduce((acc, transaction) => {
      if (transaction.type !== "expense") return acc
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount
      return acc
    }, {})

    return Object.entries(grouped).map(([name, value]) => ({ name, value }))
  }, [transactions])

  const insights = useMemo(() => {
    const expenseCategories = spendingByCategoryData
    const highestSpending =
      expenseCategories.length > 0
        ? expenseCategories.reduce((max, item) => (item.value > max.value ? item : max))
        : null

    const groupedByMonth = transactions.reduce((acc, transaction) => {
      const label = monthLabel(transaction.date)
      if (!acc[label]) {
        acc[label] = { income: 0, expense: 0 }
      }

      if (transaction.type === "income") {
        acc[label].income += transaction.amount
      } else {
        acc[label].expense += transaction.amount
      }

      return acc
    }, {})

    const monthEntries = Object.entries(groupedByMonth)
      .map(([label, values]) => ({ label, ...values }))
      .sort((a, b) => new Date(a.label).getTime() - new Date(b.label).getTime())

    const currentMonth = monthEntries[monthEntries.length - 1]
    const previousMonth = monthEntries[monthEntries.length - 2]

    let monthlyExpenseChange = 0
    if (currentMonth && previousMonth && previousMonth.expense > 0) {
      monthlyExpenseChange =
        ((currentMonth.expense - previousMonth.expense) / previousMonth.expense) * 100
    }

    const avgExpense =
      transactions.filter((transaction) => transaction.type === "expense").reduce((sum, t) => sum + t.amount, 0) /
      (transactions.filter((transaction) => transaction.type === "expense").length || 1)

    return {
      highestSpendingCategory: highestSpending,
      monthlyExpenseChange,
      currentMonthLabel: currentMonth?.label || "N/A",
      previousMonthLabel: previousMonth?.label || "N/A",
      averageExpense: avgExpense,
      totalTransactions: transactions.length,
    }
  }, [spendingByCategoryData, transactions])

  const monthlyReportData = useMemo(() => {
    const groupedByMonth = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date)
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

      if (!acc[key]) {
        acc[key] = {
          monthKey: key,
          monthLabel: date.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
          income: 0,
          expense: 0,
          net: 0,
        }
      }

      if (transaction.type === "income") {
        acc[key].income += transaction.amount
      } else {
        acc[key].expense += transaction.amount
      }

      acc[key].net = acc[key].income - acc[key].expense
      return acc
    }, {})

    return Object.values(groupedByMonth).sort((a, b) =>
      a.monthKey > b.monthKey ? 1 : -1,
    )
  }, [transactions])

  const advancedAnalytics = useMemo(() => {
    const totalIncome = summary.totalIncome
    const totalExpenses = summary.totalExpenses
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0

    const expenseItems = transactions.filter((transaction) => transaction.type === "expense")
    const dailyBurnRate =
      expenseItems.length > 0
        ? expenseItems.reduce((sum, item) => sum + item.amount, 0) / expenseItems.length
        : 0

    const runwayDays = dailyBurnRate > 0 ? summary.totalBalance / dailyBurnRate : 0

    const latestMonth = monthlyReportData[monthlyReportData.length - 1]
    const previousMonth = monthlyReportData[monthlyReportData.length - 2]
    const monthOverMonthNetChange =
      latestMonth && previousMonth ? latestMonth.net - previousMonth.net : 0

    return {
      savingsRate,
      dailyBurnRate,
      runwayDays,
      monthOverMonthNetChange,
      latestMonthLabel: latestMonth?.monthLabel || "N/A",
      previousMonthLabel: previousMonth?.monthLabel || "N/A",
    }
  }, [monthlyReportData, summary.totalBalance, summary.totalExpenses, summary.totalIncome, transactions])

  const addTransaction = (transaction) => {
    if (!canManageTransactions) return

    const newTransaction = {
      ...transaction,
      id: crypto.randomUUID(),
      amount: safeNumber(transaction.amount),
    }
    setTransactions((prev) => [newTransaction, ...prev])
  }

  const updateTransaction = (id, updates) => {
    if (!canManageTransactions) return

    setTransactions((prev) =>
      prev.map((transaction) =>
        transaction.id === id
          ? {
              ...transaction,
              ...updates,
              amount: safeNumber(updates.amount),
            }
          : transaction,
      ),
    )
  }

  const deleteTransaction = (id) => {
    if (!canManageTransactions) return

    setTransactions((prev) => prev.filter((transaction) => transaction.id !== id))
  }

  const value = {
    transactions,
    filteredTransactions,
    filters,
    setFilters,
    role,
    canManageTransactions,
    darkMode,
    setDarkMode,
    summary,
    balanceTrendData,
    spendingByCategoryData,
    monthlyReportData,
    advancedAnalytics,
    insights,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  }

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
}
