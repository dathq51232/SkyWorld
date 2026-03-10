import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive">
              <AlertCircle className="h-6 w-6 text-destructive-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">Có lỗi xảy ra</CardTitle>
          <CardDescription>
            Đã có lỗi trong quá trình xác thực. Vui lòng thử lại hoặc liên hệ hỗ trợ nếu vấn đề vẫn tiếp tục.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Button asChild className="w-full">
            <Link href="/auth/login">Thử đăng nhập lại</Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/">Về trang chủ</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
