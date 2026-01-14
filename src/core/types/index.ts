export interface Product {
  id: string;
  name: string;
  costPrice: number;
  active: boolean;
  manualPrice?: number;
  manualPixPrice?: number;
  warranty: string;      // Ex: "12 meses"
  cca: string;           // Ex: "450"
  technology: string;    // Ex: "Selada", "EFB", "AGM"
  rc?: string;           // Ex: "80min"
  ca?: string;           // Ex: "550"
  imageUrl?: string;
}

export interface PricingConfig {
  markupDivisor: number; // Ex: 0.7
  cashDiscount: number;  // Ex: 0.05 (5%)
}

// Interface para o objeto já calculado que a UI vai exibir
export interface PricedProduct extends Product {
  cardPrice: number;
  cashPrice: number;
  autoCalculatedPrice: number; // Preço calculado automaticamente, sem considerar manualPrice
}