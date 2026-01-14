import { Product, PricingConfig, PricedProduct } from "../types";

export const calculateProductPrice = (
  product: Product, 
  config: PricingConfig
): PricedProduct => {
  const divisor = config.markupDivisor === 0 ? 1 : config.markupDivisor;
  
  // Cálculo automático original do cartão
  const calculatedBasePrice = product.costPrice / divisor;
  
  // Regra do Cartão: Manual > Automático
  const finalCardPrice = product.manualPrice && product.manualPrice > 0 
    ? product.manualPrice 
    : calculatedBasePrice;

  // --- NOVA REGRA DO PIX ---
  // Prioridade: 1. Pix Manual | 2. Desconto automático sobre o preço de cartão final
  const finalPixPrice = product.manualPixPrice && product.manualPixPrice > 0
    ? product.manualPixPrice
    : finalCardPrice * (1 - config.cashDiscount);

  return {
    ...product,
    cardPrice: Number(finalCardPrice.toFixed(2)),
    cashPrice: Number(finalPixPrice.toFixed(2)), // Agora retorna o manual se existir
    autoCalculatedPrice: Number(calculatedBasePrice.toFixed(2)) 
  };
};