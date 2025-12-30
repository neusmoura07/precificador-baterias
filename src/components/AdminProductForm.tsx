import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AdminProductFormProps {
  onSubmit: (name: string, costPrice: number) => void;
}

const AdminProductForm = ({ onSubmit }: AdminProductFormProps) => {
  const [name, setName] = useState("");
  const [costPrice, setCostPrice] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && costPrice) {
      onSubmit(name.trim(), parseFloat(costPrice));
      setName("");
      setCostPrice("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card-elevated p-5 space-y-4">
      <h3 className="font-semibold text-foreground flex items-center gap-2">
        <Plus className="h-5 w-5 text-primary" />
        Adicionar Produto
      </h3>
      
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="product-name">Nome do Produto</Label>
          <Input
            id="product-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Bateria 60Ah Moura"
            className="h-12"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="cost-price">Preço de Custo (R$)</Label>
          <Input
            id="cost-price"
            type="number"
            step="0.01"
            min="0"
            value={costPrice}
            onChange={(e) => setCostPrice(e.target.value)}
            placeholder="0,00"
            className="h-12"
            required
          />
        </div>
      </div>
      
      <Button type="submit" className="w-full h-12 text-base font-semibold">
        <Plus className="h-5 w-5 mr-2" />
        Adicionar Produto
      </Button>
    </form>
  );
};

export default AdminProductForm;
