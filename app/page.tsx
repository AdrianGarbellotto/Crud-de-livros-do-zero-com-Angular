import { Navbar } from "@/components/navbar"
import { LivroList } from "@/components/livro-list"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <LivroList />
      </main>
    </div>
  )
}
