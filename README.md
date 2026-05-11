# CRUD de Livros - Respostas das Questoes

## Questoes do Exercicio

### 1. Qual e a responsabilidade do componente?

O **componente** e responsavel pela interface do usuario (UI) e pela interacao com o usuario. Ele:

- Exibe os dados na tela (HTML/JSX)
- Captura eventos do usuario (cliques, submissoes de formulario, digitacao)
- Gerencia o estado local da tela (loading, erros, dados temporarios)
- Chama os services para buscar ou enviar dados
- Atualiza a tela quando os dados mudam

No nosso projeto:
- `LivroList` exibe a tabela de livros e os botoes de acao
- `LivroForm` exibe o formulario e gerencia a validacao visual
- `Navbar` exibe a barra de navegacao

---

### 2. Qual e a responsabilidade do service?

O **service** e responsavel pela comunicacao com a API (backend). Ele:

- Faz as requisicoes HTTP (GET, POST, PUT, DELETE)
- Encapsula a logica de acesso a dados
- Centraliza a URL da API em um unico lugar
- Pode ser reutilizado por varios componentes
- Mantem a separacao de responsabilidades (componente nao faz requisicoes diretamente)

No nosso projeto, as funcoes de service estao em `/lib/data.ts` e nas API routes `/app/api/livros/`.

---

### 3. Para que serve o model?

O **model** (ou interface/type) serve para:

- Definir a estrutura dos dados (quais campos existem e seus tipos)
- Garantir seguranca de tipos (TypeScript avisa se usar campo errado)
- Documentar o formato dos dados esperados
- Facilitar o autocomplete no editor de codigo
- Padronizar os dados entre frontend e backend

No nosso projeto, o model `Livro` define:
```typescript
interface Livro {
  id?: number;
  titulo: string;
  autor: string;
  ano: number;
  preco: number;
}
```

---

### 4. Por que o campo id e opcional?

O campo `id` e marcado como opcional (`id?: number`) porque:

- **No cadastro**: quando criamos um novo livro, nao sabemos qual sera o ID. O backend (API) e responsavel por gerar e retornar o ID automaticamente.
- **Na edicao/exclusao**: o ID ja existe e e obrigatorio para identificar qual livro queremos modificar.

O `?` indica que o campo pode ou nao estar presente, dependendo do momento do ciclo de vida do dado.

---

### 5. Qual metodo HTTP lista dados?

O metodo **GET** e usado para listar/buscar dados.

```
GET /api/livros        -> Lista todos os livros
GET /api/livros/1      -> Busca o livro com ID 1
```

Caracteristicas do GET:
- Apenas le dados, nao modifica nada
- Os parametros vao na URL
- E considerado um metodo "seguro" e "idempotente"

---

### 6. Qual metodo HTTP cadastra dados?

O metodo **POST** e usado para cadastrar/criar novos dados.

```
POST /api/livros
Body: { "titulo": "Novo Livro", "autor": "Autor", "ano": 2024, "preco": 49.90 }
```

Caracteristicas do POST:
- Cria um novo recurso no servidor
- Os dados vao no corpo (body) da requisicao
- Retorna o recurso criado com o ID gerado

---

### 7. Qual metodo HTTP atualiza dados?

O metodo **PUT** e usado para atualizar dados existentes.

```
PUT /api/livros/1
Body: { "titulo": "Titulo Atualizado", "autor": "Autor", "ano": 2024, "preco": 59.90 }
```

Caracteristicas do PUT:
- Atualiza um recurso existente
- O ID do recurso vai na URL
- Os novos dados vao no corpo da requisicao
- Substitui completamente o recurso

---

### 8. Qual metodo HTTP exclui dados?

O metodo **DELETE** e usado para excluir dados.

```
DELETE /api/livros/1   -> Exclui o livro com ID 1
```

Caracteristicas do DELETE:
- Remove um recurso do servidor
- O ID do recurso vai na URL
- Geralmente nao tem corpo na requisicao
- E uma operacao irreversivel

---

### 9. Para que serve o router-outlet?

O **router-outlet** (no Angular) ou o sistema de rotas (no Next.js) serve para:

- Definir onde o conteudo da rota atual sera renderizado
- Permitir navegacao entre diferentes paginas/componentes
- Manter partes fixas da tela (como navbar) enquanto troca o conteudo principal
- Passar parametros pela URL (como o ID na rota de edicao)

No Next.js, isso e feito automaticamente pelo sistema de pastas do App Router:
- `/app/page.tsx` -> rota `/`
- `/app/novo/page.tsx` -> rota `/novo`
- `/app/editar/[id]/page.tsx` -> rota `/editar/:id`

---

### 10. Por que precisamos usar .subscribe() (ou equivalente)?

No Angular, usamos `.subscribe()` porque as requisicoes HTTP retornam **Observables** (operacoes assincronas). No React/Next.js, usamos **async/await** ou **hooks como SWR/useEffect** para o mesmo proposito.

Razoes para usar programacao assincrona:
- Requisicoes HTTP levam tempo (rede, servidor processando)
- O codigo nao pode "travar" esperando a resposta
- Precisamos definir o que fazer quando a resposta chegar (sucesso ou erro)
- Permite atualizar a UI quando os dados estiverem prontos

Exemplo em Next.js (nosso projeto):
```typescript
const response = await fetch('/api/livros');
const livros = await response.json();
setLivros(livros);
```

---

## Resumo dos Metodos HTTP (CRUD)

| Operacao | Metodo HTTP | Exemplo               | Descricao           |
|----------|-------------|----------------------|---------------------|
| Create   | POST        | POST /api/livros     | Cadastrar novo livro |
| Read     | GET         | GET /api/livros      | Listar livros       |
| Update   | PUT         | PUT /api/livros/1    | Atualizar livro     |
| Delete   | DELETE      | DELETE /api/livros/1 | Excluir livro       |

---

## Estrutura do Projeto (Next.js)

```
/app
  /api
    /livros
      route.ts          # GET (listar) e POST (criar)
      /[id]
        route.ts        # GET (buscar), PUT (atualizar), DELETE (excluir)
  /editar
    /[id]
      page.tsx          # Pagina de edicao
  /novo
    page.tsx            # Pagina de cadastro
  page.tsx              # Pagina principal (listagem)
  layout.tsx            # Layout com navbar
  globals.css           # Estilos globais

/components
  navbar.tsx            # Componente de navegacao
  livro-list.tsx        # Componente de listagem
  livro-form.tsx        # Componente de formulario

/lib
  data.ts               # Simulacao de banco de dados

/types
  livro.ts              # Model/Interface do livro
```
