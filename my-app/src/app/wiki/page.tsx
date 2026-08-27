export default function Wiki() {
  return (
    <div className="relative min-h-screen px-6 md:px-16 py-16 fade">
      <h1 className="text-5xl font-bold neon mb-10 text-center">Wiki do Universo</h1>

      <section className="max-w-3xl mx-auto fade">
        <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md
                        shadow-[0_0_25px_rgba(255,0,255,0.12)] text-center">
          <h3 className="text-2xl font-bold mb-4 neon">Em construção</h3>
          <p className="text-gray-300 text-lg leading-relaxed">
            A wiki ainda está sendo compilada pelos arquivistas do universo. Novas entradas em breve.
          </p>
        </div>
      </section>
    </div>
  );
}
