import { calculateProductPrice } from "./pricing";
import { Product, PricingConfig } from "../types";

// Bloco de testes da Calculadora de Preços
describe("Lógica de Precificação (Core Domain)", () => {
  
  // Cenário de Teste 1: O caso padrão
  test("Deve calcular markup e desconto corretamente (Cenário Feliz)", () => {
    // 1. DADO (Setup)
    const product: Product = { 
      id: "1", name: "Bateria Teste", costPrice: 100, active: true 
    };
    
    const config: PricingConfig = { 
      markupDivisor: 0.5, // Se dividir por 0.5, o preço dobra (100% markup)
      cashDiscount: 0.1   // 10% de desconto
    };

    // 2. QUANDO (Ação)
    const result = calculateProductPrice(product, config);

    // 3. ENTÃO (Validação)
    // Preço Base: 100 / 0.5 = 200
    expect(result.cardPrice).toBe(200.00);
    
    // Preço Pix: 200 * 0.9 = 180
    expect(result.cashPrice).toBe(180.00);
  });

  // Cenário de Teste 2: Proteção contra números quebrados
  test("Deve arredondar casas decimais corretamente (Dinheiro Real)", () => {
    const product: Product = { 
      id: "2", name: "Bateria Quebrada", costPrice: 33.33, active: true 
    };
    
    // Divisor complexo
    const config: PricingConfig = { markupDivisor: 0.7, cashDiscount: 0.05 };

    const result = calculateProductPrice(product, config);

    // Valida se não está retornando 47.614285714...
    expect(result.cardPrice).toBe(47.61); 
  });

  // Cenário de Teste 3: Proteção contra Divisão por Zero (Crash do Sistema)
  test("Deve evitar crash se o markup for zero", () => {
    const product: Product = { 
      id: "3", name: "Bateria Perigosa", costPrice: 100, active: true 
    };
    
    const config: PricingConfig = { markupDivisor: 0, cashDiscount: 0 };

    const result = calculateProductPrice(product, config);

    // Se o divisor for 0, nossa lógica (que criamos antes) deve usar 1 para não explodir
    expect(result.cardPrice).toBe(100); 
  });
});