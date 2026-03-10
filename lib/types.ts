export interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  category: string
  description: string
  date: string
  createdAt: string
}

export interface Category {
  id: string
  name: string
  icon: string
  type: 'income' | 'expense'
  color: string
}

export interface Budget {
  id: string
  category: string
  limit: number
  spent: number
  month: string
}

export interface FinancialSummary {
  totalIncome: number
  totalExpense: number
  balance: number
  savingsRate: number
}

export const EXPENSE_CATEGORIES: Category[] = [
  { id: '1', name: 'Ăn uống', icon: '🍜', type: 'expense', color: 'oklch(0.65 0.2 25)' },
  { id: '2', name: 'Di chuyển', icon: '🚗', type: 'expense', color: 'oklch(0.6 0.15 250)' },
  { id: '3', name: 'Mua sắm', icon: '🛒', type: 'expense', color: 'oklch(0.7 0.18 300)' },
  { id: '4', name: 'Giải trí', icon: '🎮', type: 'expense', color: 'oklch(0.65 0.2 160)' },
  { id: '5', name: 'Hóa đơn', icon: '📄', type: 'expense', color: 'oklch(0.7 0.15 85)' },
  { id: '6', name: 'Y tế', icon: '💊', type: 'expense', color: 'oklch(0.55 0.22 25)' },
  { id: '7', name: 'Giáo dục', icon: '📚', type: 'expense', color: 'oklch(0.55 0.15 250)' },
  { id: '8', name: 'Khác', icon: '📦', type: 'expense', color: 'oklch(0.5 0.02 250)' },
]

export const INCOME_CATEGORIES: Category[] = [
  { id: '9', name: 'Lương', icon: '💰', type: 'income', color: 'oklch(0.55 0.2 160)' },
  { id: '10', name: 'Thưởng', icon: '🎁', type: 'income', color: 'oklch(0.7 0.15 85)' },
  { id: '11', name: 'Đầu tư', icon: '📈', type: 'income', color: 'oklch(0.6 0.15 250)' },
  { id: '12', name: 'Khác', icon: '💵', type: 'income', color: 'oklch(0.5 0.02 250)' },
]

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES]

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(dateString))
}

export function formatShortDate(dateString: string): string {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: 'short',
  }).format(new Date(dateString))
}
