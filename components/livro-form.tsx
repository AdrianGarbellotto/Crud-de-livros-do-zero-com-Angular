"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Livro } from "@/types/livro"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"

interface LivroFormProps {
  livroId?: number
}

interface FormErrors {
  titulo?: string
  autor?: string
  ano?: string
  preco?: string
}

export function LivroForm({ livroId }: LivroFormProps) {
  const router = useRouter()
  const editando = !!livroId

  const [form, setForm] = useState({
    titulo: "",
    autor: "",
    ano: new Date().getFullYear().toString(),
    preco: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [carregando, setCarregando] = useState(false)
  const [carregandoDados, setCarregandoDados] = useState(editando)
  const [erro, setErro] = useState("")

  useEffect(() => {
    if (livroId) {
      carregarLivro(livroId)
    }
  }, [livroId])

  async function carregarLivro(id: number) {
    setCarregandoDados(true)
    setErro("")

    try {
      const response = await fetch(`/api/livros/${id}`)
      if (!response.ok) throw new Error("Livro nao encontrado")
      const livro: Livro = await response.json()

      setForm({
        titulo: livro.titulo,
        autor: livro.autor,
        ano: livro.ano.toString(),
        preco: livro.preco.toString(),
      })
    } catch {
      setErro("Livro nao encontrado.")
    } finally {
      setCarregandoDados(false)
    }
  }

  function validar(): boolean {
    const newErrors: FormErrors = {}

    if (!form.titulo || form.titulo.length < 3) {
      newErrors.titulo = "Titulo obrigatorio com minimo de 3 caracteres."
    }

    if (!form.autor || form.autor.length < 3) {
      newErrors.autor = "Autor obrigatorio com minimo de 3 caracteres."
    }

    const ano = Number(form.ano)
    if (!form.ano || isNaN(ano) || ano < 1) {
      newErrors.ano = "Ano obrigatorio e maior que zero."
    }

    const preco = Number(form.preco)
    if (!form.preco || isNaN(preco) || preco <= 0) {
      newErrors.preco = "Preco obrigatorio e maior que zero."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleBlur(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }))
    validar()
  }

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (touched[field]) {
      validar()
    }
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault()

    setTouched({ titulo: true, autor: true, ano: true, preco: true })

    if (!validar()) return

    setCarregando(true)
    setErro("")

    try {
      const url = editando ? `/api/livros/${livroId}` : "/api/livros"
      const method = editando ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: form.titulo,
          autor: form.autor,
          ano: Number(form.ano),
          preco: Number(form.preco),
        }),
      })

      if (!response.ok) throw new Error("Erro ao salvar livro")

      router.push("/")
      router.refresh()
    } catch {
      setErro("Erro ao salvar livro. Tente novamente.")
      setCarregando(false)
    }
  }

  if (carregandoDados) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="flex items-center justify-center gap-2 py-12">
            <Loader2 className="size-5 animate-spin" />
            <span>Carregando livro...</span>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>{editando ? "Editar Livro" : "Novo Livro"}</CardTitle>
          <CardDescription>
            {editando
              ? "Atualize as informacoes do livro."
              : "Preencha os dados para cadastrar um novo livro."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {erro && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="size-4" />
              <AlertDescription>{erro}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={salvar} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Titulo</Label>
              <Input
                id="titulo"
                type="text"
                placeholder="Ex: Dom Casmurro"
                value={form.titulo}
                onChange={(e) => handleChange("titulo", e.target.value)}
                onBlur={() => handleBlur("titulo")}
                aria-invalid={touched.titulo && !!errors.titulo}
              />
              {touched.titulo && errors.titulo && (
                <p className="text-sm text-destructive">{errors.titulo}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="autor">Autor</Label>
              <Input
                id="autor"
                type="text"
                placeholder="Ex: Machado de Assis"
                value={form.autor}
                onChange={(e) => handleChange("autor", e.target.value)}
                onBlur={() => handleBlur("autor")}
                aria-invalid={touched.autor && !!errors.autor}
              />
              {touched.autor && errors.autor && (
                <p className="text-sm text-destructive">{errors.autor}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ano">Ano</Label>
              <Input
                id="ano"
                type="number"
                placeholder="Ex: 1899"
                value={form.ano}
                onChange={(e) => handleChange("ano", e.target.value)}
                onBlur={() => handleBlur("ano")}
                aria-invalid={touched.ano && !!errors.ano}
              />
              {touched.ano && errors.ano && (
                <p className="text-sm text-destructive">{errors.ano}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="preco">Preco</Label>
              <Input
                id="preco"
                type="number"
                step="0.01"
                placeholder="Ex: 39.90"
                value={form.preco}
                onChange={(e) => handleChange("preco", e.target.value)}
                onBlur={() => handleBlur("preco")}
                aria-invalid={touched.preco && !!errors.preco}
              />
              {touched.preco && errors.preco && (
                <p className="text-sm text-destructive">{errors.preco}</p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={carregando}>
                {carregando && <Loader2 className="size-4 animate-spin" />}
                {carregando
                  ? "Salvando..."
                  : editando
                    ? "Atualizar"
                    : "Cadastrar"}
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push("/")}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
