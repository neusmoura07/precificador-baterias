import { useState, useEffect, useMemo } from "react";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product, PricingConfig, PricedProduct } from "@/core/types";
import { calculateProductPrice } from "@/core/domain/pricing";

export function usePricedProducts() {
  const [rawProducts, setRawProducts] = useState<Product[]>([]);
  const [config, setConfig] = useState<PricingConfig | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Escuta alterações nos PRODUTOS em tempo real
  useEffect(() => {
    const unsubscribeProducts = onSnapshot(collection(db, "products"), (snapshot) => {
      const productsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      
      setRawProducts(productsData);
    });

    // 2. Escuta alterações nas TAXAS GLOBAIS em tempo real
    const unsubscribeSettings = onSnapshot(doc(db, "settings", "global_rates"), (snapshot) => {
      if (snapshot.exists()) {
        setConfig(snapshot.data() as PricingConfig);
      } else {
        // Fallback se não existir configuração ainda
        setConfig({ markupDivisor: 1, cashDiscount: 0 }); 
      }
    });

    // Cleanup: Desliga os ouvintes quando o componente desmontar
    return () => {
      unsubscribeProducts();
      unsubscribeSettings();
    };
  }, []);

  // 3. Verifica se terminou de carregar
  useEffect(() => {
    if (config && rawProducts) {
      setLoading(false);
    }
  }, [config, rawProducts]);

  // 4. O "Cérebro": Recalcula tudo apenas se os dados mudarem (Performance)
  const pricedProducts: PricedProduct[] = useMemo(() => {
    if (!config) return [];

    return rawProducts.map((product) => 
      calculateProductPrice(product, config)
    );
  }, [rawProducts, config]);

  return { products: pricedProducts, loading, config };
}