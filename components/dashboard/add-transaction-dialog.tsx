"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Category } from "@/lib/database.types"
import { cn } from "@/lib/utils"
import {
  Utensils,
  Car,
  ShoppingBag,
  Home,
  Gamepad2,
  HeartPulse,
  GraduationCap,
  Wallet,
  Gift,
  Banknote,
  TrendingUp,
  MoreHorizontal,
} from "lucide-react"

interface AddTransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (data: {
    amount: number
    type: 'income' | 'expense'
    category_id: string
    description?: string
    date: string
  }) => Promise<{ success: boolean; error?: string }>
  categories: Category[]
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'Ăn uống': Utensils,
  'Di chuyển': Car,
  'Mua sắm': ShoppingBag,
  'Nhà cửa': Home,
  'Giải trí': Gamepad2,
  'Sức khỏe': HeartPulse,
  'Giáo dục': GraduationCap,
  'Lương': Wallet,
  'Thưởng': Gift,
  'Đầu tư': TrendingUp,
  'Kinh doanh': Banknote,
}

export function AddTransactionDialog({ open, onOpenChange, onAdd, categories }: AddTransactionDialogProps) {
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const filteredCategories = categories.filter(c => c.type === type)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!amount || !categoryId) {
      setError('Vui lòng điền đầy đủ thông tin')
      return
    }

    setLoading(true)
    const result = await onAdd({
      type,
      amount: parseFloat(amount),
      category_id: categoryId,
      description: description || undefined,
      date,
    })

    if (result.success) {
      // Reset form
      setAmount('')
      setCategoryId('')
      setDescription('')
      setDate(new Date().toISOString().split('T')[0])
      onOpenChange(false)
    } else {
      setError(result.error || 'Có lỗi xảy ra')
    }
    setLoading(false)
  }

  const getIcon = (categoryName: string) => {
    const IconComponent = iconMap[categoryName] || MoreHorizontal
    return <IconComponent className="h-5 w-5" />
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Thêm giao dịch mới</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type Toggle */}
          <div className="flex rounded-lg bg-secondary p-1">
            <button
              type="button"
              className={cn(
                "flex-1 rounded-md py-2 text-sm font-medium transition-colors",
                type === 'expense' 
                  ? "bg-destructive text-destructive-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => {
                setType('expense')
                setCategoryId('')
              }}
            >
              Chi tiêu
            </button>
            <button
              type="button"
              className={cn(
                "flex-1 rounded-md py-2 text-sm font-medium transition-colors",
                type === 'income' 
                  ? "bg-success text-success-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => {
                setType('income')
                setCategoryId('')
              }}
            >
              Thu nhập
            </button>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Số tiền (VND)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-lg"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Danh mục</Label>
            <div className="grid grid-cols-4 gap-2">
              {filteredCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-lg p-3 text-xs transition-colors border",
                    categoryId === cat.id
                      ? "border-primary bg-primary/10"
                      : "border-border bg-secondary hover:bg-secondary/80"
                  )}
                  onClick={() => setCategoryId(cat.id)}
                >
                  {getIcon(cat.name)}
                  <span className="truncate w-full text-center">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả (tùy chọn)</Label>
            <Textarea
              id="description"
              placeholder="Nhập mô tả giao dịch..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Ngày</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          {/* Submit */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Đang thêm...' : 'Thêm giao dịch'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
