"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Livro } from "@/types/livro"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Pencil, Trash2, Plus, AlertCircle, Loader2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"

// Tipo para as colunas ordenáveis
type ColunaOrdenavel = "id" | "titulo" | "autor" | "ano" | "preco"

// Tipo para a direcao da ordenacao
type DirecaoOrdenacao = "asc" | "desc"

// Interface para o estado de ordenacao
interface EstadoOrdenacao {
  coluna: ColunaOrdenavel
  direcao: DirecaoOrdenacao
}

export function LivroList() {
  const [livros, setLivros] = useState<Livro[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")
  const [ordenacao, setOrdenacao] = useState<EstadoOrdenacao>({
    coluna: "id",
    direcao: "asc",
  })

  // Funcao para carregar livros da API
  async function carregarLivros() {
    setCarregando(true)
    setErro("")

    try {
      const response = await fetch("/api/livros")
      if (!response.ok) throw new Error("Erro ao carregar livros")
      const dados = await response.json()
      setLivros(dados)
    } catch {
      setErro("Erro ao carregar livros. Tente novamente.")
    } finally {
      setCarregando(false)
    }
  }

  // Funcao para excluir um livro
  async function excluirLivro(id: number | undefined) {
    if (!id) return

    const confirmou = window.confirm("Deseja realmente excluir este livro?")
    if (!confirmou) return

    try {
      const response = await fetch(`/api/livros/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Erro ao excluir livro")

      carregarLivros()
    } catch {
      setErro("Erro ao excluir livro. Tente novamente.")
    }
  }

  // Funcao para alternar a ordenacao de uma coluna
  function alternarOrdenacao(coluna: ColunaOrdenavel) {
    setOrdenacao((atual) => {
      if (atual.coluna === coluna) {
        // Se ja esta ordenando por esta coluna, inverte a direcao
        return {
          coluna,
          direcao: atual.direcao === "asc" ? "desc" : "asc",
        }
      }
      // Se e uma nova coluna, ordena ascendente
      return { coluna, direcao: "asc" }
    })
  }

  // Funcao para renderizar o icone de ordenacao
  function renderizarIconeOrdenacao(coluna: ColunaOrdenavel) {
    if (ordenacao.coluna !== coluna) {
      return <ArrowUpDown className="size-4 ml-1 opacity-50" />
    }
    if (ordenacao.direcao === "asc") {
      return <ArrowUp className="size-4 ml-1" />
    }
    return <ArrowDown className="size-4 ml-1" />
  }

  // Livros ordenados usando useMemo para performance
  const livrosOrdenados = useMemo(() => {
    const copia = [...livros]

    copia.sort((a, b) => {
      const { coluna, direcao } = ordenacao
      const multiplicador = direcao === "asc" ? 1 : -1

      const valorA = a[coluna]
      const valorB = b[coluna]

      // Comparacao para strings (titulo e autor)
      if (typeof valorA === "string" && typeof valorB === "string") {
        return valorA.localeCompare(valorB, "pt-BR") * multiplicador
      }

      // Comparacao para numeros (id, ano e preco)
      if (typeof valorA === "number" && typeof valorB === "number") {
        return (valorA - valorB) * multiplicador
      }

      return 0
    })

    return copia
  }, [livros, ordenacao])

  // Carrega os livros ao montar o componente
  useEffect(() => {
    carregarLivros()
  }, [])

  // Funcao para formatar preco em BRL
  function formatarPreco(preco: number) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(preco)
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <section className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Livros</h2>
          <p className="text-muted-foreground">Livros cadastrados na biblioteca.</p>
        </div>

        <Button asChild>
          <Link href="/novo">
            <Plus className="size-4" />
            Novo Livro
          </Link>
        </Button>
      </section>

      {erro && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="size-4" />
          <AlertDescription>{erro}</AlertDescription>
        </Alert>
      )}

      {carregando && (
        <div className="flex items-center justify-center gap-2 p-8 border rounded-lg bg-card">
          <Loader2 className="size-5 animate-spin" />
          <span>Carregando livros...</span>
        </div>
      )}

      {!carregando && livros.length === 0 && !erro && (
        <div className="p-8 text-center border rounded-lg bg-card">
          <p className="text-muted-foreground">Nenhum livro cadastrado.</p>
          <Button asChild className="mt-4">
            <Link href="/novo">Cadastrar primeiro livro</Link>
          </Button>
        </div>
      )}

      {!carregando && livros.length > 0 && (
        <div className="border rounded-lg bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">
                  <button
                    type="button"
                    onClick={() => alternarOrdenacao("id")}
                    className="flex items-center font-medium hover:text-foreground transition-colors"
                  >
                    ID
                    {renderizarIconeOrdenacao("id")}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    type="button"
                    onClick={() => alternarOrdenacao("titulo")}
                    className="flex items-center font-medium hover:text-foreground transition-colors"
                  >
                    Titulo
                    {renderizarIconeOrdenacao("titulo")}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    type="button"
                    onClick={() => alternarOrdenacao("autor")}
                    className="flex items-center font-medium hover:text-foreground transition-colors"
                  >
                    Autor
                    {renderizarIconeOrdenacao("autor")}
                  </button>
                </TableHead>
                <TableHead className="w-24">
                  <button
                    type="button"
                    onClick={() => alternarOrdenacao("ano")}
                    className="flex items-center font-medium hover:text-foreground transition-colors"
                  >
                    Ano
                    {renderizarIconeOrdenacao("ano")}
                  </button>
                </TableHead>
                <TableHead className="w-32">
                  <button
                    type="button"
                    onClick={() => alternarOrdenacao("preco")}
                    className="flex items-center font-medium hover:text-foreground transition-colors"
                  >
                    Preco
                    {renderizarIconeOrdenacao("preco")}
                  </button>
                </TableHead>
                <TableHead className="w-32 text-right">Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {livrosOrdenados.map((livro) => (
                <TableRow key={livro.id}>
                  <TableCell className="font-medium">{livro.id}</TableCell>
                  <TableCell>{livro.titulo}</TableCell>
                  <TableCell>{livro.autor}</TableCell>
                  <TableCell>{livro.ano}</TableCell>
                  <TableCell>{formatarPreco(livro.preco)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/editar/${livro.id}`}>
                          <Pencil className="size-4" />
                          <span className="sr-only">Editar</span>
                        </Link>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => excluirLivro(livro.id)}
                      >
                        <Trash2 className="size-4" />
                        <span className="sr-only">Excluir</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
