import { useState } from "react";
import { Save, Info, Calculator, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PricingConfig } from "@/core/types";
import { useToast } from "@/hooks/use-toast";

interface PricingSettingsProps {
  config: PricingConfig;
  onSave: (config: PricingConfig) => void;
}

const PricingSettings = ({ config, onSave }: PricingSettingsProps) => {
  const [markupDivisor, setMarkupDivisor] = useState(config.markupDivisor.toString());
  const [cashDiscount, setCashDiscount] = useState((config.cashDiscount * 100).toString());
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      markupDivisor: parseFloat(markupDivisor),
      cashDiscount: parseFloat(cashDiscount) / 100,
    });
    toast({
      title: "Configurações salvas!",
      description: "As taxas foram atualizadas com sucesso.",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Card Explicativo */}
      <div className="card-elevated p-5 bg-primary/5 border-primary/20">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="text-sm text-foreground/80">
            <p className="font-medium text-foreground mb-2">Como funciona o cálculo:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li><strong>Preço Cartão</strong> = Custo ÷ Fator de Divisão</li>
              <li><strong>Preço Pix</strong> = Preço Cartão × (1 - Desconto)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Campos */}
      <div className="space-y-5">
        <div className="card-elevated p-5 space-y-3">
          <div className="flex items-center gap-2 text-foreground">
            <Calculator className="h-5 w-5 text-primary" />
            <Label htmlFor="markup" className="text-base font-semibold">
              Fator de Divisão (Markup)
            </Label>
          </div>
          <Input
            id="markup"
            type="number"
            step="0.01"
            min="0.01"
            max="1"
            value={markupDivisor}
            onChange={(e) => setMarkupDivisor(e.target.value)}
            className="h-14 text-lg font-medium"
            required
          />
          <p className="text-xs text-muted-foreground">
            Exemplo: 0.7 significa que o custo representa 70% do preço final
          </p>
        </div>

        <div className="card-elevated p-5 space-y-3">
          <div className="flex items-center gap-2 text-foreground">
            <Percent className="h-5 w-5 text-success" />
            <Label htmlFor="discount" className="text-base font-semibold">
              Desconto Pix (%)
            </Label>
          </div>
          <Input
            id="discount"
            type="number"
            step="0.1"
            min="0"
            max="100"
            value={cashDiscount}
            onChange={(e) => setCashDiscount(e.target.value)}
            className="h-14 text-lg font-medium"
            required
          />
          <p className="text-xs text-muted-foreground">
            Exemplo: 5 significa 5% de desconto no pagamento à vista
          </p>
        </div>
      </div>

      <Button type="submit" className="w-full h-14 text-lg font-semibold">
        <Save className="h-5 w-5 mr-2" />
        Salvar Taxas
      </Button>
    </form>
  );
};

export default PricingSettings;
