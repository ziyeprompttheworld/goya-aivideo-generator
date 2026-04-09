"use client";

import Link from "next/link";
import { useLocalePathname, useLocaleRouter } from "@/i18n/navigation";
import { Gem, Menu } from "lucide-react";
import { useTranslations } from "next-intl";

import { authClient, type User } from "@/lib/auth/client";
import { cn } from "@/components/ui";
import { useCredits } from "@/stores/credits-store";
import { UserAvatar } from "@/components/user-avatar";
import { useSigninModal } from "@/hooks/use-signin-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { userMenuItems } from "@/config/navigation";
import { i18n, localeMap } from "@/config/i18n-config";

interface HeaderSimpleProps {
  user?: Pick<User, "name" | "image" | "email"> | null;
  lang?: string;
  mobileMenuOpen?: boolean;
  onMobileMenuToggle?: () => void;
}

export function HeaderSimple({
  user,
  lang = "en",
  mobileMenuOpen = false,
  onMobileMenuToggle,
}: HeaderSimpleProps) {
  const { balance } = useCredits();
  const signInModal = useSigninModal();
  const router = useLocaleRouter();
  const pathname = useLocalePathname();
  const tCommon = useTranslations("Common");
  const tHeader = useTranslations("Header");
  const currentLocale = lang || "en";

  const switchLocale = (nextLocale: string) => {
    router.push(pathname, { locale: nextLocale });
  };

  const menuLabelMap: Record<string, string> = {
    creations: tHeader("myCreations"),
    credits: tHeader("credits"),
    settings: tHeader("settings"),
  };

  return (
    <header className="sticky top-0 z-50 h-14 border-b border-white/8 bg-black/90 backdrop-blur-md font-plex-mono">
      <div className="flex h-full items-center justify-between px-6">
        {/* Left: Logo + Mobile Menu */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="lg:hidden p-2 text-white/40 hover:text-white transition-colors"
            onClick={onMobileMenuToggle}
          >
            <Menu className="h-4 w-4" />
          </button>
          <Link href={`/${lang}`} className="text-[15px] font-normal tracking-[0.08em] text-white/80 hover:text-white transition-colors lowercase">
            goya.
          </Link>
        </div>

        {/* Right: Credits + User Menu */}
        <div className="flex items-center gap-6">
          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-[10px] tracking-[0.25em] text-white/30 hover:text-white/70 transition-colors uppercase">
                {currentLocale}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[120px] bg-black border-white/10 font-plex-mono">
              {i18n.locales.map((locale) => (
                <DropdownMenuItem
                  key={locale}
                  onSelect={() => switchLocale(locale)}
                  className={cn(
                    "text-[11px] tracking-[0.1em] lowercase text-white/50 hover:text-white",
                    locale === currentLocale && "text-white/80"
                  )}
                >
                  {localeMap[locale]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Credits Display */}
          {user && balance && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 border border-white/10 bg-white/[0.02]">
              <Gem className="h-3 w-3 text-white/40" />
              <span className="text-[11px] text-white/50 tracking-widest">
                {balance.availableCredits}
              </span>
            </div>
          )}

          {/* User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 text-white/40 hover:text-white/80 transition-colors">
                <UserAvatar
                  user={{ name: user.name ?? null, image: user.image ?? null }}
                  className="h-7 w-7"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 bg-black border-white/10 font-plex-mono">
                {user.email && (
                  <div className="px-2 py-1.5 text-[10px] text-white/30 tracking-[0.08em] lowercase truncate">
                    {user.email}
                  </div>
                )}
                <DropdownMenuSeparator className="bg-white/8" />
                {userMenuItems.map((item) => (
                  <DropdownMenuItem key={item.id} asChild>
                    <Link href={`/${lang}${item.href}`} className="text-[11px] text-white/50 hover:text-white lowercase tracking-[0.08em]">
                      {menuLabelMap[item.id] ?? item.title}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator className="bg-white/8" />
                <DropdownMenuItem
                  className="text-[11px] text-white/30 hover:text-red-400 lowercase tracking-[0.08em]"
                  onSelect={async () => {
                    await authClient.signOut();
                    router.push(`/${lang}`);
                    router.refresh();
                  }}
                >
                  {tCommon("logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button
              onClick={() => signInModal.onOpen()}
              className="text-[11px] tracking-[0.18em] text-white/50 hover:text-white transition-colors lowercase border border-white/10 px-4 py-1.5"
            >
              sign in
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
