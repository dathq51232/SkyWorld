"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Menu, Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Profile } from "@/lib/database.types"

interface HeaderProps {
  title: string
  onMenuClick: () => void
  onAddTransaction: () => void
  profile?: Profile | null
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

export function Header({ title, onMenuClick, onAddTransaction, profile }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <h1 className="text-xl font-semibold">{title}</h1>

      <div className="ml-auto flex items-center gap-3">
        {/* Search - hidden on mobile */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm giao dịch..."
            className="w-64 pl-9 bg-secondary border-0"
          />
        </div>

        {/* Add Transaction Button */}
        <Button onClick={onAddTransaction} className="gap-2">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Thêm giao dịch</span>
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
        </Button>

        {/* User Avatar */}
        <Avatar className="h-8 w-8">
          <AvatarImage src={profile?.avatar_url || undefined} alt="User" />
          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
            {getInitials(profile?.full_name || null)}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
