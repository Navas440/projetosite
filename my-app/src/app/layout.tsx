import React from "react";
import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Vexon Universe",
  description: "Portal oficial do universo de Vexon e Noctark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body
        className="bg-black text-white"
        style={{
          backgroundImage: "url('/bg-vexon.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        {/* HEADER */}
        <header className="relative w-full py-6 px-10 bg-black/40 backdrop-blur-xl border-b border-fuchsia-500/40 overflow-hidden">

          {/* Partículas energéticas */}
          <div className="energy-particles pointer-events-none"></div>

          {/* Scanline */}
          <div className="scanline pointer-events-none"></div>

          {/* CONTAINER DO HEADER */}
          <div className="flex items-center justify-between w-full relative z-10">

            {/* LOGO */}
            <h1 className="text-3xl font-extrabold tracking-widest neon-text drop-shadow-[0_0_20px_#ff00ff]">
              VEXON
            </h1>

            {/* MENU CENTRAL */}
            <nav className="flex gap-12 text-xl font-medium">
              {[
                { name: "Início", href: "/" },
                { name: "Livros", href: "/livros" },
                { name: "Wiki", href: "/wiki" },
                { name: "Comunidade", href: "/comunidade" },
              ].map((item) => (
                <Link key={item.name} href={item.href} className="relative group">
                  <span className="neon-text transition-all duration-300 group-hover:text-fuchsia-300">
                    {item.name}
                  </span>

                  {/* Linha neon */}
                  <span className="
                    absolute left-0 bottom-[-4px] w-0 h-[2px]
                    bg-fuchsia-500 group-hover:w-full
                    transition-all duration-300
                    shadow-[0_0_10px_#ff00ff]
                  "></span>
                </Link>
              ))}
            </nav>

            {/* LOGIN / CADASTRO */}
            <div className="flex items-center gap-8 text-xl">

              <Link href="/login"
                className="
                  px-5 py-2 rounded-lg
                  border border-fuchsia-500/60 
                  bg-black/40 backdrop-blur-sm
                  hover:bg-fuchsia-600 hover:border-fuchsia-300
                  transition-all duration-300 neon-text
                  shadow-[0_0_20px_#ff00ff]
                ">
                  Login
              </Link>

              <Link
                href="/cadastro"
                className="
                  px-5 py-2 rounded-lg
                  border border-fuchsia-500/60 
                  bg-black/40 backdrop-blur-sm
                  hover:bg-fuchsia-600 hover:border-fuchsia-300
                  transition-all duration-300 neon-text
                  shadow-[0_0_20px_#ff00ff]
                "
              >
                Cadastro
              </Link>

            </div>
          </div>
        </header>

        {/* CONTEÚDO PRINCIPAL */}
        <main className="p-8">{children}</main>

      </body>
    </html>
  );
}
