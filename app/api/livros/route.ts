import { NextResponse } from "next/server"
import { getLivros, createLivro } from "@/lib/data"

export async function GET() {
  const livros = getLivros()
  return NextResponse.json(livros)
}

export async function POST(request: Request) {
  const body = await request.json()

  if (!body.titulo || !body.autor || !body.ano || !body.preco) {
    return NextResponse.json(
      { error: "Todos os campos sao obrigatorios" },
      { status: 400 }
    )
  }

  const livro = createLivro({
    titulo: body.titulo,
    autor: body.autor,
    ano: Number(body.ano),
    preco: Number(body.preco),
  })

  return NextResponse.json(livro, { status: 201 })
}
