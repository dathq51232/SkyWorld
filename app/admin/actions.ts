'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getUsers() {
  const supabase = await createClient()
  
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching users:', error)
    return []
  }

  return profiles
}

export async function getUserStats() {
  const supabase = await createClient()
  
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  const { count: totalTransactions } = await supabase
    .from('transactions')
    .select('*', { count: 'exact', head: true })

  const { data: incomeData } = await supabase
    .from('transactions')
    .select('amount')
    .eq('type', 'income')

  const { data: expenseData } = await supabase
    .from('transactions')
    .select('amount')
    .eq('type', 'expense')

  const totalIncome = incomeData?.reduce((sum, t) => sum + Number(t.amount), 0) || 0
  const totalExpense = expenseData?.reduce((sum, t) => sum + Number(t.amount), 0) || 0

  const { count: activeGoals } = await supabase
    .from('goals')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  return {
    totalUsers: totalUsers || 0,
    totalTransactions: totalTransactions || 0,
    totalIncome,
    totalExpense,
    activeGoals: activeGoals || 0,
  }
}

export async function getUserDetails(userId: string) {
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  const { data: transactions } = await supabase
    .from('transactions')
    .select('*, category:categories(*)')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(20)

  const { data: goals } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  const { data: incomeData } = await supabase
    .from('transactions')
    .select('amount')
    .eq('user_id', userId)
    .eq('type', 'income')

  const { data: expenseData } = await supabase
    .from('transactions')
    .select('amount')
    .eq('user_id', userId)
    .eq('type', 'expense')

  const totalIncome = incomeData?.reduce((sum, t) => sum + Number(t.amount), 0) || 0
  const totalExpense = expenseData?.reduce((sum, t) => sum + Number(t.amount), 0) || 0

  return {
    profile,
    transactions: transactions || [],
    goals: goals || [],
    stats: {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      transactionCount: transactions?.length || 0,
    },
  }
}

export async function updateUserAdmin(userId: string, isAdmin: boolean) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('profiles')
    .update({ is_admin: isAdmin })
    .eq('id', userId)

  if (error) {
    console.error('Error updating admin status:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin')
  return { success: true }
}

export async function deleteUserTransactions(userId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('user_id', userId)

  if (error) {
    console.error('Error deleting transactions:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin')
  return { success: true }
}

export async function getAllTransactions(limit: number = 50) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('transactions')
    .select('*, category:categories(*), profile:profiles(full_name)')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching transactions:', error)
    return []
  }

  return data
}

export async function getAllCategories() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('type', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data
}

export async function addCategory(name: string, type: 'income' | 'expense', icon?: string, color?: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('categories')
    .insert({
      name,
      type,
      icon,
      color,
      is_default: true,
    })

  if (error) {
    console.error('Error adding category:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin')
  return { success: true }
}

export async function deleteCategory(categoryId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', categoryId)

  if (error) {
    console.error('Error deleting category:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin')
  return { success: true }
}
