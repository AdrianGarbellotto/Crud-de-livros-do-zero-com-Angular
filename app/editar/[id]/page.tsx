import { Navbar } from "@/components/navbar"
import { LivroForm } from "@/components/livro-form"

interface EditarLivroProps {
  params: Promise<{ id: string }>
}

export default async function EditarLivro({ params }: EditarLivroProps) {
  const { id } = await params

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <LivroForm livroId={Number(id)} />
      </main>
    </div>
  )
}
