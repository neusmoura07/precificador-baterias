import { useState } from "react";
import { Trash2, Edit, Package, Calculator, Zap, AlertTriangle, Search, ArrowUpDown, Filter, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Product } from "@/core/types";
import { usePricedProducts } from "@/hooks/usePricedProducts";
import { formatCurrency } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AdminProductListProps {
  products: Product[];
  onDelete: (id: string) => void;
  onEdit: (product: Product) => void;
}

const AdminProductList = ({ products, onDelete, onEdit }: AdminProductListProps) => {
  const { config } = usePricedProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
  const [statusFilter, setStatusFilter] = useState("all");

  // --- Lógica de Filtragem e Ordenação ---
  const filteredAndSortedProducts = products
    .filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const isManual = !!((p.manualPrice && p.manualPrice > 0) || (p.manualPixPrice && p.manualPixPrice > 0));
      const matchesStatus = 
        statusFilter === "all" || 
        (statusFilter === "manual" && isManual) || 
        (statusFilter === "auto" && !isManual);
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const divisor = config?.markupDivisor || 1;
      const getFinalPrice = (p: Product) => (p.manualPrice && p.manualPrice > 0) ? p.manualPrice : (p.costPrice / divisor);
      
      const priceA = getFinalPrice(a);
      const priceB = getFinalPrice(b);

      switch (sortBy) {
        case "price-asc": return priceA - priceB;
        case "price-desc": return priceB - priceA;
        case "name-desc": return b.name.localeCompare(a.name);
        default: return a.name.localeCompare(b.name);
      }
    });

  if (products.length === 0) {
    return (
      <div className="bg-card border border-border p-8 text-center rounded-xl">
        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">Nenhum produto cadastrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Barra de Filtros */}
      <div className="flex flex-col md:flex-row gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Buscar por nome..." 
            className="pl-9 bg-white border-gray-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px] bg-white border-gray-200 text-xs">
              <ArrowUpDown className="h-3.5 w-3.5 mr-2" />
              <SelectValue placeholder="Ordenar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Nome (A-Z)</SelectItem>
              <SelectItem value="name-desc">Nome (Z-A)</SelectItem>
              <SelectItem value="price-asc">Menor Preço</SelectItem>
              <SelectItem value="price-desc">Maior Preço</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] bg-white border-gray-200 text-xs">
              <Filter className="h-3.5 w-3.5 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="auto">Automáticos</SelectItem>
              <SelectItem value="manual">Manuais</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lista de Itens */}
      <div className="grid gap-3">
        {filteredAndSortedProducts.map((product, index) => {
          const divisor = config?.markupDivisor || 1;
          const autoCardPrice = product.costPrice / divisor;
          
          // Lógica de Cartão
          const isManualCard = !!(product.manualPrice && product.manualPrice > 0);
          const finalCardPrice = isManualCard ? product.manualPrice! : autoCardPrice;

          // Lógica de Pix
          const isManualPix = !!(product.manualPixPrice && product.manualPixPrice > 0);
          const autoPixPrice = finalCardPrice * (1 - (config?.cashDiscount || 0));
          const finalPixPrice = isManualPix ? product.manualPixPrice! : autoPixPrice;

          return (
            <div
              key={product.id}
              className="bg-white border border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between rounded-xl hover:shadow-sm transition-all animate-in slide-in-from-left duration-300"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <div className="flex-1 min-w-0 mb-4 sm:mb-0">
                <div className="flex items-center gap-2 mb-3">
                  <h4 className="font-bold text-gray-900 truncate">{product.name}</h4>
                  {(isManualCard || isManualPix) ? (
                    <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 uppercase">
                      <Calculator className="h-3 w-3" /> Manual
                    </span>
                  ) : (
                    <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 uppercase">
                      <Zap className="h-3 w-3" /> Automático
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mr-4">
                  <div className="bg-gray-50 p-2 rounded-lg border border-gray-100 flex flex-col justify-center">
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Custo</p>
                    <p className="text-sm font-semibold text-gray-700">{formatCurrency(product.costPrice)}</p>
                  </div>

                  {/* Venda Cartão com Sugerido acima */}
                  <div className={`relative p-2 rounded-lg border ${isManualCard ? 'bg-amber-50 border-amber-100 pt-5' : 'bg-blue-50 border-blue-100'}`}>
                    {isManualCard && (
                      <span className="absolute top-1 left-2 text-[8px] text-amber-600 font-bold uppercase flex items-center gap-0.5">
                        <Info className="h-2 w-2" /> Sugerido: {formatCurrency(autoCardPrice)}
                      </span>
                    )}
                    <p className={`text-[10px] uppercase font-bold ${isManualCard ? 'text-amber-600' : 'text-blue-600'}`}>
                      Venda {isManualCard ? '(Manual)' : '(Cartão)'}
                    </p>
                    <p className={`text-sm font-bold ${isManualCard ? 'text-amber-700' : 'text-blue-700'}`}>{formatCurrency(finalCardPrice)}</p>
                  </div>

                  {/* Venda Pix com Sugerido acima */}
                  <div className={`relative p-2 rounded-lg border ${isManualPix ? 'bg-amber-50 border-amber-100 pt-5' : 'bg-green-50 border-green-100'}`}>
                    {isManualPix && (
                      <span className="absolute top-1 left-2 text-[8px] text-amber-600 font-bold uppercase flex items-center gap-0.5">
                        <Info className="h-2 w-2" /> Sugerido: {formatCurrency(autoPixPrice)}
                      </span>
                    )}
                    <p className={`text-[10px] uppercase font-bold ${isManualPix ? 'text-amber-600' : 'text-green-600'}`}>
                      Pix {isManualPix ? '(Manual)' : `(-${((config?.cashDiscount || 0) * 100).toFixed(0)}%)`}
                    </p>
                    <p className={`text-sm font-bold ${isManualPix ? 'text-amber-700' : 'text-green-700'}`}>{formatCurrency(finalPixPrice)}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1 self-end sm:self-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(product)}
                  className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                >
                  <Edit className="h-5 w-5" />
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-400 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-2xl border-none shadow-2xl">
                    <AlertDialogHeader>
                      <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                          <AlertTriangle className="h-6 w-6 text-red-600" />
                      </div>
                      <AlertDialogTitle className="text-center text-xl">Excluir Bateria?</AlertDialogTitle>
                      <AlertDialogDescription className="text-center">
                        Você está prestes a excluir a <strong>{product.name}</strong>.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="sm:justify-center gap-2 mt-4">
                      <AlertDialogCancel className="rounded-xl border-gray-200">Cancelar</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => onDelete(product.id)}
                        className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-6"
                      >
                        Sim, Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminProductList;