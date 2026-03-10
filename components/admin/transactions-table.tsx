'use client'

import { Transaction } from '@/lib/database.types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TrendingUp, TrendingDown } from 'lucide-react'

type TransactionsTableProps = {
  transactions: (Transaction & { profile?: { full_name: string | null } | null })[]
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
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Giao dịch gần đây</CardTitle>
        <CardDescription>
          50 giao dịch gần nhất trong hệ thống
        </CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Chưa có giao dịch nào
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Người dùng</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead className="text-right">Số tiền</TableHead>
                <TableHead>Ngày</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {transaction.profile?.full_name || 'N/A'}
                  </TableCell>
                  <TableCell>
                    {transaction.category?.name || 'Không xác định'}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {transaction.description || '-'}
                  </TableCell>
                  <TableCell>
                    {transaction.type === 'income' ? (
                      <Badge className="bg-success/10 text-success hover:bg-success/20">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Thu nhập
                      </Badge>
                    ) : (
                      <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20">
                        <TrendingDown className="h-3 w-3 mr-1" />
                        Chi tiêu
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell
                    className={`text-right font-semibold ${
                      transaction.type === 'income' ? 'text-success' : 'text-destructive'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(transaction.date)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
