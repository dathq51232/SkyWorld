import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getUsers, getUserStats, getAllTransactions, getAllCategories } from './actions'
import { AdminStats } from '@/components/admin/admin-stats'
import { UsersTable } from '@/components/admin/users-table'
import { CategoriesTable } from '@/components/admin/categories-table'
import { TransactionsTable } from '@/components/admin/transactions-table'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Shield, ArrowLeft, Users, Receipt, FolderTree } from 'lucide-react'

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) {
    redirect('/')
  }

  const [users, stats, transactions, categories] = await Promise.all([
    getUsers(),
    getUserStats(),
    getAllTransactions(),
    getAllCategories(),
  ])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                  <Shield className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Admin Dashboard</h1>
                  <p className="text-sm text-muted-foreground">Quản lý hệ thống</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Stats */}
          <AdminStats stats={stats} />

          {/* Tabs */}
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Người dùng
              </TabsTrigger>
              <TabsTrigger value="transactions" className="flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                Giao dịch
              </TabsTrigger>
              <TabsTrigger value="categories" className="flex items-center gap-2">
                <FolderTree className="h-4 w-4" />
                Danh mục
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="mt-6">
              <UsersTable users={users} />
            </TabsContent>

            <TabsContent value="transactions" className="mt-6">
              <TransactionsTable transactions={transactions} />
            </TabsContent>

            <TabsContent value="categories" className="mt-6">
              <CategoriesTable categories={categories} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
