"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth, signOut } from "firebase/auth";
import { app } from "@/lib/firebase";

// Ícones
import { Battery, LogOut, Package, Settings, Store } from "lucide-react";

// Hooks e Serviços
import { useAuth } from "@/context/AuthContext";
import { usePricedProducts } from "@/hooks/usePricedProducts";
import { createProduct, deleteProduct, updateProduct } from "@/services/productService";
import { updateGlobalRates } from "@/services/settingsService";
import { Product } from "@/core/types";

// Componentes Visuais
import AdminProductForm from "@/components/AdminProductForm"; 
import AdminProductList from "@/components/AdminProductList";
import PricingSettings from "@/components/PricingSettings"; 

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"products" | "settings">("products");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const { user, loading: authLoading } = useAuth();
  const { products, loading: dataLoading, config } = usePricedProducts();
  const router = useRouter();

  // Proteção de Rota
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const handleLogout = async () => {
    const auth = getAuth(app);
    await signOut(auth);
    router.push("/login");
  };

  // --- LÓGICA DE PRODUTOS ATUALIZADA ---
  const handleFormSubmit = async (data: any) => {
  if (editingProduct) {
    await updateProduct(editingProduct.id, data);
    setEditingProduct(null);
  } else {
    // CORREÇÃO: Passando o objeto 'data' inteiro para o serviço
    await createProduct(data);
  }
};

  const handleDeleteProduct = async (id: string) => {
    await deleteProduct(id);
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveConfig = async (newConfig: any) => {
    await updateGlobalRates({
      markupDivisor: Number(newConfig.markupDivisor),
      cashDiscount: Number(newConfig.cashDiscount)
    });
  };

  // --- ORDENAÇÃO ALFABÉTICA ---
  // Ordena os produtos antes de passar para a lista
  const sortedProducts = [...products].sort((a, b) => 
    a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' })
  );

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground font-medium">Verificando permissão...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <Battery className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight text-gray-900">Painel Admin</h1>
              <p className="text-xs text-gray-500">Gerenciamento</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/")}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Store className="h-4 w-4 mr-2" />
              Ver Loja
            </button>
            
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        
        {/* Navegação de Abas */}
        <div className="flex p-1 bg-white rounded-xl border border-gray-200 mb-8 shadow-sm">
          <button
            onClick={() => setActiveTab("products")}
            className={`flex-1 flex items-center justify-center py-2.5 text-sm font-medium rounded-lg transition-all ${
              activeTab === "products"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <Package className="h-4 w-4 mr-2" />
            Produtos
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex-1 flex items-center justify-center py-2.5 text-sm font-medium rounded-lg transition-all ${
              activeTab === "settings"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </button>
        </div>

        {activeTab === "products" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AdminProductForm 
              onSubmit={handleFormSubmit} 
              productToEdit={editingProduct}
              onCancelEdit={() => setEditingProduct(null)}
            />
            
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  Produtos Cadastrados
                </h3>
                <span className="bg-blue-100 text-blue-700 py-1 px-3 rounded-full text-xs font-bold">
                  {products.length} itens
                </span>
              </div>
              
              <AdminProductList 
                products={sortedProducts} 
                onDelete={handleDeleteProduct} 
                onEdit={handleEditClick}
              />
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-600" />
                Configurações de Preços
              </h3>
              
              <PricingSettings 
                config={config || { markupDivisor: 0, cashDiscount: 0 }} 
                onSave={handleSaveConfig} 
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}