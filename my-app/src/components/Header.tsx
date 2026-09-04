import Link from "next/link";
import AuthStatus from "./AuthStatus";

const navItems = [
  { name: "Início", href: "/" },
  { name: "Livros", href: "/livros" },
  { name: "Blog", href: "/blog" },
  { name: "Wiki", href: "/wiki" },
  { name: "Comunidade", href: "/comunidade" },
  { name: "Sobre", href: "/sobre" },
  { name: "Contato", href: "/contato" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full py-4 px-6 md:px-10 bg-black/60 backdrop-blur-xl
                        border-b border-fuchsia-500/40 overflow-hidden">
      <div className="energy-particles pointer-events-none"></div>
      <div className="scanline pointer-events-none"></div>

      <div className="flex flex-wrap items-center justify-between gap-4 w-full relative z-10">
        <Link href="/">
          <h1 className="text-2xl font-extrabold tracking-widest neon-text drop-shadow-[0_0_20px_#ff00ff]">
            VEXON
          </h1>
        </Link>

        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm md:text-base font-medium order-3 w-full md:order-none md:w-auto">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href} className="relative group">
              <span className="neon-text transition-all duration-300 group-hover:text-fuchsia-300">
                {item.name}
              </span>
              <span className="absolute left-0 bottom-[-4px] w-0 h-[2px] bg-fuchsia-500
                                group-hover:w-full transition-all duration-300 shadow-[0_0_10px_#ff00ff]" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <input
            type="search"
            placeholder="Buscar..."
            aria-label="Buscar"
            className="hidden sm:block w-36 md:w-48 px-3 py-2 rounded-lg bg-black/40 border
                       border-fuchsia-500/40 text-sm text-white placeholder:text-gray-500
                       focus:outline-none focus:border-fuchsia-400"
          />

          <AuthStatus />
        </div>
      </div>
    </header>
  );
}
