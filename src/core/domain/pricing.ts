import { Product, PricingConfig, PricedProduct } from "../types";

export const calculateProductPrice = (
  product: Product, 
  config: PricingConfig
): PricedProduct => {
  // Regra 1: Preço Base (Cartão) = Custo / Markup
  // Evitar divisão por zero
  const divisor = config.markupDivisor === 0 ? 1 : config.markupDivisor;
  const basePrice = product.costPrice / divisor;

  // Regra 2: Preço à Vista = Base * (1 - Desconto)
  const cashPrice = basePrice * (1 - config.cashDiscount);

  return {
    ...product,
    cardPrice: Number(basePrice.toFixed(2)), // Arredondamento seguro para UI
    cashPrice: Number(cashPrice.toFixed(2))
  };
};