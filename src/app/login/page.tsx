"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "@/lib/firebase";

// Ícones (Lucide React)
import { Battery, Mail, Lock, LogIn, ArrowLeft } from "lucide-react";

// Componentes UI (Shadcn/Lovable)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast"; // Opcional, se tiver instalado

export default function LoginPage() {
  // 1. Lógica do Next.js + Firebase
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const auth = getAuth(app);
      await signInWithEmailAndPassword(auth, email, password);
      
      // Sucesso: Vai para o admin
      router.push("/admin");
    } catch (error: any) {
      console.error("Erro login:", error);
      
      // Feedback de erro
      const message = error.code === 'auth/invalid-credential' 
        ? "E-mail ou senha incorretos." 
        : "Erro ao tentar entrar.";
        
      if (toast) {
        toast({ variant: "destructive", title: "Erro", description: message });
      } else {
        alert(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 2. O Visual do Lovable (Adaptado)
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8 animate-in fade-in duration-500">
        <div className="bg-primary p-3 rounded-xl">
          <Battery className="h-8 w-8 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Área Administrativa</h1>
          <p className="text-sm text-muted-foreground">Acesso restrito</p>
        </div>
      </div>

      {/* Login Card */}
      {/* Troquei 'card-elevated' por classes Tailwind padrão para garantir que funcione */}
      <div className="w-full max-w-md bg-card border border-border shadow-lg rounded-xl p-6 sm:p-8 animate-in slide-in-from-bottom-4 duration-500">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-base">E-mail</Label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="h-14 pl-12 text-base"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-base">Senha</Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-14 pl-12 text-base"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-14 text-lg font-semibold"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Entrando...
              </span>
            ) : (
              <>
                <LogIn className="h-5 w-5 mr-2" />
                Entrar
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Back Link (Adaptado para Next.js) */}
      <Button
        variant="ghost"
        className="mt-6 text-muted-foreground hover:text-foreground"
        onClick={() => router.push("/")} // Aqui usamos o router do Next.js
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar para Loja
      </Button>
    </div>
  );
}