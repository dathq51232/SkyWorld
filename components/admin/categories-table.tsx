'use client'

import { useState } from 'react'
import { Category } from '@/lib/database.types'
import { addCategory, deleteCategory } from '@/app/admin/actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react'

type CategoriesTableProps = {
  categories: Category[]
}

export function CategoriesTable({ categories }: CategoriesTableProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const incomeCategories = categories.filter((c) => c.type === 'income')
  const expenseCategories = categories.filter((c) => c.type === 'expense')

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    await addCategory(name, type)
    setName('')
    setLoading(false)
    setOpen(false)
  }

  const handleDelete = async (categoryId: string) => {
    if (!confirm('Bạn có chắc muốn xóa danh mục này?')) return
    setDeleting(categoryId)
    await deleteCategory(categoryId)
    setDeleting(null)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Quản lý danh mục</CardTitle>
            <CardDescription>Thêm, sửa hoặc xóa các danh mục thu chi</CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Thêm danh mục
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm danh mục mới</DialogTitle>
                <DialogDescription>
                  Tạo danh mục thu nhập hoặc chi tiêu mới
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddCategory}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="name">Tên danh mục</FieldLabel>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nhập tên danh mục"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="type">Loại</FieldLabel>
                    <Select value={type} onValueChange={(v) => setType(v as 'income' | 'expense')}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="income">Thu nhập</SelectItem>
                        <SelectItem value="expense">Chi tiêu</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Đang thêm...' : 'Thêm danh mục'}
                  </Button>
                </FieldGroup>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Income Categories */}
          <div>
            <h3 className="flex items-center gap-2 font-semibold mb-3 text-success">
              <TrendingUp className="h-4 w-4" />
              Thu nhập ({incomeCategories.length})
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incomeCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {category.name}
                        {category.is_default && (
                          <Badge variant="secondary" className="text-xs">
                            Mặc định
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(category.id)}
                        disabled={deleting === category.id}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {incomeCategories.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground">
                      Chưa có danh mục
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Expense Categories */}
          <div>
            <h3 className="flex items-center gap-2 font-semibold mb-3 text-destructive">
              <TrendingDown className="h-4 w-4" />
              Chi tiêu ({expenseCategories.length})
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenseCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {category.name}
                        {category.is_default && (
                          <Badge variant="secondary" className="text-xs">
                            Mặc định
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(category.id)}
                        disabled={deleting === category.id}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {expenseCategories.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground">
                      Chưa có danh mục
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
