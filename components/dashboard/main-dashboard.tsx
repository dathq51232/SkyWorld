"use client"

import { useState, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { StatsCards } from "./stats-cards"
import { OverviewChart } from "./overview-chart"
import { CategoryChart } from "./category-chart"
import { RecentTransactions } from "./recent-transactions"
import { AddTransactionDialog } from "./add-transaction-dialog"
import { TransactionsList } from "./transactions-list"
import { AnalyticsView } from "./analytics-view"
import { GoalsView } from "./goals-view"
import { SettingsView } from "./settings-view"
import { Transaction, Category, Goal } from "@/lib/database.types"
import { Profile } from "@/lib/database.types"
import { addTransaction as addTransactionAction, deleteTransaction as deleteTransactionAction, signOut } from "@/app/actions"

const TAB_TITLES: Record<string, string> = {
  dashboard: "Tổng quan",
  transactions: "Giao dịch",
  analytics: "Phân tích",
  goals: "Mục tiêu",
  settings: "Cài đặt",
}

type MainDashboardProps = {
  transactions: Transaction[]
  categories: Category[]
  goals: Goal[]
  profile: Profile | null
  isAdmin: boolean
}

export function MainDashboard({ 
  transactions: initialTransactions, 
  categories,
  goals,
  profile,
  isAdmin
}: MainDashboardProps) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [transactions, setTransactions] = useState(initialTransactions)
  const router = useRouter()

  // Calculate summary
  const summary = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0)
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0)
    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      savingsRate: totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0,
    }
  }, [transactions])

  // Category data for chart
  const categoryData = useMemo(() => {
    const expenseTransactions = transactions.filter(t => t.type === 'expense')
    const categoryMap = new Map<string, number>()
    
    expenseTransactions.forEach(t => {
      const categoryName = t.category?.name || 'Khác'
      const current = categoryMap.get(categoryName) || 0
      categoryMap.set(categoryName, current + Number(t.amount))
    })

    return Array.from(categoryMap.entries()).map(([name, value]) => ({
      name,
      value,
    }))
  }, [transactions])

  // Monthly data for chart
  const monthlyData = useMemo(() => {
    const monthMap = new Map<string, { income: number; expense: number }>()
    const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12']
    
    months.forEach(month => {
      monthMap.set(month, { income: 0, expense: 0 })
    })

    transactions.forEach(t => {
      const date = new Date(t.date)
      const monthKey = months[date.getMonth()]
      const current = monthMap.get(monthKey)!
      if (t.type === 'income') {
        current.income += Number(t.amount)
      } else {
        current.expense += Number(t.amount)
      }
    })

    return months.map(month => ({
      month,
      ...monthMap.get(month)!,
    }))
  }, [transactions])

  const handleAddTransaction = useCallback(async (data: {
    amount: number
    type: 'income' | 'expense'
    category_id: string
    description?: string
    date: string
  }) => {
    const result = await addTransactionAction(data)
    if (result.success) {
      router.refresh()
    }
    return result
  }, [router])

  const handleDeleteTransaction = useCallback(async (id: string) => {
    const result = await deleteTransactionAction(id)
    if (result.success) {
      setTransactions(prev => prev.filter(t => t.id !== id))
    }
    return result
  }, [])

  const handleSignOut = useCallback(async () => {
    await signOut()
    router.push('/auth/login')
    router.refresh()
  }, [router])

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <StatsCards 
              totalIncome={summary.totalIncome}
              totalExpense={summary.totalExpense}
              balance={summary.balance}
              savingsRate={summary.savingsRate}
            />
            <div className="grid gap-6 lg:grid-cols-3">
              <OverviewChart data={monthlyData} />
              <CategoryChart data={categoryData} />
            </div>
            <RecentTransactions 
              transactions={transactions.slice(0, 5)} 
              onViewAll={() => setActiveTab("transactions")}
            />
          </div>
        )
      case "transactions":
        return (
          <TransactionsList 
            transactions={transactions} 
            onDelete={handleDeleteTransaction}
          />
        )
      case "analytics":
        return <AnalyticsView transactions={transactions} />
      case "goals":
        return <GoalsView goals={goals} />
      case "settings":
        return <SettingsView profile={profile} onSignOut={handleSignOut} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
        isAdmin={isAdmin}
      />

      <div className="lg:pl-64">
        <Header 
          title={TAB_TITLES[activeTab] || "Tổng quan"}
          onMenuClick={() => setIsMobileMenuOpen(true)}
          onAddTransaction={() => setIsAddDialogOpen(true)}
          profile={profile}
        />

        <main className="p-4 md:p-6">
          {renderContent()}
        </main>
      </div>

      <AddTransactionDialog 
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={handleAddTransaction}
        categories={categories}
      />
    </div>
  )
}
