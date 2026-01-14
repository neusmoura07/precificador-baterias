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

// --- FUNÇÃO DE UPLOAD EXTERNA (ImgBB) ---
export const uploadProductImage = async (file: File): Promise<string> => {
  // SUBSTITUA PELA SUA CHAVE DO IMGBB: https://api.imgbb.com/
  const API_KEY = "535f874f0c000d4909841f5244dc6142"; 
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    
    if (data.success) {
      return data.data.url; // Retorna o link direto da imagem
    } else {
      throw new Error("Falha no upload da imagem para o ImgBB");
    }
  } catch (error) {
    console.error("Erro no upload:", error);
    throw error;
  }
};

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