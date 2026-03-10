"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { formatCurrency, EXPENSE_CATEGORIES } from "@/lib/types"

interface CategoryChartProps {
  data: Array<{
    name: string
    value: number
  }>
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

export function CategoryChart({ data }: CategoryChartProps) {
  const getCategoryIcon = (name: string) => {
    const category = EXPENSE_CATEGORIES.find(c => c.name === name)
    return category?.icon || '📦'
  }

  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Chi tiêu theo danh mục</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    stroke="none"
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    const percentage = ((data.value / total) * 100).toFixed(1)
                    return (
                      <div className="rounded-lg bg-card p-3 shadow-lg border border-border">
                        <p className="font-medium">{getCategoryIcon(data.name)} {data.name}</p>
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
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                formatter={(value: string) => (
                  <span className="text-sm text-foreground">
                    {getCategoryIcon(value)} {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
