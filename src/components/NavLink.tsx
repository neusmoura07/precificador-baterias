"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

// Definimos os tipos para aceitar 'href' (Next.js) ou 'to' (compatibilidade Lovable)
type NavLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href?: string;
  to?: string;
  activeClassName?: string;
};

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ className, activeClassName, href, to, ...props }, ref) => {
    const pathname = usePathname();
    const destination = href || to || "/";
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
