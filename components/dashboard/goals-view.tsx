"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatCurrency } from "@/lib/types"
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

interface Goal {
  id: string
  name: string
  target: number
  current: number
  deadline: string
  icon: string
}

const initialGoals: Goal[] = [
  {
    id: '1',
    name: 'Quỹ khẩn cấp',
    target: 50000000,
    current: 28000000,
    deadline: '2026-12-31',
    icon: '🏦',
  },
  {
    id: '2',
    name: 'Du lịch Nhật Bản',
    target: 30000000,
    current: 12000000,
    deadline: '2026-06-30',
    icon: '✈️',
  },
  {
    id: '3',
    name: 'Mua laptop mới',
    target: 25000000,
    current: 22000000,
    deadline: '2026-04-30',
    icon: '💻',
  },
]

const iconOptions = ['🏦', '✈️', '💻', '🏠', '🚗', '📚', '💍', '🎓', '💰', '🎁']

export function GoalsView() {
  const [goals, setGoals] = useState<Goal[]>(initialGoals)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newGoal, setNewGoal] = useState({
    name: '',
    target: '',
    current: '',
    deadline: '',
    icon: '💰',
  })

  const handleAddGoal = () => {
    if (!newGoal.name || !newGoal.target) return

    const goal: Goal = {
      id: Date.now().toString(),
      name: newGoal.name,
      target: parseFloat(newGoal.target),
      current: parseFloat(newGoal.current) || 0,
      deadline: newGoal.deadline || '',
      icon: newGoal.icon,
    }

    setGoals([...goals, goal])
    setNewGoal({ name: '', target: '', current: '', deadline: '', icon: '💰' })
    setDialogOpen(false)
  }

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id))
  }

  const totalTarget = goals.reduce((sum, g) => sum + g.target, 0)
  const totalCurrent = goals.reduce((sum, g) => sum + g.current, 0)
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
                  <Label>Icon</Label>
                  <div className="flex gap-2 flex-wrap">
                    {iconOptions.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        className={`p-2 text-xl rounded-lg border transition-colors ${
                          newGoal.icon === icon
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:bg-secondary'
                        }`}
                        onClick={() => setNewGoal({ ...newGoal, icon })}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
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
                  <Label htmlFor="goal-current">Số tiền hiện có (VND)</Label>
                  <Input
                    id="goal-current"
                    type="number"
                    placeholder="0"
                    value={newGoal.current}
                    onChange={(e) => setNewGoal({ ...newGoal, current: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goal-deadline">Hạn hoàn thành</Label>
                  <Input
                    id="goal-deadline"
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  />
                </div>
                <Button onClick={handleAddGoal} className="w-full">
                  Thêm mục tiêu
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
            const progress = (goal.current / goal.target) * 100
            const remaining = goal.target - goal.current
            const isComplete = progress >= 100

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
                    <span className="text-3xl">{goal.icon}</span>
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
                        {formatCurrency(goal.current)}
                      </span>
                      <span className="text-muted-foreground">
                        / {formatCurrency(goal.target)}
                      </span>
                    </div>
                    {!isComplete && (
                      <p className="text-xs text-muted-foreground text-center">
                        Còn thiếu {formatCurrency(remaining)}
                      </p>
                    )}
                    {isComplete && (
                      <p className="text-xs text-success text-center font-medium">
                        🎉 Hoàn thành!
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
