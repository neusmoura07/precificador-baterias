import { PricedProduct } from "@/core/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Battery, Zap, CreditCard, ShieldCheck, Activity } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface ProductCardProps {
  product: PricedProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const savings = product.cardPrice - product.cashPrice;

  const getTechBadgeColor = (tech: string) => {
    switch (tech) {
      case "EFB": return "bg-orange-600";
      case "AGM": return "bg-purple-600";
      case "Chumbo-Ácido": return "bg-slate-700";
      case "Estacionária": return "bg-teal-600";
      default: return "bg-blue-600";
    }
  };

  return (
    <Card className="group relative overflow-hidden bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] text-left">
      {/* Badge de Economia */}
      {savings > 0 && (
        <div className="absolute top-0 right-0 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-bl-lg z-10">
          Economize {formatCurrency(savings)} no Pix
        </div>
      )}

      {/* NOVO: Área da Imagem do Produto */}
      <div className="relative h-48 w-full bg-gray-50 flex items-center justify-center overflow-hidden border-b group">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-110" 
          />
        ) : (
          <div className="p-6 bg-blue-50 text-blue-600 rounded-2xl">
            <Battery className="h-12 w-12" />
          </div>
        )}
      </div>

      <CardHeader className="pb-2 pt-4 relative z-0">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-lg font-bold text-gray-900 leading-tight">
            {product.name}
          </CardTitle>
          <div>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase text-white shadow-sm transition-colors ${getTechBadgeColor(product.technology)}`}>
              {product.technology || 'Selada'}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-6">
        <div className="grid grid-cols-2 gap-2 mt-2 mb-4">
          <div className="flex items-center gap-2 text-[11px] text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-100">
            <Zap className="h-3.5 w-3.5 text-blue-500" fill="currentColor" /> 
            <span>CCA: <strong className="text-gray-900">{product.cca || '--'}A</strong></span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-100">
            <Activity className="h-3.5 w-3.5 text-orange-500" /> 
            <span>C20: <strong className="text-gray-900">{product.ca || '--'}A</strong></span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-100">
            <ShieldCheck className="h-3.5 w-3.5 text-green-500" /> 
            <span>Garantia: <strong className="text-gray-900">{product.warranty || '12m'}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-100">
             <Activity className="h-3.5 w-3.5 text-amber-500" /> 
             <span>RA: <strong className="text-gray-900">{product.ri ? `${product.ri} mΩ` : '--'}</strong></span>
          </div>
        </div>

        <div className="space-y-4">
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