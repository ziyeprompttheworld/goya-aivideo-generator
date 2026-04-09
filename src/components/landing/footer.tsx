"use client";

import { Heart } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

import { cn } from "@/components/ui";
import { LocaleLink } from "@/i18n/navigation";

export function LandingFooter() {
  const t = useTranslations('Footer');
  const locale = useLocale();
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: t('product'),
      links: [
        { title: "Image to Video", href: "/image-to-video" },
        { title: "Text to Video", href: "/text-to-video" },
        { title: "Reference to Video", href: "/reference-to-video" },
        { title: "Pricing", href: "/pricing" },
      ],
    },
    // {
    //   title: t('company'),
    //   links: [
    //     { title: "About", href: "/about" },
    //     { title: "Blog", href: "/blog" },
    //     { title: "Careers", href: "/careers" },
    //     { title: "Contact", href: "/contact" },
    //   ],
    // },
    {
      title: t('legal'),
      links: [
        { title: t('privacy'), href: "/privacy" },
        { title: t('terms'), href: "/terms" },
        // { title: t('cookie'), href: "/cookies" },
      ],
    },
  ];


  return (
    <footer className="border-t border-white/10 bg-black font-plex-mono text-white/50">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <LocaleLink
              href="/"
              className="flex items-center gap-2 text-[13px] font-normal tracking-[0.05em] text-white hover:text-white/80 transition-colors mb-4 lowercase"
            >
              goya.
            </LocaleLink>
            <p className="text-[11px] font-light tracking-[0.1em] text-white/40 mb-4 lowercase">
              make moving images.
            </p>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-[11px] font-light text-white/60 mb-4 lowercase tracking-[0.1em]">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.title}>
                    <LocaleLink
                      href={link.href}
                      className="text-[11px] font-light text-white/30 hover:text-white/80 transition-colors lowercase tracking-[0.05em]"
                    >
                      {link.title}
                    </LocaleLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-white/10">
          <p className="text-[10px] font-light text-white/30 lowercase tracking-[0.05em]">
            {t('copyright', { year: currentYear })}
          </p>
          <p className="text-[10px] font-light text-white/30 flex items-center gap-1 lowercase tracking-[0.05em]">
            made with
            <Heart className="h-3 w-3 text-[#008fff]" />
            by goya.ai
          </p>
        </div>
      </div>
    </footer>
  );
}
