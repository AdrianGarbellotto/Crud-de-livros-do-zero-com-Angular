import { NextResponse } from "next/server"
import { getLivroById, updateLivro, deleteLivro } from "@/lib/data"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const livro = getLivroById(Number(id))

  if (!livro) {
    return NextResponse.json(
      { error: "Livro nao encontrado" },
      { status: 404 }
    )
  }

  return NextResponse.json(livro)
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()

  if (!body.titulo || !body.autor || !body.ano || !body.preco) {
    return NextResponse.json(
      { error: "Todos os campos sao obrigatorios" },
      { status: 400 }
    )
  }

  const livro = updateLivro(Number(id), {
    titulo: body.titulo,
    autor: body.autor,
    ano: Number(body.ano),
    preco: Number(body.preco),
  })

  if (!livro) {
    return NextResponse.json(
      { error: "Livro nao encontrado" },
      { status: 404 }
    )
  }

  return NextResponse.json(livro)
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const deleted = deleteLivro(Number(id))

  if (!deleted) {
    return NextResponse.json(
      { error: "Livro nao encontrado" },
      { status: 404 }
    )
  }

  return NextResponse.json({ success: true })
}
