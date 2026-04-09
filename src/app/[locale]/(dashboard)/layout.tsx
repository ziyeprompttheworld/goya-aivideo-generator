import { notFound } from "next/navigation";

import { requireAuth } from "@/lib/auth";
import { HeaderSimple } from "@/components/layout/header-simple";
import { Sidebar } from "@/components/layout/sidebar";
import { UpgradeModal } from "@/components/upgrade/upgrade-modal";
import { i18n } from "@/config/i18n-config";

interface DashboardLayoutProps {
  children?: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const { locale } = await params;
  const user = await requireAuth(`/${locale}/login`);

  return (
    <div className="min-h-screen bg-black font-plex-mono">
      <HeaderSimple
        user={{
          name: user.name,
          image: user.image,
          email: user.email,
        }}
        lang={locale}
      />

      <div className="flex h-[calc(100vh-56px)]">
        {/* Left Sidebar */}
        <Sidebar lang={locale} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-black">
          <div className="p-8">{children}</div>
        </main>
      </div>

      {/* 全局升级弹窗 */}
      <UpgradeModal />
    </div>
  );
}
