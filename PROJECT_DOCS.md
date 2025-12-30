# 📘 Precificador de Baterias - Documentação Técnica

**Status Atual:** MVP Versão 1.0 (Core + Infra + Auth + PWA + Testes)
**Última Atualização:** 30/12/2025

## 1. Visão Geral
Sistema Web Progressivo (PWA) desenvolvido para precificação dinâmica de baterias automotivas. O sistema centraliza a regra de negócio (margem de lucro e taxas) e distribui os preços calculados em tempo real para os vendedores via mobile.

## 2. Dicionário de Dados e Variáveis (Front-end)

O Front-end recebe objetos já processados. É crucial entender o significado de cada campo para a exibição correta.

### Entidade: `PricedProduct` (O que a tela exibe)
| Campo | Tipo | Descrição | Exibição Sugerida |
| :--- | :--- | :--- | :--- |
| `id` | string | Identificador único do Firestore. | Oculto (key) |
| `name` | string | Nome da bateria. | Título do Card |
| `costPrice` | number | Preço de Custo (Pago ao fornecedor). | **OCULTO** na Home / Visível no Admin |
| `cardPrice` | number | Preço para venda no Cartão de Crédito. | Texto Cinza/Neutro (Secundário) |
| `cashPrice` | number | Preço para venda no Pix (Com desconto). | **Destaque** Verde/Grande (Principal) |

### Entidade: `PricingConfig` (Configuração Global)
| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `markupDivisor` | number | Fator de divisão. Ex: `0.7` representa margem bruta de ~30%. |
| `cashDiscount` | number | Percentual decimal. Ex: `0.05` representa 5%. |

## 3. Regras de Negócio (Core Domain)
A lógica é blindada por testes unitários (`src/core/domain/pricing.test.ts`).
1.  **Preço Base (Cartão)** = `Custo / Markup`
2.  **Preço Pix** = `Preço Base * (1 - Desconto)`

## 4. Arquitetura do Projeto

O projeto utiliza **Next.js (App Router)** com separação estrita de responsabilidades:

- **`src/core`**: Lógica pura e Tipagem (Independente de Framework).
- **`src/services`**: Comunicação com Firebase Firestore.
- **`src/context`**: Autenticação e Gestão de Estado Global.
- **`src/hooks`**: `usePricedProducts` (Ouve o banco em Realtime).

## 5. Estrutura de Telas e Rotas

1.  **Home (`/`)**: Pública. Exibe lista de produtos com busca. Mostra apenas preços finais.
2.  **Login (`/login`)**: Autenticação via Firebase (Email/Senha).
3.  **Admin (`/admin`)**: Privada (Route Guard).
    - Aba **Produtos**: Lista completa com Custo, botão de Excluir e Formulário de Adição.
    - Aba **Taxas**: Formulário para alterar Markup e Desconto Global.

## 6. Banco de Dados (Firestore)

### Coleção: `products`
```json
{
  "id": "auto-generated",
  "name": "Moura 60Ah",
  "costPrice": 300.00,
  "active": true
}

Coleção: settings (Doc ID: global_rates)
JSON

{
  "markupDivisor": 0.7,
  "cashDiscount": 0.05
}
7. Roadmap e Status
[x] Core: Cálculo validado com TDD (Jest).

[x] Infra: Conexão Realtime com Firestore.

[x] Segurança: Login e Proteção de Rotas.

[x] Mobile: PWA Instalável (Manifest + Service Worker).

[ ] UI/UX 2.0: Refatoração visual profissional (Próximo Passo).