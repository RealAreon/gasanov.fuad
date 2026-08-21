export const siteConfig = {
  name: "Fuad Gasanov",
  email: "areon.softer@gmail.com",
};

export const navLinks = [
  { key: "stack" as const, href: "#stack" },
  { key: "works" as const, href: "#works" },
  { key: "contact" as const, href: "#contact" },
];

export const skills = [
  { name: "React", category: "Frontend" as const },
  { name: "Next.js", category: "Frontend" as const },
  { name: "TypeScript", category: "Frontend" as const },
  { name: "Tailwind CSS", category: "Frontend" as const },
  { name: "Framer Motion", category: "Motion" as const },
  { name: "Figma", category: "Design" as const },
  { name: "UI/UX", category: "Design" as const },
  { name: "Design Systems", category: "Design" as const },
  { name: "Vibe-Coding", category: "Craft" as const },
  { name: "GSAP", category: "Motion" as const },
  { name: "Zustand", category: "Frontend" as const },
  { name: "Supabase", category: "Backend" as const },
];

export type ProjectId =
  | "abc-car-wash"
  | "agenciy"
  | "clipcut"
  | "grovia"
  | "halo"
  | "portfolite"
  | "xtract";

export type Project = {
  id: ProjectId;
  year: string;
  tags: string[];
  accent: string;
  span: string;
  image: string;
  screens: [string, string, string];
};

function projectScreens(id: ProjectId): [string, string, string] {
  return [
    `/works/${id}/shot-1.png`,
    `/works/${id}/shot-2.png`,
    `/works/${id}/shot-3.png`,
  ];
}

export const projects: Project[] = [
  {
    id: "halo",
    year: "2025",
    tags: ["Framer", "Portfolio", "Motion"],
    accent: "#5EEAD4",
    span: "md:col-span-2 md:row-span-2",
    image: "/works/halo/shot-1.png",
    screens: projectScreens("halo"),
  },
  {
    id: "xtract",
    year: "2025",
    tags: ["AI", "SaaS", "Agency"],
    accent: "#A78BFA",
    span: "md:col-span-1 md:row-span-1",
    image: "/works/xtract/shot-1.png",
    screens: projectScreens("xtract"),
  },
  {
    id: "clipcut",
    year: "2025",
    tags: ["Video", "Agency", "Landing"],
    accent: "#F472B6",
    span: "md:col-span-1 md:row-span-1",
    image: "/works/clipcut/shot-1.png",
    screens: projectScreens("clipcut"),
  },
  {
    id: "abc-car-wash",
    year: "2024",
    tags: ["Luxury", "Service", "UX"],
    accent: "#38BDF8",
    span: "md:col-span-1 md:row-span-1",
    image: "/works/abc-car-wash/shot-1.png",
    screens: projectScreens("abc-car-wash"),
  },
  {
    id: "agenciy",
    year: "2024",
    tags: ["Agency", "Brand", "UI"],
    accent: "#FBBF24",
    span: "md:col-span-1 md:row-span-1",
    image: "/works/agenciy/shot-1.png",
    screens: projectScreens("agenciy"),
  },
  {
    id: "grovia",
    year: "2024",
    tags: ["Growth", "Landing", "Product"],
    accent: "#34D399",
    span: "md:col-span-1 md:row-span-1",
    image: "/works/grovia/shot-1.png",
    screens: projectScreens("grovia"),
  },
  {
    id: "portfolite",
    year: "2024",
    tags: ["Portfolio", "Framer", "Personal"],
    accent: "#FB7185",
    span: "md:col-span-2 md:row-span-1",
    image: "/works/portfolite/shot-1.png",
    screens: projectScreens("portfolite"),
  },
];

export const socials = [
  {
    key: "email" as const,
    href: "mailto:areon.softer@gmail.com",
    handle: "areon.softer@gmail.com",
  },
  {
    key: "telegram" as const,
    href: "https://t.me/m7dms",
    handle: "@m7dms",
  },
  {
    key: "instagram" as const,
    href: "https://instagram.com/gasanovvv.7777",
    handle: "@gasanovvv.7777",
  },
  {
    key: "facebook" as const,
    href: "https://www.facebook.com/gasanov.fuad",
    handle: "facebook.com/gasanov.fuad",
  },
];
