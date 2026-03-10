'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getCategories() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data
}

export async function getTransactions() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('transactions')
    .select('*, category:categories(*)')
    .eq('user_id', user.id)
    .order('date', { ascending: false })

  if (error) {
    console.error('Error fetching transactions:', error)
    return []
  }

  return data
}

export async function addTransaction(data: {
  amount: number
  type: 'income' | 'expense'
  category_id: string
  description?: string
  date: string
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Bạn cần đăng nhập để thực hiện hành động này' }
  }

  const { error } = await supabase.from('transactions').insert({
    user_id: user.id,
    amount: data.amount,
    type: data.type,
    category_id: data.category_id,
    description: data.description,
    date: data.date,
  })

  if (error) {
    console.error('Error adding transaction:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/')
  return { success: true }
}

export async function deleteTransaction(transactionId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Bạn cần đăng nhập để thực hiện hành động này' }
  }

  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', transactionId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting transaction:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/')
  return { success: true }
}

export async function getGoals() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching goals:', error)
    return []
  }

  return data
}

export async function addGoal(data: {
  name: string
  target_amount: number
  deadline?: string
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Bạn cần đăng nhập để thực hiện hành động này' }
  }

  const { error } = await supabase.from('goals').insert({
    user_id: user.id,
    name: data.name,
    target_amount: data.target_amount,
    deadline: data.deadline || null,
    current_amount: 0,
    status: 'active',
  })

  if (error) {
    console.error('Error adding goal:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/')
  return { success: true }
}

export async function updateGoalAmount(goalId: string, amount: number) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Bạn cần đăng nhập để thực hiện hành động này' }
  }

  const { data: goal } = await supabase
    .from('goals')
    .select('current_amount, target_amount')
    .eq('id', goalId)
    .eq('user_id', user.id)
    .single()

  if (!goal) {
    return { success: false, error: 'Không tìm thấy mục tiêu' }
  }

  const newAmount = goal.current_amount + amount
  const status = newAmount >= goal.target_amount ? 'completed' : 'active'

  const { error } = await supabase
    .from('goals')
    .update({ current_amount: newAmount, status })
    .eq('id', goalId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error updating goal:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/')
  return { success: true }
}

export async function deleteGoal(goalId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Bạn cần đăng nhập để thực hiện hành động này' }
  }

  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', goalId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting goal:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/')
  return { success: true }
}

export async function getProfile() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile
}

export async function updateProfile(data: {
  full_name?: string
  avatar_url?: string
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Bạn cần đăng nhập để thực hiện hành động này' }
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error) {
    console.error('Error updating profile:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/')
  return { success: true }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/')
}
