import { PricedProduct } from "@/core/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Battery, Zap, CreditCard } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface ProductCardProps {
  product: PricedProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  // A economia agora é baseada nos valores finais que já passaram pela lógica de prioridade
  const savings = product.cardPrice - product.cashPrice;

  return (
    <Card className="group relative overflow-hidden bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]">
      {/* Badge de Economia */}
      {savings > 0 && (
        <div className="absolute top-0 right-0 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-bl-lg z-10">
          Economize {formatCurrency(savings)} no Pix
        </div>
      )}

      <CardHeader className="pb-2 pt-6 relative z-0">
        <div className="flex items-start justify-between">
          <div className="flex gap-3 items-center">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-100 transition-colors">
              <Battery className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-gray-900 leading-tight">
                {product.name}
              </CardTitle>
              <p className="text-sm text-gray-500 mt-0.5">Bateria Automotiva</p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-6">
        <div className="space-y-4 mt-4">
          {/* Preço PIX */}
          <div className="bg-green-50 p-4 rounded-xl border border-green-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <Zap className="h-12 w-12 text-green-600" fill="currentColor" />
            </div>
            <p className="text-sm text-green-700 font-medium flex items-center gap-1.5 mb-1">
              <Zap className="h-4 w-4" fill="currentColor" />À vista no Pix/Dinheiro
            </p>
            <div className="flex items-end gap-1">
              <span className="text-3xl font-extrabold text-green-700 tracking-tight leading-none">
                {formatCurrency(product.cashPrice)}
              </span>
            </div>
          </div>

          {/* Preço Cartão */}
          <div className="px-4 flex items-center justify-between py-2 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-gray-600">
              <CreditCard className="h-4 w-4" />
              <span className="text-sm font-medium">Cartão (até 12x)</span>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-gray-700">
                {formatCurrency(product.cardPrice)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}