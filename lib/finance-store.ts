import { Transaction } from './types'

// Initial demo data
const initialTransactions: Transaction[] = [
  {
    id: '1',
    type: 'income',
    amount: 25000000,
    category: 'Lương',
    description: 'Lương tháng 3',
    date: '2026-03-01',
    createdAt: '2026-03-01T08:00:00Z',
  },
  {
    id: '2',
    type: 'expense',
    amount: 3500000,
    category: 'Ăn uống',
    description: 'Chi phí ăn uống trong tháng',
    date: '2026-03-02',
    createdAt: '2026-03-02T12:00:00Z',
  },
  {
    id: '3',
    type: 'expense',
    amount: 1500000,
    category: 'Di chuyển',
    description: 'Xăng xe và gửi xe',
    date: '2026-03-03',
    createdAt: '2026-03-03T09:00:00Z',
  },
  {
    id: '4',
    type: 'expense',
    amount: 5000000,
    category: 'Hóa đơn',
    description: 'Tiền thuê nhà',
    date: '2026-03-05',
    createdAt: '2026-03-05T10:00:00Z',
  },
  {
    id: '5',
    type: 'expense',
    amount: 2000000,
    category: 'Mua sắm',
    description: 'Quần áo mới',
    date: '2026-03-06',
    createdAt: '2026-03-06T14:00:00Z',
  },
  {
    id: '6',
    type: 'income',
    amount: 3000000,
    category: 'Thưởng',
    description: 'Thưởng dự án hoàn thành',
    date: '2026-03-08',
    createdAt: '2026-03-08T11:00:00Z',
  },
  {
    id: '7',
    type: 'expense',
    amount: 800000,
    category: 'Giải trí',
    description: 'Xem phim và cafe',
    date: '2026-03-09',
    createdAt: '2026-03-09T19:00:00Z',
  },
  {
    id: '8',
    type: 'expense',
    amount: 500000,
    category: 'Y tế',
    description: 'Khám sức khỏe',
    date: '2026-03-10',
    createdAt: '2026-03-10T08:30:00Z',
  },
]

// In-memory store for demo purposes
let transactions: Transaction[] = [...initialTransactions]

export function getTransactions(): Transaction[] {
  return [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export function addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>): Transaction {
  const newTransaction: Transaction = {
    ...transaction,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }
  transactions.push(newTransaction)
  return newTransaction
}

export function deleteTransaction(id: string): void {
  transactions = transactions.filter(t => t.id !== id)
}

export function getFinancialSummary() {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const balance = totalIncome - totalExpense
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0

  return {
    totalIncome,
    totalExpense,
    balance,
    savingsRate,
  }
}

export function getExpensesByCategory() {
  const expenses = transactions.filter(t => t.type === 'expense')
  const categoryMap: Record<string, number> = {}
  
  expenses.forEach(expense => {
    categoryMap[expense.category] = (categoryMap[expense.category] || 0) + expense.amount
  })

  return Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value,
  }))
}

export function getMonthlyData() {
  const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12']
  
  // Generate sample data for the year
  return months.map((month, index) => {
    const monthNum = index + 1
    const incomeTransactions = transactions.filter(t => {
      const date = new Date(t.date)
      return date.getMonth() + 1 === monthNum && t.type === 'income'
    })
    const expenseTransactions = transactions.filter(t => {
      const date = new Date(t.date)
      return date.getMonth() + 1 === monthNum && t.type === 'expense'
    })

    const income = incomeTransactions.reduce((sum, t) => sum + t.amount, 0)
    const expense = expenseTransactions.reduce((sum, t) => sum + t.amount, 0)

    // Add some sample data for previous months
    const baseIncome = monthNum <= 3 ? (monthNum === 3 ? income : 20000000 + Math.random() * 8000000) : 0
    const baseExpense = monthNum <= 3 ? (monthNum === 3 ? expense : 12000000 + Math.random() * 5000000) : 0

    return {
      name: month,
      income: Math.round(baseIncome),
      expense: Math.round(baseExpense),
    }
  })
}

export function getRecentTransactions(limit: number = 5): Transaction[] {
  return getTransactions().slice(0, limit)
}
