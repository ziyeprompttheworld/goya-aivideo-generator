"use client";

import { useState, useEffect, useTransition } from "react";
import { Menu, Globe, Sun, Moon, Monitor } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useTheme } from "next-themes";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/components/ui";
import { useCredits } from "@/stores/credits-store";
import { headerModels, headerTools, headerDocs } from "@/config/navigation";
import { Gem, ImagePlay, Type, Video, BookOpen } from "lucide-react";
import { LocaleLink } from "@/i18n/navigation";
import type { User } from "@/lib/auth/client";
import { useSigninModal } from "@/hooks/use-signin-modal";
import { authClient } from "@/lib/auth/client";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ImagePlay,
  Type,
  Video,
};

export function LandingHeader({ user }: { user?: User | null }) {
  const signInModal = useSigninModal();
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push(`/${locale}`);
    router.refresh();
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Language switcher function
  const switchLocale = (newLocale: string) => {
    startTransition(() => {
      let newPath = pathname;

      // Clean up the path by removing existing locale prefix
      if (newPath.startsWith("/zh") || newPath.startsWith("/en")) {
        newPath = newPath.replace(/^\/(zh|en)/, "");
      }

      // Ensure root path handling
      if (newPath === "") newPath = "/";

      // Construct new path with target locale
      if (newLocale === "zh") {
        if (newPath === "/") {
          newPath = "/zh";
        } else if (!newPath.startsWith("/zh")) {
          newPath = `/zh${newPath}`;
        }
      } else {
        // For 'en' (default), ensure no prefix
        // newPath is already cleaned
      }

      router.push(newPath);
      router.refresh(); // Force server components to re-render with new locale
    });
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/20 backdrop-blur-2xl backdrop-saturate-200 border-b border-white/10 dark:border-white/5 shadow-2xl"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center justify-between py-8 px-10 font-plex-mono group pointer-events-auto">
          {/* Logo - Always visible but subtle */}
          <LocaleLink
            href="/"
            className="text-[16px] font-normal tracking-[0.1em] text-white/90 hover:text-white transition-all duration-300"
          >
            goya.
          </LocaleLink>

          {/* Ghost Links: Reveal on hover */}
          <div className="flex items-center gap-[42px]">
            <LocaleLink
              href="/#showcase"
              className="text-[12px] font-light tracking-[0.18em] text-white/60 hover:text-white transition-colors lowercase"
            >
              showcase
            </LocaleLink>
            <LocaleLink
              href="/pricing"
              className="text-[12px] font-light tracking-[0.18em] text-white/60 hover:text-white transition-colors lowercase"
            >
              pricing
            </LocaleLink>

            {user ? (
              <>
                <LocaleLink
                  href="/my-creations"
                  className="text-[12px] font-light tracking-[0.18em] text-white/60 hover:text-white transition-colors lowercase"
                >
                  creations
                </LocaleLink>
                <div className="flex items-center gap-2 px-3 py-1 border border-white/10 text-white/50 bg-white/[0.02]">
                  <Gem className="h-2.5 w-2.5" />
                  <span className="text-[10px] font-light tracking-widest"><CreditsDisplay /></span>
                </div>
              </>
            ) : (
              <button
                onClick={signInModal.onOpen}
                className="text-[12px] font-light tracking-[0.18em] text-white/60 hover:text-white transition-colors cursor-pointer lowercase"
              >
                sign in
              </button>
            )}

            {/* Language Switch */}
            <button
              onClick={() => switchLocale(locale === "en" ? "zh" : "en")}
              className="text-[10px] font-light tracking-[0.3em] text-white/30 hover:text-white/70 transition-colors cursor-pointer uppercase border-l border-white/10 pl-6"
            >
              {locale}
            </button>
          </div>
        </nav>


        {/* Mobile Navigation */}
        <div className="lg:hidden flex items-center justify-between h-16">
          {/* Logo */}
          <LocaleLink
            href="/"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <Image src="/logo.svg" alt="Goya.ai" width={28} height={28} className="rounded-md" />
            Goya.ai
          </LocaleLink>

          {/* Mobile Menu */}
          <div className="flex items-center gap-3">
            {/* Credits Display */}
            {user && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted border border-border">
                <Gem className="h-3 w-3 text-amber-500" />
                <span className="text-xs font-medium">
                  <CreditsDisplay />
                </span>
              </div>
            )}

            {/* Sheet Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <LocaleLink
                      href="/"
                      className="flex items-center gap-2"
                    >
                      <Image src="/logo.svg" alt="Goya.ai" width={28} height={28} className="rounded-md" />
            Goya.ai
                    </LocaleLink>
                  </SheetTitle>
                </SheetHeader>

                <div className="mt-8 flex flex-col gap-4">
                  <Accordion type="single" collapsible className="w-full">
                    {/* Models (Hidden for audit) */}
                    {/* <AccordionItem value="models" className="border-b-0">
                      <AccordionTrigger className="py-0 font-semibold hover:no-underline">
                        {t('Header.models')}
                      </AccordionTrigger>
                      <AccordionContent className="mt-2">
                        {headerModels.map((model) => (
                          <LocaleLink
                            key={model.id}
                            href={model.href}
                            className="flex flex-col p-3 rounded-md hover:bg-accent transition-colors"
                          >
                            <span className="text-sm font-medium">{model.title}</span>
                            <span className="text-xs text-muted-foreground">
                              {model.subtitle}
                            </span>
                          </LocaleLink>
                        ))}
                      </AccordionContent>
                    </AccordionItem> */}

                    {/* Tools */}
                    <AccordionItem value="tools" className="border-b-0">
                      <AccordionTrigger className="py-0 font-semibold hover:no-underline">
                        {t('Header.tools')}
                      </AccordionTrigger>
                      <AccordionContent className="mt-2">
                        {headerTools.map((tool) => {
                          const Icon = iconMap[tool.icon || ""];
                          return (
                            <LocaleLink
                              key={tool.id}
                              href={tool.href}
                              className="flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors"
                            >
                              {Icon && <Icon className="h-4 w-4" />}
                              <span className="text-sm">{tool.title}</span>
                            </LocaleLink>
                          );
                        })}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  {/* Pricing */}
                  <LocaleLink
                    href="/pricing"
                    className="font-semibold p-2 hover:bg-accent rounded-md transition-colors"
                  >
                    {t('Header.pricing')}
                  </LocaleLink>

                  {/* Docs (Hidden for audit) */}
                  {/* <a
                    href={headerDocs.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 font-semibold p-2 hover:bg-accent rounded-md transition-colors"
                  >
                    <BookOpen className="h-4 w-4" />
                    {t('Header.docs')}
                  </a> */}

                  {/* Language */}
                  <div className="flex items-center gap-3 p-2">
                    <Globe className="h-4 w-4" />
                    <button
                      onClick={() => switchLocale("en")}
                      className="text-sm hover:text-foreground transition-colors"
                    >
                      {locale === "zh" ? "English" : "英文"}
                    </button>
                    <span className="text-muted-foreground">/</span>
                    <button
                      onClick={() => switchLocale("zh")}
                      className="text-sm hover:text-foreground transition-colors"
                    >
                      {locale === "zh" ? "中文" : "中文"}
                    </button>
                  </div>

                  {/* Theme Toggle */}
                  <div className="flex items-center gap-2 p-2">
                    <Sun className="h-4 w-4 shrink-0" />
                    <div className="flex items-center gap-1">
                      {(["light", "dark", "system"] as const).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setTheme(mode)}
                          className={cn(
                            "text-sm px-2 py-1 rounded-md transition-colors",
                            theme === mode
                              ? "bg-accent text-accent-foreground font-medium"
                              : "hover:text-foreground text-muted-foreground"
                          )}
                        >
                          {mode === "light" ? "Light" : mode === "dark" ? "Dark" : "System"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Auth Section */}
                <div className="border-t pt-4 mt-4">
                  {user ? (
                    <div className="flex flex-col gap-2">
                      <LocaleLink
                        href="/my-creations"
                        className="p-2 hover:bg-accent rounded-md transition-colors"
                      >
                        {t('Header.myCreations')}
                      </LocaleLink>
                      <LocaleLink
                        href="/credits"
                        className="p-2 hover:bg-accent rounded-md transition-colors"
                      >
                        {t('Header.credits')}
                      </LocaleLink>
                      <LocaleLink
                        href="/settings"
                        className="p-2 hover:bg-accent rounded-md transition-colors"
                      >
                        {t('Header.settings')}
                      </LocaleLink>
                      <button
                        onClick={handleSignOut}
                        className="p-2 text-left text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                      >
                        {t('Common.logout')}
                      </button>
                    </div>
                  ) : (
                    <Button variant="outline" onClick={signInModal.onOpen}>
                      {t('Common.login')}
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

// Separate component to avoid hydration issues with credits
function CreditsDisplay() {
  const { balance } = useCredits();
  return <span>{balance?.availableCredits ?? 0}</span>;
}
