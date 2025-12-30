import { Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/core/types";

interface AdminProductListProps {
  products: Product[];
  onDelete: (id: string) => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const AdminProductList = ({ products, onDelete }: AdminProductListProps) => {
  if (products.length === 0) {
    return (
      <div className="card-elevated p-8 text-center">
        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">Nenhum produto cadastrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {products.map((product, index) => (
        <div
          key={product.id}
          className="card-elevated p-4 flex items-center justify-between animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex-1 min-w-0 mr-4">
            <h4 className="font-semibold text-foreground truncate">
              {product.name}
            </h4>
            <p className="text-sm text-muted-foreground">
              Custo: <span className="font-medium">{formatCurrency(product.costPrice)}</span>
            </p>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(product.id)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default AdminProductList;
