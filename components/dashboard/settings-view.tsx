"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Bell, Shield, Palette, LogOut } from "lucide-react"
import { Profile } from "@/lib/database.types"
import { updateProfile } from "@/app/actions"
import { useRouter } from "next/navigation"

interface SettingsViewProps {
  profile?: Profile | null
  onSignOut: () => void
}

function getInitials(name: string | null) {
  if (!name) return 'U'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function SettingsView({ profile, onSignOut }: SettingsViewProps) {
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSave = async () => {
    setLoading(true)
    await updateProfile({ full_name: fullName })
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <User className="h-5 w-5" />
            Thông tin cá nhân
          </CardTitle>
          <CardDescription>
            Quản lý thông tin tài khoản của bạn
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile?.avatar_url || undefined} alt="User" />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {getInitials(profile?.full_name || null)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{profile?.full_name || 'Chưa đặt tên'}</p>
              <p className="text-sm text-muted-foreground">
                Tham gia: {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('vi-VN') : 'N/A'}
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Họ và tên</Label>
              <Input 
                id="name" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Đơn vị tiền tệ</Label>
              <Input id="currency" defaultValue="VND" disabled />
            </div>
          </div>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Thông báo
          </CardTitle>
          <CardDescription>
            Tùy chỉnh cách bạn nhận thông báo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Nhắc nhở chi tiêu</p>
              <p className="text-sm text-muted-foreground">
                Nhận thông báo khi vượt ngân sách
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Báo cáo tuần</p>
              <p className="text-sm text-muted-foreground">
                Nhận tổng kết chi tiêu hàng tuần
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Báo cáo tháng</p>
              <p className="text-sm text-muted-foreground">
                Nhận báo cáo tài chính hàng tháng
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Tiến độ mục tiêu</p>
              <p className="text-sm text-muted-foreground">
                Nhận thông báo khi đạt các cột mốc
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Appearance Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Giao diện
          </CardTitle>
          <CardDescription>
            Tùy chỉnh giao diện ứng dụng
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Chế độ tối</p>
              <p className="text-sm text-muted-foreground">
                Sử dụng giao diện tối
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Security Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Bảo mật
          </CardTitle>
          <CardDescription>
            Quản lý bảo mật tài khoản
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full justify-start">
            Đổi mật khẩu
          </Button>
          <Button 
            variant="destructive" 
            className="w-full justify-start gap-2"
            onClick={onSignOut}
          >
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
