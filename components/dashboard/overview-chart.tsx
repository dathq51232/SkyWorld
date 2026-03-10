"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

interface OverviewChartProps {
  data: Array<{
    name: string
    income: number
    expense: number
  }>
}

export function OverviewChart({ data }: OverviewChartProps) {
  const formatYAxis = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(0)}M`
    }
    return value.toString()
  }

  const formatTooltip = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value)
  }

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Thu nhập & Chi tiêu theo tháng</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.55 0.2 160)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.55 0.2 160)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.55 0.22 25)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.55 0.22 25)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="name" 
                className="text-xs fill-muted-foreground"
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tickFormatter={formatYAxis}
                className="text-xs fill-muted-foreground"
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'oklch(0.16 0.02 250)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'oklch(0.95 0 0)',
                }}
                formatter={(value: number, name: string) => [
                  formatTooltip(value),
                  name === 'income' ? 'Thu nhập' : 'Chi tiêu'
                ]}
                labelStyle={{ color: 'oklch(0.65 0.02 250)' }}
              />
              <Legend 
                formatter={(value) => value === 'income' ? 'Thu nhập' : 'Chi tiêu'}
              />
              <Area
                type="monotone"
                dataKey="income"
                stroke="oklch(0.55 0.2 160)"
                strokeWidth={2}
                fill="url(#incomeGradient)"
              />
              <Area
                type="monotone"
                dataKey="expense"
                stroke="oklch(0.55 0.22 25)"
                strokeWidth={2}
                fill="url(#expenseGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
