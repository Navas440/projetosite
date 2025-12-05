export default function Home() {
  return (
    <div className="relative min-h-screen">

      {/* BACKDROP GRADIENT + TEXTURA */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,0,255,0.07),_transparent_70%)] opacity-60 pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none" />

      {/* HERO */}
      <section className="relative text-center mt-28 px-6 fade">

        {/* GLOW DE FUNDO */}
        <div className="absolute left-1/2 -translate-x-1/2 top-20 w-[550px] h-[550px]
                        bg-fuchsia-600/20 blur-[110px] rounded-full -z-10" />

        {/* TÍTULO COM GLITCH (usa data-text para pseudo elements) */}
        <h1
          className="text-6xl md:text-7xl font-bold tracking-wide text-white select-none
                     drop-shadow-[0_0_8px_rgba(255,0,255,0.28)] glitch"
          data-text="UNIVERSO VEXON"
        >
          UNIVERSO VEXON
        </h1>

        {/* SUBTÍTULO (mais destaque, mas suave) */}
        <p className="vexon-subtitle">
  Explore o cosmos sombrio e arcano de 
  <strong className="vexon-subtitle-vexon"> Vexon</strong>.
  Mistérios proibidos, forças esquecidas e destinos entrelaçados te aguardam.
</p>


       <div className="flex justify-center gap-8 mt-14">

  <a href="/livros" className="vexon-btn" aria-label="Ler os Livros">
    Ler os Livros
  </a>

  <a href="/wiki" className="vexon-btn" aria-label="Wiki do Universo">
    Wiki do Universo
  </a>

</div>


      </section>

      {/* SEÇÃO SOBRE */}
      <section className="mt-32 max-w-5xl mx-auto px-6 fade">
        <h3 className="text-4xl font-bold mb-6 neon">Sobre Vexon</h3>

        <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md
                        shadow-[0_0_25px_rgba(255,0,255,0.12)]">
          <p className="text-gray-300 text-lg leading-relaxed">
            Vexon é um universo moldado por energia arcana, guerras silenciosas e poderes
            que desafiam o impossível. Cada facção luta por segredos proibidos, cada
            personagem carrega cicatrizes profundas, e cada destino pode alterar o curso
            da própria realidade.
          </p>
        </div>
      </section>
    </div>
  );
}
