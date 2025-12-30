import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { PricingConfig } from "@/core/types";

const COLLECTION = "settings";
const DOC_ID = "global_rates";

export const getGlobalRates = async (): Promise<PricingConfig> => {
  const docRef = doc(db, COLLECTION, DOC_ID);
  const snapshot = await getDoc(docRef);

  if (snapshot.exists()) {
    return snapshot.data() as PricingConfig;
  } else {
    // Retorna padrão se não existir ainda no banco
    return { markupDivisor: 0.7, cashDiscount: 0.05 };
  }
};

export const updateGlobalRates = async (config: PricingConfig) => {
  try {
    const docRef = doc(db, COLLECTION, DOC_ID);
    // 'merge: true' garante que se criarmos novos campos no futuro, não apagamos os antigos
    await setDoc(docRef, config, { merge: true });
  } catch (error) {
    console.error("Erro ao atualizar taxas:", error);
    throw error;
  }
};