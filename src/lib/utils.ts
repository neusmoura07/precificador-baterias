import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Função usada pelo Shadcn/Lovable para juntar classes CSS
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// NOVA FUNÇÃO: Formata números para Dinheiro Brasileiro (R$)
export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}