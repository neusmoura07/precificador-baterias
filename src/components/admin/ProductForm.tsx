"use client";

import { useState } from "react";
import { createProduct } from "@/services/productService";

export function ProductForm() {
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !cost) return;

    setLoading(true);
    setMessage(null);

    try {
      // CORREÇÃO: Adicionado o campo 'maintenance' obrigatório e atualizado 'technology'
      await createProduct({ 
        name: name.trim(), 
        costPrice: Number(cost),
        warranty: "12 meses", 
        technology: "Chumbo-Ácido", // Removido "Selada" daqui conforme sua solicitação anterior
        maintenance: "Selada",       // Novo campo obrigatório
        cca: "",
        active: true 
      });
      
      // Feedback visual e Limpeza
      setMessage({ type: 'success', text: 'Produto salvo com sucesso!' });
      setName("");
      setCost("");
      
      // Remove a mensagem após 3 segundos
      setTimeout(() => setMessage(null), 3000);

    } catch (error) {
      console.error("Erro ao salvar:", error);
      setMessage({ type: 'error', text: 'Erro ao salvar. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8 text-left">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Novo Produto</h3>
      
      <div className="grid gap-4 md:grid-cols-2">
        {/* Input Nome */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Bateria</label>
          <input
            type="text"
            placeholder="Ex: Moura 60Ah"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-gray-900 outline-none"
            required
          />
        </div>

        {/* Input Preço */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Preço de Custo (R$)</label>
          <input
            type="number"
            step="0.01"
            placeholder="0.00"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-gray-900 outline-none"
            required
          />
        </div>
      </div>

      {/* Botão de Ação */}
      <div className="mt-4 flex items-center justify-between">
        <div className="h-5">
          {message && (
            <span className={`text-sm font-medium ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {message.text}
            </span>
          )}
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-2 rounded text-white font-bold transition-colors 
            ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
        >
          {loading ? "Salvando..." : "Cadastrar Produto"}
        </button>
      </div>
    </form>
  );
}