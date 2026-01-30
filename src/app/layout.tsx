import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/NavBar/NavBar";
import Footer from "@/components/Footer";
import AuthHydration from "@/components/AuthHydration";

export const metadata: Metadata = {
  title: "GoblinMaster",
  description: "Asistente de juego para Pathfinder - Proyecto Final UTN",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{ backgroundColor: "rgba(255,255,255,0.85)"}}>
          <AuthHydration />
          <Navbar />
          <main className="    bg-[var(--olive-100)]
    rounded-lg
    p-6
    my-6
    mx-4
    sm:mx-6
    md:mx-8
    lg:container lg:mx-auto
  ">
            {children}
          </main>
          <Footer />
      </body>
    </html>
  );
}
