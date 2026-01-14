import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  deleteDoc, 
  doc,
  updateDoc,
} from "firebase/firestore";
import { Product } from "@/core/types";

const COLLECTION = "products";

export const getProducts = async (): Promise<Product[]> => {
  const q = query(collection(db, COLLECTION), orderBy("name"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as Product)
  );
};

export const createProduct = async (name: string, costPrice: number, manualPrice?: number, manualPixPrice?: number) => {
  try {
    await addDoc(collection(db, COLLECTION), {
      name: name.trim(),
      costPrice: Number(costPrice), // Garante que salva como número
      manualPrice: manualPrice || null, // Salva null se não for enviado
      manualPixPrice: manualPixPrice || null,
      active: true,
      createdAt: new Date(), // Útil para ordenação futura
    });
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    throw error;
  }
};

// Editar produto 
export const updateProduct = async (id: string, data: { name: string; costPrice: number; manualPrice?: number, manualPixPrice?: number }) => {
  try {
    const productRef = doc(db, "products", id);
    await updateDoc(productRef, {
      name: data.name,
      costPrice: data.costPrice,
      manualPrice: data.manualPrice || null,
      manualPixPrice: data.manualPixPrice || null,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    throw error;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const productRef = doc(db, COLLECTION, id);
    await deleteDoc(productRef);
  } catch (error) {
    console.error("Erro ao deletar:", error);
    throw error;
  }
};
