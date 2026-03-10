"use client"

import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/lib/types"
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from "lucide-react"

interface StatsCardsProps {
  totalIncome: number
  totalExpense: number
  balance: number
  savingsRate: number
}

export function StatsCards({ totalIncome, totalExpense, balance, savingsRate }: StatsCardsProps) {
  const stats = [
    {
      label: "Tổng thu nhập",
      value: formatCurrency(totalIncome),
      icon: TrendingUp,
      color: "text-success",
      bgColor: "bg-success/10",
      trend: "+12.5% so với tháng trước",
      trendUp: true,
    },
    {
      label: "Tổng chi tiêu",
      value: formatCurrency(totalExpense),
      icon: TrendingDown,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      trend: "-5.2% so với tháng trước",
      trendUp: false,
    },
    {
      label: "Số dư hiện tại",
      value: formatCurrency(balance),
      icon: Wallet,
      color: "text-primary",
      bgColor: "bg-primary/10",
      trend: "Tháng này",
      trendUp: true,
    },
    {
      label: "Tỷ lệ tiết kiệm",
      value: `${savingsRate.toFixed(1)}%`,
      icon: PiggyBank,
      color: "text-warning",
      bgColor: "bg-warning/10",
      trend: "Mục tiêu: 30%",
      trendUp: savingsRate >= 30,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
            <p className={`mt-3 text-xs ${stat.trendUp ? 'text-success' : 'text-muted-foreground'}`}>
              {stat.trend}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
