import { useState, useEffect } from "react";
import { Plus, Save, X, Calculator, Zap, Settings, CheckCircle2, Loader2, ImagePlus } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Product } from "@/core/types";
import { usePricedProducts } from "@/hooks/usePricedProducts";
import { uploadProductImage } from "@/services/productService";

interface AdminProductFormProps {
  onSubmit: (data: any) => Promise<void> | void;
  productToEdit?: Product | null;
  onCancelEdit?: () => void;
}

const AdminProductForm = ({ onSubmit, productToEdit, onCancelEdit }: AdminProductFormProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Estados de Imagem
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const [name, setName] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [manualPrice, setManualPrice] = useState("");
  const [manualPixPrice, setManualPixPrice] = useState("");
  const [warranty, setWarranty] = useState("12 meses");
  const [cca, setCca] = useState("");
  const [technology, setTechnology] = useState("Selada");
  const [ri, setRi] = useState("");
  const [ca, setCa] = useState("");
  
  const { config } = usePricedProducts();

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setCostPrice(productToEdit.costPrice.toString());
      setManualPrice(productToEdit.manualPrice?.toString() || "");
      setManualPixPrice(productToEdit.manualPixPrice?.toString() || "");
      setWarranty(productToEdit.warranty || "12 meses");
      setCca(productToEdit.cca || "");
      setTechnology(productToEdit.technology || "Selada");
      setRi(productToEdit.ri || "");
      setCa(productToEdit.ca || "");
      setPreviewUrl(productToEdit.imageUrl || "");
    } else {
      setName(""); setCostPrice(""); setManualPrice(""); setManualPixPrice("");
      setWarranty("12 meses"); setCca(""); setTechnology("Selada"); setRi(""); setCa("");
      setPreviewUrl(""); setImageFile(null);
    }
  }, [productToEdit]);

  const simulatedCardPrice = (() => {
    const cost = parseFloat(costPrice);
    if (isNaN(cost) || !config) return 0;
    const divisor = config.markupDivisor === 0 ? 1 : config.markupDivisor;
    return cost / divisor;
  })();

  const simulatedPixPrice = (() => {
    const base = manualPrice ? parseFloat(manualPrice) : simulatedCardPrice;
    if (isNaN(base) || !config) return 0;
    return base * (1 - (config.cashDiscount || 0));
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && costPrice) {
      setIsSaving(true);
      try {
        let finalImageUrl = previewUrl;

        // Se houver um novo arquivo selecionado, faz o upload para o ImgBB primeiro
        if (imageFile) {
          finalImageUrl = await uploadProductImage(imageFile);
        }

        await onSubmit({
          name: name.trim(),
          costPrice: parseFloat(costPrice),
          manualPrice: manualPrice ? parseFloat(manualPrice) : undefined,
          manualPixPrice: manualPixPrice ? parseFloat(manualPixPrice) : undefined,
          warranty, 
          cca, 
          technology, 
          ri, 
          ca,
          imageUrl: finalImageUrl // Salva a URL da imagem no Firestore
        });
        
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);

        if (!productToEdit) {
          setName(""); setCostPrice(""); setManualPrice(""); setManualPixPrice("");
          setCca(""); setRi(""); setCa(""); setPreviewUrl(""); setImageFile(null);
        }
      } catch (error) {
        console.error("Erro ao salvar:", error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border p-5 rounded-xl space-y-6 shadow-sm text-left">
      <div className="flex justify-between items-center border-b pb-3 mb-2">
        <h3 className="font-semibold text-foreground flex items-center gap-2 text-lg">
          {productToEdit ? <Save className="h-5 w-5 text-blue-500" /> : <Plus className="h-5 w-5 text-primary" />}
          {productToEdit ? "Editar Bateria" : "Cadastrar Nova Bateria"}
        </h3>
        {productToEdit && (
          <Button variant="ghost" size="sm" onClick={onCancelEdit} type="button">
            <X className="h-4 w-4 mr-1" /> Cancelar
          </Button>
        )}
      </div>

      {/* SEÇÃO DE IMAGEM */}
      <div className="p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300 space-y-3">
        <Label className="text-xs font-bold uppercase flex items-center gap-2">
          <ImagePlus className="h-4 w-4" /> Foto do Produto
        </Label>
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-lg border bg-white flex items-center justify-center overflow-hidden">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
            ) : (
              <ImagePlus className="h-8 w-8 text-gray-300" />
            )}
          </div>
          <div className="flex-1">
            <Input 
              type="file" 
              accept="image/*" 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImageFile(file);
                  setPreviewUrl(URL.createObjectURL(file));
                }
              }} 
              className="h-10 text-xs cursor-pointer"
            />
            <p className="text-[10px] text-gray-500 mt-1">PNG, JPG ou WEBP. Máx 32MB.</p>
          </div>
        </div>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="product-name">Nome comercial</Label>
          <Input id="product-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Moura 60Ah" className="h-12" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cost-price">Preço de Custo (R$)</Label>
          <Input id="cost-price" type="number" step="0.01" value={costPrice} onChange={(e) => setCostPrice(e.target.value)} placeholder="0,00" className="h-12" required />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100 space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="manual-price" className="flex items-center gap-2 text-blue-900 font-bold text-xs uppercase">
              <Calculator className="h-4 w-4" /> Venda Final (Cartão)
            </Label>
            {simulatedCardPrice > 0 && (
              <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold">
                Sugerido: R$ {simulatedCardPrice.toFixed(2)}
              </span>
            )}
          </div>
          <Input id="manual-price" type="number" step="0.01" value={manualPrice} onChange={(e) => setManualPrice(e.target.value)} placeholder={simulatedCardPrice > 0 ? `R$ ${simulatedCardPrice.toFixed(2)}` : "0,00"} className="h-12 bg-background border-blue-200" />
        </div>

        <div className="p-4 bg-green-50/50 rounded-lg border border-green-100 space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="manual-pix" className="flex items-center gap-2 text-green-900 font-bold text-xs uppercase">
              <Zap className="h-4 w-4" /> Venda Final (Pix)
            </Label>
            {simulatedPixPrice > 0 && (
              <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">
                Sugerido: R$ {simulatedPixPrice.toFixed(2)}
              </span>
            )}
          </div>
          <Input id="manual-pix" type="number" step="0.01" value={manualPixPrice} onChange={(e) => setManualPixPrice(e.target.value)} placeholder={simulatedPixPrice > 0 ? `R$ ${simulatedPixPrice.toFixed(2)}` : "0,00"} className="h-12 bg-background border-green-200" />
        </div>
      </div>

      <div className="p-5 bg-gray-50/50 rounded-xl border border-gray-200 space-y-4">
        <h4 className="font-bold text-gray-700 text-xs flex items-center gap-2 uppercase tracking-wider">
          <Settings className="h-4 w-4 text-gray-500" /> Características Técnicas
        </h4>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Tecnologia</Label>
            <select value={technology} onChange={(e) => setTechnology(e.target.value)} className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary">
              <option value="Selada">Selada</option>
              <option value="EFB">EFB</option>
              <option value="AGM">AGM</option>
              <option value="Chumbo-Ácido">Chumbo-Ácido</option>
              <option value="Estacionária">Estacionária</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Garantia</Label>
            <select value={warranty} onChange={(e) => setWarranty(e.target.value)} className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary">
              <option value="12 meses">12 meses</option>
              <option value="15 meses">15 meses</option>
              <option value="18 meses">18 meses</option>
              <option value="24 meses">24 meses</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">CCA (A)</Label>
            <Input value={cca} onChange={(e) => setCca(e.target.value)} placeholder="Ex: 480" className="h-10" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">CA (A)</Label>
            <Input value={ca} onChange={(e) => setCa(e.target.value)} placeholder="Ex: 550" className="h-10" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">RI (mΩ)</Label>
            <Input value={ri} onChange={(e) => setRi(e.target.value)} placeholder="Ex: 4.8" className="h-10" />
          </div>
        </div>
      </div>
      
      <Button 
        type="submit" 
        disabled={isSaving}
        className={`w-full h-14 text-base font-bold uppercase tracking-wide transition-all duration-300 ${
          saveSuccess 
            ? "bg-green-600 hover:bg-green-700 shadow-[0_0_15px_rgba(22,163,74,0.4)]" 
            : (productToEdit ? "bg-blue-600 hover:bg-blue-700" : "bg-primary")
        }`}
      >
        {isSaving ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" /> Processando...
          </span>
        ) : saveSuccess ? (
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" /> Dados Salvos!
          </span>
        ) : (
          productToEdit ? "Salvar Alterações" : "Cadastrar Bateria"
        )}
      </Button>
    </form>
  );
};

export default AdminProductForm;