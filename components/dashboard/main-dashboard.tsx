"use client"

import { useState, useCallback, useMemo } from "react"
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
import { 
  getTransactions, 
  addTransaction, 
  deleteTransaction, 
  getFinancialSummary, 
  getExpensesByCategory, 
  getMonthlyData 
} from "@/lib/finance-store"
import { Transaction } from "@/lib/types"

const TAB_TITLES: Record<string, string> = {
  dashboard: "Tổng quan",
  transactions: "Giao dịch",
  analytics: "Phân tích",
  goals: "Mục tiêu",
  settings: "Cài đặt",
}

export function MainDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  // Get data
  const transactions = useMemo(() => getTransactions(), [refreshKey])
  const summary = useMemo(() => getFinancialSummary(), [refreshKey])
  const categoryData = useMemo(() => getExpensesByCategory(), [refreshKey])
  const monthlyData = useMemo(() => getMonthlyData(), [refreshKey])

  const handleAddTransaction = useCallback((transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    addTransaction(transaction)
    setRefreshKey(k => k + 1)
  }, [])

  const handleDeleteTransaction = useCallback((id: string) => {
    deleteTransaction(id)
    setRefreshKey(k => k + 1)
  }, [])

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
        return <GoalsView />
      case "settings":
        return <SettingsView />
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
      />

      <div className="lg:pl-64">
        <Header 
          title={TAB_TITLES[activeTab] || "Tổng quan"}
          onMenuClick={() => setIsMobileMenuOpen(true)}
          onAddTransaction={() => setIsAddDialogOpen(true)}
        />

        <main className="p-4 md:p-6">
          {renderContent()}
        </main>
      </div>

      <AddTransactionDialog 
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={handleAddTransaction}
      />
    </div>
  )
}
