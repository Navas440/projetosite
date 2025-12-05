export default function Home() {
  return (
    <div className="text-center mt-20 fade">
      <h2 className="text-5xl font-bold mb-6 tracking-wide neon float">
        Universo Vexon
      </h2>

      <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
        Mergulhe no cosmos sombrio e arcano de <strong>Vexon</strong>.  
        Descubra segredos antigos, forças proibidas e destinos entrelaçados.
      </p>

      <div className="flex justify-center gap-6 mt-10">
        <a
          href="/livros"
          className="bg-[var(--accent-red)] glow-hover px-8 py-3 rounded-lg font-semibold transition"
        >
          Ler os Livros
        </a>

        <a
          href="/wiki"
          className="border border-[var(--accent-magenta)] px-8 py-3 rounded-lg font-semibold glow-hover transition"
        >
          Wiki do Universo
        </a>
      </div>

      <section className="mt-24 max-w-4xl mx-auto text-left fade">
        <h3 className="text-3xl font-bold mb-4 neon">Sobre Vexon</h3>
        <p className="text-gray-300 leading-relaxed text-lg">
          Vexon é um universo marcado por energia arcana e forças ancestrais.
          Cada facção disputa segredos proibidos, cada personagem carrega
          cicatrizes do impossível, e o próprio destino pode ser redesenhado.
        </p>
      </section>
    </div>
  );
}
