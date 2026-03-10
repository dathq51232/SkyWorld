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
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, Transaction } from "@/lib/types"
import { cn } from "@/lib/utils"

interface AddTransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void
}

export function AddTransactionDialog({ open, onOpenChange, onAdd }: AddTransactionDialogProps) {
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!amount || !category || !description) return

    onAdd({
      type,
      amount: parseFloat(amount),
      category,
      description,
      date,
    })

    // Reset form
    setAmount('')
    setCategory('')
    setDescription('')
    setDate(new Date().toISOString().split('T')[0])
    onOpenChange(false)
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
                setCategory('')
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
                setCategory('')
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
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-lg p-3 text-xs transition-colors border",
                    category === cat.name
                      ? "border-primary bg-primary/10"
                      : "border-border bg-secondary hover:bg-secondary/80"
                  )}
                  onClick={() => setCategory(cat.name)}
                >
                  <span className="text-lg">{cat.icon}</span>
                  <span className="truncate w-full text-center">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              placeholder="Nhập mô tả giao dịch..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              required
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

          {/* Submit */}
          <Button type="submit" className="w-full">
            Thêm giao dịch
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
