import { Product, PricingConfig, PricedProduct } from "../types";

export const calculateProductPrice = (
  product: Product, 
  config: PricingConfig
): PricedProduct => {
  const divisor = config.markupDivisor === 0 ? 1 : config.markupDivisor;
  const calculatedBasePrice = product.costPrice / divisor;

  const finalCardPrice = product.manualPrice && product.manualPrice > 0 
    ? product.manualPrice 
    : calculatedBasePrice;

  const finalPixPrice = product.manualPixPrice && product.manualPixPrice > 0
    ? product.manualPixPrice
    : finalCardPrice * (1 - config.cashDiscount);

  return {
    ...product, // O segredo está aqui: o '...' espalha TODAS as propriedades (cca, warranty, etc.)
    cardPrice: Number(finalCardPrice.toFixed(2)),
    cashPrice: Number(finalPixPrice.toFixed(2)),
    autoCalculatedPrice: Number(calculatedBasePrice.toFixed(2)) 
  };
};