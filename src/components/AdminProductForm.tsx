import { useState, useEffect } from "react";
import { Plus, Save, X, Calculator, Zap, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Product } from "@/core/types";
import { usePricedProducts } from "@/hooks/usePricedProducts";

interface AdminProductFormProps {
  onSubmit: (data: { name: string; costPrice: number; manualPrice?: number; manualPixPrice?: number }) => void;
  productToEdit?: Product | null;
  onCancelEdit?: () => void;
}

const AdminProductForm = ({ onSubmit, productToEdit, onCancelEdit }: AdminProductFormProps) => {
  const [name, setName] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [manualPrice, setManualPrice] = useState("");
  const [manualPixPrice, setManualPixPrice] = useState("");
  
  const { config } = usePricedProducts();

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setCostPrice(productToEdit.costPrice.toString());
      setManualPrice(productToEdit.manualPrice?.toString() || "");
      setManualPixPrice(productToEdit.manualPixPrice?.toString() || "");
    } else {
      setName("");
      setCostPrice("");
      setManualPrice("");
      setManualPixPrice("");
    }
  }, [productToEdit]);

  // Lógica de cálculo sugerido em tempo real
  const simulatedCardPrice = (() => {
    const cost = parseFloat(costPrice);
    if (isNaN(cost) || !config) return 0;
    const divisor = config.markupDivisor === 0 ? 1 : config.markupDivisor;
    return cost / divisor;
  })();

  const simulatedPixPrice = (() => {
    // O Pix sugerido usa o preço de cartão (manual se existir, senão o sugerido)
    const base = manualPrice ? parseFloat(manualPrice) : simulatedCardPrice;
    if (isNaN(base) || !config) return 0;
    return base * (1 - (config.cashDiscount || 0));
  })();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && costPrice) {
      onSubmit({
        name: name.trim(),
        costPrice: parseFloat(costPrice),
        manualPrice: manualPrice ? parseFloat(manualPrice) : undefined,
        manualPixPrice: manualPixPrice ? parseFloat(manualPixPrice) : undefined
      });
      
      if (!productToEdit) {
        setName("");
        setCostPrice("");
        setManualPrice("");
        setManualPixPrice("");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border p-5 rounded-xl space-y-4 shadow-sm">
      <div className="flex justify-between items-center border-b pb-3 mb-2">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          {productToEdit ? <Save className="h-5 w-5 text-blue-500" /> : <Plus className="h-5 w-5 text-primary" />}
          {productToEdit ? "Editar Bateria" : "Cadastrar Nova Bateria"}
        </h3>
        {productToEdit && (
          <Button variant="ghost" size="sm" onClick={onCancelEdit} type="button">
            <X className="h-4 w-4 mr-1" /> Cancelar
          </Button>
        )}
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="product-name">Nome comercial</Label>
          <Input id="product-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Moura 60Ah" className="h-12" required />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="cost-price">Preço de Custo (R$)</Label>
          <Input id="cost-price" type="number" step="0.01" value={costPrice} onChange={(e) => setCostPrice(e.target.value)} placeholder="0,00" className="h-12" required />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* AJUSTE MANUAL - CARTÃO */}
        <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100 space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="manual-price" className="flex items-center gap-2 text-blue-900 font-bold text-xs uppercase">
              <Calculator className="h-4 w-4" /> Venda Final (Cartão)
            </Label>
            {/* Valor do cálculo exibido acima do input para consulta rápida */}
            {simulatedCardPrice > 0 && (
              <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                Sugerido: R$ {simulatedCardPrice.toFixed(2)}
              </span>
            )}
          </div>
          <Input 
            id="manual-price" 
            type="number" 
            step="0.01" 
            value={manualPrice} 
            onChange={(e) => setManualPrice(e.target.value)} 
            // Placeholder com o valor sugerido
            placeholder={simulatedCardPrice > 0 ? `R$ ${simulatedCardPrice.toFixed(2)}` : "0,00"}
            className="h-12 bg-background border-blue-200 focus:ring-blue-500"
          />
        </div>

        {/* AJUSTE MANUAL - PIX */}
        <div className="p-4 bg-green-50/50 rounded-lg border border-green-100 space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="manual-pix" className="flex items-center gap-2 text-green-900 font-bold text-xs uppercase">
              <Zap className="h-4 w-4" /> Venda Final (Pix)
            </Label>
            {/* Valor do cálculo exibido acima do input para consulta rápida */}
            {simulatedPixPrice > 0 && (
              <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                Sugerido: R$ {simulatedPixPrice.toFixed(2)}
              </span>
            )}
          </div>
          <Input 
            id="manual-pix" 
            type="number" 
            step="0.01" 
            value={manualPixPrice} 
            onChange={(e) => setManualPixPrice(e.target.value)} 
            // Placeholder com o valor sugerido
            placeholder={simulatedPixPrice > 0 ? `R$ ${simulatedPixPrice.toFixed(2)}` : "0,00"}
            className="h-12 bg-background border-green-200 focus:ring-green-500"
          />
        </div>
      </div>
      
      <Button type="submit" className={`w-full h-12 text-base font-semibold ${productToEdit ? "bg-blue-600 hover:bg-blue-700" : ""}`}>
        {productToEdit ? "Salvar Alterações" : "Cadastrar Bateria"}
      </Button>
    </form>
  );
};

export default AdminProductForm;