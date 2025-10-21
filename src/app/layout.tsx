import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/NavBar/NavBar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "GoblinMaster",
  description: "Asistente de juego para Pathfinder - Proyecto Final UTN",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{ background: "var(--bg)" }}>
          <Navbar />
          <main className="container" style={{ paddingBlock: 24 }}>
            {children}
          </main>
          <Footer />
      </body>
    </html>
  );
}
