import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

// 1. Configuração da área de visualização móvel (cor da barra e zoom)
export const viewport: Viewport = {
  themeColor: "#2563eb", // A cor azul da barra superior no Android
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Impede zoom quebra-layout no mobile
};

// 2. Metadados expandidos para PWA e Apple
export const metadata: Metadata = {
  title: "Precificador Baterias",
  description: "Sistema de gestão de preços e margem.",
  manifest: "/manifest.json", // Aponta para o arquivo que criamos
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-512.png", // O iPhone gosta do ícone grande
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Baterias",
  },
  formatDetection: {
    telephone: false, // Evita que números na tela virem links de ligação
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      {/* Mantemos o body limpo como você deixou */}
      <body className="antialiased bg-gray-50">
        <AuthProvider>
          {children}
        </AuthProvider>

        <ServiceWorkerRegister />

      </body>
    </html>
  );
}