import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { Geist_Mono, Manrope, Syne } from "next/font/google";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { AmbientBackground } from "@/components/effects/ambient-background";
import { PageTransition } from "@/components/providers/page-transition";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { routing } from "@/i18n/routing";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${syne.variable} ${manrope.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="relative min-h-full font-sans text-foreground">
        <AmbientBackground />
        <NextIntlClientProvider messages={messages}>
          <SmoothScroll>
            <PageTransition>{children}</PageTransition>
          </SmoothScroll>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
