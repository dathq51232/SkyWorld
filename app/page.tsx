import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { MainDashboard } from '@/components/dashboard/main-dashboard'
import { getTransactions, getCategories, getGoals, getProfile } from './actions'

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const [transactions, categories, goals, profile] = await Promise.all([
    getTransactions(),
    getCategories(),
    getGoals(),
    getProfile(),
  ])

  return (
    <MainDashboard
      transactions={transactions}
      categories={categories}
      goals={goals}
      profile={profile}
      isAdmin={profile?.is_admin || false}
    />
  )
}
