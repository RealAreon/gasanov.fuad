import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/header";
import { Contact } from "@/components/sections/contact";
import { Hero } from "@/components/sections/hero";
import { Skills } from "@/components/sections/skills";
import { Works } from "@/components/sections/works";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Header />
      <main className="relative flex-1">
        <Hero />
        <Skills />
        <Works />
        <Contact />
      </main>
    </>
  );
}
