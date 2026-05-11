import { NextResponse } from "next/server"
import { getLivros } from "@/lib/data"

export async function GET() {
  try {
    const livros = getLivros()
    return NextResponse.json(livros)
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar livros" },
      { status: 500 }
    )
  }
}