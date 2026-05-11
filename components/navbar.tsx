"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BookOpen, Plus } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center justify-between gap-4 px-8 py-4 bg-primary text-primary-foreground">
      <div className="flex items-center gap-3">
        <BookOpen className="size-6" />
        <div>
          <h1 className="text-xl font-bold">Biblioteca</h1>
          <span className="text-sm text-primary-foreground/70">CRUD de Livros</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/"
          className={cn(
            "px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-primary-foreground/10",
            pathname === "/" && "bg-primary-foreground/20"
          )}
        >
          Livros
        </Link>
        <Link
          href="/novo"
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-primary-foreground/10",
            pathname === "/novo" && "bg-primary-foreground/20"
          )}
        >
          <Plus className="size-4" />
          Novo Livro
        </Link>
      </div>
    </nav>
  )
}
