# Precificador de Baterias Automotivas 🔋

Aplicativo Web progressivo (PWA) desenvolvido para substituir planilhas de precificação, oferecendo cálculo dinâmico de preços baseado em margem de lucro e custo, com sincronização em tempo real entre dispositivos.

## 🏗 Arquitetura e Decisões de Design

Este projeto segue princípios de **Clean Architecture** e **Separation of Concerns (SoC)** para garantir escalabilidade e testabilidade.

### Estrutura de Pastas (`src/`)

A aplicação não segue apenas o padrão do framework, mas separa a lógica de negócio da infraestrutura:

- **`app/`**: Camada de Apresentação (UI). Contém apenas componentes React, Páginas e Layouts. Responsável por *exibir* dados, não processá-los.
- **`core/`**: O "Coração" do sistema.
  - `domain/`: Contém a **Lógica de Negócio Pura**. Funções TypeScript que calculam preços. Elas não sabem que o React ou o Firebase existem. Isso facilita Testes Unitários (TDD).
  - `types/`: Contratos e Interfaces (TypeScript). Evitamos `any` a todo custo.
- **`services/`**: Camada de Infraestrutura/Gateway. Responsável por buscar dados externos (Firebase Firestore). Se trocarmos o banco de dados no futuro, apenas esta pasta muda.
- **`lib/`**: Configurações de bibliotecas de terceiros (inicialização do Firebase).

### 🧠 Regras de Negócio (Core Domain)

O sistema não armazena o preço final. Ele armazena o **Custo** e calcula o preço final em tempo de execução ("on the fly") baseado em variáveis globais.

**Fórmula de Precificação:**
1. **Preço Base (Cartão)** = `Custo do Produto` / `Markup Divisor` (Ex: 0.7 para 30%)
2. **Preço à Vista** = `Preço Base` * (1 - `Desconto à Vista`)

Isso permite que a alteração de uma única taxa (ex: aumento de imposto) recalcule instantaneamente o preço de 1.000 produtos.

## 🛠 Tecnologias

- **Framework**: Next.js 14+ (App Router)
- **Linguagem**: TypeScript (Strict Mode)
- **Estilização**: Tailwind CSS (Mobile-First)
- **Banco de Dados**: Firebase Firestore (NoSQL)
- **State/Data**: React Hooks Customizados

## 🚀 Configuração

1. Clone o repositório.
2. Crie um arquivo `.env.local` na raiz com as credenciais do Firebase (veja `.env.example`).
3. Instale as dependências: `npm install`.
4. Rode o servidor: `npm run dev`.