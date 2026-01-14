"use client";

import { useState } from "react";
import { usePricedProducts } from "@/hooks/usePricedProducts";

// Importando os componentes visuais
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  // 1. O "Cérebro": Busca dados do Firebase
  const { products, loading } = usePricedProducts();
  const [searchTerm, setSearchTerm] = useState("");

  // 2. Lógica de Filtro e Ordenação Alfabética
  // Primeiro filtramos pelo nome e depois ordenamos de A a Z
  const displayProducts = products
    .filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => 
      a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' })
    );

  // Loading simples
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
      <Header />
      
      {/* Search Section */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-border/50 py-4">
        <div className="container px-4 mx-auto">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </div>
      </div>

      {/* Products Grid Ordenado */}
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
                {/* O cashPrice aqui já respeitará o manualPixPrice se você atualizou o pricing.ts */}
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
        
        {/* Results count */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          {displayProducts.length} produto{displayProducts.length !== 1 ? "s" : ""} encontrado{displayProducts.length !== 1 ? "s" : ""}
        </p>
      </main>
    </div>
  );
}