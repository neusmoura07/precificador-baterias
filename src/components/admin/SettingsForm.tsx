"use client";

import { useState, useEffect } from "react";
import { PricingConfig } from "@/core/types";
import { updateGlobalRates } from "@/services/settingsService";

interface SettingsFormProps {
  currentConfig: PricingConfig | null;
}

export function SettingsForm({ currentConfig }: SettingsFormProps) {
  // Estados locais para edição
  const [markup, setMarkup] = useState<string>("");
  const [discount, setDiscount] = useState<string>("");
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Carrega os dados atuais nos inputs quando o componente monta
  useEffect(() => {
    if (currentConfig) {
      setMarkup(currentConfig.markupDivisor.toString());
      setDiscount((currentConfig.cashDiscount * 100).toString()); // Converte 0.05 para 5
    }
  }, [currentConfig]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Conversão e Validação
      const markupValue = parseFloat(markup);
      const discountValue = parseFloat(discount) / 100; // Converte 5 para 0.05

      if (isNaN(markupValue) || markupValue <= 0 || markupValue > 1) {
        throw new Error("O Markup deve ser entre 0.01 e 1.0");
      }

      // Salva no Firebase
      await updateGlobalRates({
        markupDivisor: markupValue,
        cashDiscount: discountValue
      });

      setMessage({ type: 'success', text: 'Taxas atualizadas! Preços recalculados.' });
      
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Erro ao salvar.' });
    } finally {
      setLoading(false);
    }
  };

  if (!currentConfig) return <p>Carregando configurações...</p>;

  return (
    <form onSubmit={handleSave} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      
      <div className="mb-6 p-4 bg-blue-50 text-blue-800 text-sm rounded border border-blue-100">
        <strong>Como funciona:</strong>
        <ul className="list-disc ml-5 mt-1 space-y-1">
          <li><strong>Markup Divisor:</strong> Divide o custo. (Ex: 0.70 representa ~30% de margem bruta).</li>
          <li><strong>Desconto Pix:</strong> É aplicado sobre o preço final do cartão.</li>
        </ul>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Input Markup */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            Markup Divisor (Fator)
          </label>
          <input
            type="number"
            step="0.01"
            max="1.0"
            min="0.1"
            value={markup}
            onChange={(e) => setMarkup(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 font-mono text-gray-900"
          />
          <p className="text-xs text-gray-500 mt-1">
            Use 0.7 para 30%, 0.6 para 40%, etc.
          </p>
        </div>

        {/* Input Desconto */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            Desconto à Vista (%)
          </label>
          <input
            type="number"
            step="1"
            min="0"
            max="100"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 font-mono text-gray-900"
          />
          <p className="text-xs text-gray-500 mt-1">
            Digite o valor inteiro (Ex: 5 para 5%).
          </p>
        </div>
      </div>

      {/* Botão Salvar */}
      <div className="mt-6 border-t pt-4 flex justify-between items-center">
        {message ? (
          <span className={`text-sm font-bold ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {message.text}
          </span>
        ) : <span></span>}

        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-2 rounded text-white font-bold shadow-sm
            ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {loading ? "Calculando..." : "Atualizar Sistema"}
        </button>
      </div>
    </form>
  );
}