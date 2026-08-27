import Link from "next/link";

const socialLinks = [
  { name: "Instagram", href: "#" },
  { name: "Twitter/X", href: "#" },
  { name: "Discord", href: "#" },
];

const institutionalLinks = [
  { name: "Sobre", href: "/sobre" },
  { name: "Contato", href: "/contato" },
  { name: "Blog", href: "/blog" },
  { name: "Livros", href: "/livros" },
];

export default function Footer() {
  return (
    <footer className="relative mt-32 border-t border-fuchsia-500/30 bg-black/60 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 py-14 grid gap-10 md:grid-cols-3">
        <div>
          <h3 className="text-xl font-extrabold neon-text tracking-widest">VEXON</h3>
          <p className="text-sm text-gray-400 mt-3 leading-relaxed">
            Portal oficial do universo de Vexon e Noctark. Histórias, bastidores e lore de um
            mundo moldado por energia arcana.
          </p>
          <div className="flex gap-4 mt-5">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                className="text-sm px-3 py-1.5 rounded-lg border border-fuchsia-500/40 text-gray-300
                           hover:text-fuchsia-300 hover:border-fuchsia-300 transition-colors"
              >
                {social.name}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-4">
            Institucional
          </h4>
          <ul className="flex flex-col gap-2">
            {institutionalLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className="text-sm text-gray-400 hover:text-fuchsia-300">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-4">
            Newsletter
          </h4>
          <p className="text-sm text-gray-400 mb-4">
            Receba novidades sobre lançamentos e capítulos novos.
          </p>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="seu@email.com"
              aria-label="Email para newsletter"
              className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-black/40 border border-fuchsia-500/40
                         text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-fuchsia-400"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white shrink-0"
              style={{ background: "linear-gradient(135deg, #7a00ff, #ff003c)" }}
            >
              Assinar
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Universo Vexon. Todos os direitos reservados.
      </div>
    </footer>
  );
}
