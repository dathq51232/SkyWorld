'use client'

import { useEffect, useState } from 'react'
import { getUserDetails, deleteUserTransactions } from '@/app/admin/actions'
import { Profile, Transaction, Goal } from '@/lib/database.types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Spinner } from '@/components/ui/spinner'
import { TrendingUp, TrendingDown, Wallet, Target, Trash2 } from 'lucide-react'

type UserDetailDialogProps = {
  userId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

type UserDetails = {
  profile: Profile | null
  transactions: Transaction[]
  goals: Goal[]
  stats: {
    totalIncome: number
    totalExpense: number
    balance: number
    transactionCount: number
  }
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

function getInitials(name: string | null) {
  if (!name) return 'U'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function UserDetailDialog({ userId, open, onOpenChange }: UserDetailDialogProps) {
  const [details, setDetails] = useState<UserDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (userId && open) {
      setLoading(true)
      getUserDetails(userId).then((data) => {
        setDetails(data)
        setLoading(false)
      })
    }
  }, [userId, open])

  const handleDeleteTransactions = async () => {
    if (!userId || !confirm('Bạn có chắc muốn xóa tất cả giao dịch của người dùng này?')) return
    setDeleting(true)
    await deleteUserTransactions(userId)
    const data = await getUserDetails(userId)
    setDetails(data)
    setDeleting(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết người dùng</DialogTitle>
          <DialogDescription>
            Xem thông tin chi tiết và quản lý dữ liệu người dùng
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner className="h-8 w-8" />
          </div>
        ) : details ? (
          <div className="space-y-6">
            {/* User Info */}
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={details.profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-primary/10 text-primary text-xl">
                  {getInitials(details.profile?.full_name || null)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">
                  {details.profile?.full_name || 'Chưa đặt tên'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Tham gia: {details.profile?.created_at ? formatDate(details.profile.created_at) : 'N/A'}
                </p>
                {details.profile?.is_admin && (
                  <Badge className="mt-1 bg-primary/10 text-primary">Admin</Badge>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> Thu nhập
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-bold text-success">
                    {formatCurrency(details.stats.totalIncome)}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <TrendingDown className="h-3 w-3" /> Chi tiêu
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-bold text-destructive">
                    {formatCurrency(details.stats.totalExpense)}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Wallet className="h-3 w-3" /> Số dư
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-bold">
                    {formatCurrency(details.stats.balance)}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Target className="h-3 w-3" /> Giao dịch
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-bold">{details.stats.transactionCount}</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="transactions" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="transactions">
                  Giao dịch ({details.transactions.length})
                </TabsTrigger>
                <TabsTrigger value="goals">
                  Mục tiêu ({details.goals.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="transactions" className="space-y-4">
                <div className="flex justify-end">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDeleteTransactions}
                    disabled={deleting || details.transactions.length === 0}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {deleting ? 'Đang xóa...' : 'Xóa tất cả giao dịch'}
                  </Button>
                </div>
                {details.transactions.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">
                    Chưa có giao dịch nào
                  </p>
                ) : (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {details.transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <div>
                          <p className="font-medium">
                            {transaction.description || transaction.category?.name || 'Giao dịch'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(transaction.date)}
                          </p>
                        </div>
                        <p
                          className={`font-semibold ${
                            transaction.type === 'income' ? 'text-success' : 'text-destructive'
                          }`}
                        >
                          {transaction.type === 'income' ? '+' : '-'}
                          {formatCurrency(transaction.amount)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="goals" className="space-y-2">
                {details.goals.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">
                    Chưa có mục tiêu nào
                  </p>
                ) : (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {details.goals.map((goal) => (
                      <div
                        key={goal.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <div>
                          <p className="font-medium">{goal.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {goal.deadline ? `Hạn: ${formatDate(goal.deadline)}` : 'Không có hạn'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {formatCurrency(goal.current_amount)} / {formatCurrency(goal.target_amount)}
                          </p>
                          <Badge variant={goal.status === 'completed' ? 'default' : 'secondary'}>
                            {goal.status === 'active' ? 'Đang thực hiện' : goal.status === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
