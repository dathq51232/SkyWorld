"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Transaction, formatCurrency, formatDate, EXPENSE_CATEGORIES, INCOME_CATEGORIES, ALL_CATEGORIES } from "@/lib/types"
import { ArrowRight, TrendingDown, TrendingUp } from "lucide-react"

interface RecentTransactionsProps {
  transactions: Transaction[]
  onViewAll: () => void
}

export function RecentTransactions({ transactions, onViewAll }: RecentTransactionsProps) {
  const getCategoryIcon = (categoryName: string) => {
    const category = ALL_CATEGORIES.find(c => c.name === categoryName)
    return category?.icon || '📦'
  }

  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Giao dịch gần đây</CardTitle>
        <Button variant="ghost" className="gap-1 text-sm" onClick={onViewAll}>
          Xem tất cả
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Chưa có giao dịch nào
            </p>
          ) : (
            transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center gap-4 rounded-lg bg-secondary/50 p-4 transition-colors hover:bg-secondary"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background text-lg">
                  {getCategoryIcon(transaction.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{transaction.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {transaction.category} • {formatDate(transaction.date)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${
                    transaction.type === 'income' ? 'text-success' : 'text-destructive'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </span>
                  {transaction.type === 'income' ? (
                    <TrendingUp className="h-4 w-4 text-success" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
