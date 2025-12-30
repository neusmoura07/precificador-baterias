import { Battery, Settings, Lock } from "lucide-react";
import Link from "next/link"; // <--- O jeito certo no Next.js
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo que clica e vai para a Home */}
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="bg-blue-600 p-2 rounded-lg">
            <Battery className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-none">
              Cia das Baterias
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Catálogo Digital
            </p>
          </div>
        </Link>

        {/* Botão de Admin */}
        <Link href="/admin">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-blue-600 hover:bg-blue-50"
          >
            <Lock className="h-5 w-5" />
            <span className="sr-only">Área Administrativa</span>
          </Button>
        </Link>
      </div>
    </header>
  );
}
