import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-react'

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Mail className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">Kiểm tra email của bạn</CardTitle>
          <CardDescription>
            Chúng tôi đã gửi link xác nhận đến email của bạn. Vui lòng kiểm tra hộp thư đến và nhấn vào link để kích hoạt tài khoản.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/auth/login">Quay lại đăng nhập</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
