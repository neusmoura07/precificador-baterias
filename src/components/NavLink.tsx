"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

// Definimos os tipos aceitando 'href' (padrão Next) ou 'to' (padrão antigo para não quebrar)
type NavLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href?: string;
  to?: string; // Mantivemos para compatibilidade caso algum arquivo ainda use 'to'
  activeClassName?: string;
};

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ className, activeClassName, href, to, ...props }, ref) => {
    const pathname = usePathname();

    // O destino pode vir de 'href' ou 'to'
    const destination = href || to || "/";

    // Verifica se o link é a página atual
    // (Usa startsWith para sub-rotas ou comparação exata)
    const isActive = pathname === destination;

    return (
      <Link
        ref={ref}
        href={destination}
        className={cn(className, isActive && activeClassName)}
        {...props}
      />
    );
  }
);

NavLink.displayName = "NavLink";

export { NavLink };
