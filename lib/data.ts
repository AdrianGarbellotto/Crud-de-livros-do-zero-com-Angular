import { Livro } from "@/types/livro"

// Simula um banco de dados em memoria
let livros: Livro[] = [
  {
    id: 1,
    titulo: "Dom Casmurro",
    autor: "Machado de Assis",
    ano: 1899,
    preco: 39.9,
  },
  {
    id: 2,
    titulo: "O Pequeno Principe",
    autor: "Antoine de Saint-Exupery",
    ano: 1943,
    preco: 29.9,
  },
  {
    id: 3,
    titulo: "Capitaes da Areia",
    autor: "Jorge Amado",
    ano: 1937,
    preco: 44.9,
  },
]

let nextId = 4

export function getLivros(): Livro[] {
  return livros
}

export function getLivroById(id: number): Livro | undefined {
  return livros.find((livro) => livro.id === id)
}

export function createLivro(livro: Omit<Livro, "id">): Livro {
  const newLivro = { ...livro, id: nextId++ }
  livros.push(newLivro)
  return newLivro
}

export function updateLivro(id: number, data: Omit<Livro, "id">): Livro | null {
  const index = livros.findIndex((livro) => livro.id === id)
  if (index === -1) return null
  livros[index] = { ...data, id }
  return livros[index]
}

export function deleteLivro(id: number): boolean {
  const index = livros.findIndex((livro) => livro.id === id)
  if (index === -1) return false
  livros.splice(index, 1)
  return true
}
