"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Transaction } from "@/lib/database.types"
import { Search, Trash2, TrendingDown, TrendingUp, Filter } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface TransactionsListProps {
  transactions: Transaction[]
  onDelete: (id: string) => Promise<{ success: boolean; error?: string }>
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function TransactionsList({ transactions, onDelete }: TransactionsListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    await onDelete(id)
    setDeletingId(null)
  }

  const filteredTransactions = transactions.filter(t => {
    const description = t.description || ''
    const categoryName = t.category?.name || ''
    const matchesSearch = description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          categoryName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || t.type === filterType
    return matchesSearch && matchesType
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Tất cả giao dịch</CardTitle>
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm giao dịch..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                {filterType === 'all' && 'Tất cả'}
                {filterType === 'income' && 'Thu nhập'}
                {filterType === 'expense' && 'Chi tiêu'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilterType('all')}>
                Tất cả
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('income')}>
                Thu nhập
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('expense')}>
                Chi tiêu
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredTransactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Không tìm thấy giao dịch nào
            </p>
          ) : (
            filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center gap-4 rounded-lg bg-secondary/50 p-4 transition-colors hover:bg-secondary group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background">
                  {transaction.type === 'income' ? (
                    <TrendingUp className="h-5 w-5 text-success" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-destructive" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {transaction.description || transaction.category?.name || 'Giao dịch'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {transaction.category?.name || 'Không xác định'} • {formatDate(transaction.date)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-semibold ${
                    transaction.type === 'income' ? 'text-success' : 'text-destructive'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(transaction.id)}
                    disabled={deletingId === transaction.id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
