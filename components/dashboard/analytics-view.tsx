"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Transaction } from "@/lib/database.types"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

interface AnalyticsViewProps {
  transactions: Transaction[]
}

const COLORS = [
  'oklch(0.65 0.2 25)',
  'oklch(0.6 0.15 250)',
  'oklch(0.7 0.18 300)',
  'oklch(0.65 0.2 160)',
  'oklch(0.7 0.15 85)',
  'oklch(0.55 0.22 25)',
  'oklch(0.55 0.15 250)',
  'oklch(0.5 0.02 250)',
]

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function AnalyticsView({ transactions }: AnalyticsViewProps) {
  // Calculate expense by category
  const expenseByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const categoryName = t.category?.name || 'Khác'
      acc[categoryName] = (acc[categoryName] || 0) + Number(t.amount)
      return acc
    }, {} as Record<string, number>)

  const categoryData = Object.entries(expenseByCategory)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  const totalExpense = categoryData.reduce((sum, item) => sum + item.value, 0)

  // Calculate income by category
  const incomeByCategory = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => {
      const categoryName = t.category?.name || 'Khác'
      acc[categoryName] = (acc[categoryName] || 0) + Number(t.amount)
      return acc
    }, {} as Record<string, number>)

  const incomeData = Object.entries(incomeByCategory)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  const totalIncome = incomeData.reduce((sum, item) => sum + item.value, 0)

  const formatYAxis = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(0)}M`
    }
    return value.toString()
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Expense by Category Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Chi tiêu theo danh mục</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryData.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Chưa có chi tiêu nào
              </p>
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                    <XAxis 
                      type="number" 
                      tickFormatter={formatYAxis}
                      className="text-xs fill-muted-foreground"
                    />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={100}
                      className="text-xs fill-muted-foreground"
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          const percentage = ((data.value / totalExpense) * 100).toFixed(1)
                          return (
                            <div className="rounded-lg bg-card p-3 shadow-lg border border-border">
                              <p className="font-medium">{data.name}</p>
                              <p className="text-sm text-muted-foreground mt-1">
                                {formatCurrency(data.value)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {percentage}% tổng chi tiêu
                              </p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Income by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Thu nhập theo nguồn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {incomeData.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Chưa có thu nhập nào
                </p>
              ) : (
                incomeData.map((item) => {
                  const percentage = (item.value / totalIncome) * 100
                  return (
                    <div key={item.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.name}</span>
                        <span className="font-semibold text-success">
                          {formatCurrency(item.value)}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-success transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground text-right">
                        {percentage.toFixed(1)}% tổng thu nhập
                      </p>
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-success/10 border-success/20">
          <CardContent className="p-6">
            <p className="text-sm text-success font-medium">Tổng thu nhập</p>
            <p className="text-2xl font-bold text-success mt-2">
              {formatCurrency(totalIncome)}
            </p>
            <p className="text-xs text-success/70 mt-1">
              {incomeData.length} nguồn thu nhập
            </p>
          </CardContent>
        </Card>
        <Card className="bg-destructive/10 border-destructive/20">
          <CardContent className="p-6">
            <p className="text-sm text-destructive font-medium">Tổng chi tiêu</p>
            <p className="text-2xl font-bold text-destructive mt-2">
              {formatCurrency(totalExpense)}
            </p>
            <p className="text-xs text-destructive/70 mt-1">
              {categoryData.length} danh mục chi tiêu
            </p>
          </CardContent>
        </Card>
        <Card className="bg-primary/10 border-primary/20">
          <CardContent className="p-6">
            <p className="text-sm text-primary font-medium">Còn lại</p>
            <p className="text-2xl font-bold text-primary mt-2">
              {formatCurrency(totalIncome - totalExpense)}
            </p>
            <p className="text-xs text-primary/70 mt-1">
              {totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome * 100).toFixed(1) : 0}% tiết kiệm
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
