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

// Modificado para aceitar o objeto completo de características
export const createProduct = async (productData: Omit<Product, 'id'>) => {
  try {
    await addDoc(collection(db, COLLECTION), {
      ...productData,
      name: productData.name.trim(),
      costPrice: Number(productData.costPrice),
      manualPrice: productData.manualPrice || null,
      manualPixPrice: productData.manualPixPrice || null,
      active: true,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    throw error;
  }
};

// Modificado para aceitar o objeto completo na atualização
export const updateProduct = async (id: string, data: Partial<Product>) => {
  try {
    const productRef = doc(db, COLLECTION, id);
    await updateDoc(productRef, {
      ...data,
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