export type Profile = {
  id: string
  full_name: string | null
  avatar_url: string | null
  is_admin: boolean
  created_at: string
  updated_at: string
}

export type Category = {
  id: string
  name: string
  type: 'income' | 'expense'
  icon: string | null
  color: string | null
  is_default: boolean
  created_at: string
}

export type Transaction = {
  id: string
  user_id: string
  category_id: string | null
  amount: number
  type: 'income' | 'expense'
  description: string | null
  date: string
  created_at: string
  updated_at: string
  category?: Category
}

export type Goal = {
  id: string
  user_id: string
  name: string
  target_amount: number
  current_amount: number
  deadline: string | null
  status: 'active' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
}

export type UserWithProfile = {
  id: string
  email: string
  created_at: string
  last_sign_in_at: string | null
  profile: Profile | null
  transaction_count?: number
  total_income?: number
  total_expense?: number
}
