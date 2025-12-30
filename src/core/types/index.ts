export interface Product {
  id: string;
  name: string;
  costPrice: number;
  active: boolean;
}

export interface PricingConfig {
  markupDivisor: number; // Ex: 0.7
  cashDiscount: number;  // Ex: 0.05 (5%)
}

// Interface para o objeto já calculado que a UI vai exibir
export interface PricedProduct extends Product {
  cardPrice: number;
  cashPrice: number;
}