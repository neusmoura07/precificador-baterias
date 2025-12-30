"use client";

import { useState } from "react";
import { usePricedProducts } from "@/hooks/usePricedProducts";

// Importando os componentes visuais que você trouxe do Lovable
// Certifique-se de que eles estão na pasta src/components/
import  Header  from "@/components/Header";
import  SearchBar  from "@/components/SearchBar";
import  ProductCard  from "@/components/ProductCard";

export default function Home() {
  // 1. O "Cérebro": Nossa lógica que busca dados do Firebase
  const { products, loading } = usePricedProducts();
  const [searchTerm, setSearchTerm] = useState("");

  // 2. A Lógica de Filtro: Aplica a busca sobre a lista do Firebase
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading simples para não mostrar tela em branco
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-400 font-medium">
          Carregando catálogo...
        </div>
      </div>
    );
  }

  // 3. O Visual (Lovable): O código que você me enviou
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Search Section */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-border/50 py-4">
        <div className="container px-4 mx-auto"> {/* Adicionei mx-auto para centralizar */}
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            // O componente do Lovable pode esperar props diferentes, mas geralmente é value/onChange
          />
        </div>
      </div>

      {/* Products Grid */}
      <main className="container px-4 py-6 mx-auto"> {/* Adicionei mx-auto */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Nenhum produto encontrado para "{searchTerm}"
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                style={{ animationDelay: `${index * 50}ms` }}
                className="animate-fade-in" // Classe de animação comum nessas IAs
              >
                {/* Aqui passamos o produto REAL (com preço Pix e Cartão) para o card visual */}
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
        
        {/* Results count */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          {filteredProducts.length} produto{filteredProducts.length !== 1 ? "s" : ""} encontrado{filteredProducts.length !== 1 ? "s" : ""}
        </p>
      </main>
    </div>
  );
}