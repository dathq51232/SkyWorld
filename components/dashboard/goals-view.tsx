"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Goal } from "@/lib/database.types"
import { Plus, Target, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { addGoal, deleteGoal, updateGoalAmount } from "@/app/actions"

interface GoalsViewProps {
  goals: Goal[]
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount)
}

const iconOptions = ['🏦', '✈️', '💻', '🏠', '🚗', '📚', '💍', '🎓', '💰', '🎁']

export function GoalsView({ goals: initialGoals }: GoalsViewProps) {
  const [goals, setGoals] = useState(initialGoals)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [addAmountDialog, setAddAmountDialog] = useState<string | null>(null)
  const [addAmount, setAddAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [newGoal, setNewGoal] = useState({
    name: '',
    target: '',
    deadline: '',
  })
  const router = useRouter()

  const handleAddGoal = async () => {
    if (!newGoal.name || !newGoal.target) return

    setLoading(true)
    const result = await addGoal({
      name: newGoal.name,
      target_amount: parseFloat(newGoal.target),
      deadline: newGoal.deadline || undefined,
    })

    if (result.success) {
      setNewGoal({ name: '', target: '', deadline: '' })
      setDialogOpen(false)
      router.refresh()
    }
    setLoading(false)
  }

  const handleDeleteGoal = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa mục tiêu này?')) return
    
    const result = await deleteGoal(id)
    if (result.success) {
      setGoals(goals.filter(g => g.id !== id))
    }
  }

  const handleAddAmount = async (goalId: string) => {
    if (!addAmount) return
    
    setLoading(true)
    const result = await updateGoalAmount(goalId, parseFloat(addAmount))
    if (result.success) {
      setAddAmountDialog(null)
      setAddAmount('')
      router.refresh()
    }
    setLoading(false)
  }

  const totalTarget = goals.reduce((sum, g) => sum + Number(g.target_amount), 0)
  const totalCurrent = goals.reduce((sum, g) => sum + Number(g.current_amount), 0)
  const overallProgress = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Tiến độ tổng thể
          </CardTitle>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Thêm mục tiêu
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm mục tiêu mới</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="goal-name">Tên mục tiêu</Label>
                  <Input
                    id="goal-name"
                    placeholder="VD: Mua nhà, Du lịch..."
                    value={newGoal.name}
                    onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goal-target">Số tiền mục tiêu (VND)</Label>
                  <Input
                    id="goal-target"
                    type="number"
                    placeholder="0"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goal-deadline">Hạn hoàn thành (tùy chọn)</Label>
                  <Input
                    id="goal-deadline"
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  />
                </div>
                <Button onClick={handleAddGoal} className="w-full" disabled={loading}>
                  {loading ? 'Đang thêm...' : 'Thêm mục tiêu'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Đã tiết kiệm</span>
              <span className="font-semibold">{formatCurrency(totalCurrent)} / {formatCurrency(totalTarget)}</span>
            </div>
            <Progress value={overallProgress} className="h-3" />
            <p className="text-sm text-muted-foreground text-center">
              {overallProgress.toFixed(1)}% hoàn thành
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Goals List */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {goals.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center">
              <Target className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">
                Chưa có mục tiêu nào. Hãy thêm mục tiêu đầu tiên của bạn!
              </p>
            </CardContent>
          </Card>
        ) : (
          goals.map((goal) => {
            const progress = (Number(goal.current_amount) / Number(goal.target_amount)) * 100
            const remaining = Number(goal.target_amount) - Number(goal.current_amount)
            const isComplete = goal.status === 'completed' || progress >= 100

            return (
              <Card key={goal.id} className={isComplete ? 'border-success/50 bg-success/5' : ''}>
                <CardContent className="p-6 relative group">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteGoal(goal.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">💰</span>
                    <div>
                      <h3 className="font-semibold">{goal.name}</h3>
                      {goal.deadline && (
                        <p className="text-xs text-muted-foreground">
                          Hạn: {new Date(goal.deadline).toLocaleDateString('vi-VN')}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Tiến độ</span>
                      <span className={isComplete ? 'text-success font-medium' : ''}>
                        {progress.toFixed(0)}%
                      </span>
                    </div>
                    <Progress 
                      value={Math.min(progress, 100)} 
                      className={`h-2 ${isComplete ? '[&>div]:bg-success' : ''}`}
                    />
                    <div className="flex justify-between text-sm">
                      <span className="text-success font-medium">
                        {formatCurrency(Number(goal.current_amount))}
                      </span>
                      <span className="text-muted-foreground">
                        / {formatCurrency(Number(goal.target_amount))}
                      </span>
                    </div>
                    {!isComplete && (
                      <>
                        <p className="text-xs text-muted-foreground text-center">
                          Còn thiếu {formatCurrency(remaining)}
                        </p>
                        <Dialog open={addAmountDialog === goal.id} onOpenChange={(open) => !open && setAddAmountDialog(null)}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full"
                              onClick={() => setAddAmountDialog(goal.id)}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Thêm tiền
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Thêm tiền vào "{goal.name}"</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                              <div className="space-y-2">
                                <Label htmlFor="add-amount">Số tiền (VND)</Label>
                                <Input
                                  id="add-amount"
                                  type="number"
                                  placeholder="0"
                                  value={addAmount}
                                  onChange={(e) => setAddAmount(e.target.value)}
                                />
                              </div>
                              <Button 
                                onClick={() => handleAddAmount(goal.id)} 
                                className="w-full"
                                disabled={loading}
                              >
                                {loading ? 'Đang thêm...' : 'Xác nhận'}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </>
                    )}
                    {isComplete && (
                      <p className="text-xs text-success text-center font-medium">
                        Hoàn thành!
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
