"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Importado para o redirecionamento
import { Lock } from "lucide-react"; // Ícone do cadeado
import { usePricedProducts } from "@/hooks/usePricedProducts";

// Importando os componentes visuais
import SearchBar from "@/components/SearchBar";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  const { products, loading } = usePricedProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const displayProducts = products
    .filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => 
      a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' })
    );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-400 font-medium">
          Carregando catálogo...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header com Logo e Cadeado */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <img 
              src="/icon-192.png" 
              alt="HB Baterias Logo" 
              className="h-10 w-10 object-contain rounded-lg shadow-sm" 
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">HB Baterias</h1>
              <p className="text-xs text-gray-500">Catálogo Digital</p>
            </div>
          </div>

          {/* Botão de Admin (Cadeado) reintroduzido */}
          <button 
            onClick={() => router.push("/admin")}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Acesso Administrativo"
          >
            <Lock className="h-5 w-5" />
          </button>
        </div>
      </header>
      
      {/* Search Section */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-border/50 py-4">
        <div className="container px-4 mx-auto">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </div>
      </div>

      {/* Products Grid */}
      <main className="container px-4 py-6 mx-auto">
        {displayProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Nenhum produto encontrado para "{searchTerm}"
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {displayProducts.map((product, index) => (
              <div
                key={product.id}
                style={{ animationDelay: `${index * 50}ms` }}
                className="animate-fade-in"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
        
        {/* Results count */}
        <p className="text-center text-sm text-muted-foreground mt-8 pb-10">
          Mostrando {displayProducts.length} de {products.length} baterias
        </p>
      </main>
    </div>
  );
}