import { Navbar } from "@/components/navbar"
import { LivroForm } from "@/components/livro-form"

export default function NovoLivro() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <LivroForm />
      </main>
    </div>
  )
}
