export default function Sobre() {
  return (
    <div className="relative min-h-screen px-6 md:px-16 py-16 fade">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-5xl font-bold neon mb-8">Sobre Vexon</h1>

        <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md
                        shadow-[0_0_25px_rgba(255,0,255,0.12)] text-left">
          <p className="text-gray-300 text-lg leading-relaxed">
            Vexon é um universo moldado por energia arcana, guerras silenciosas e poderes que
            desafiam o impossível. Cada facção luta por segredos proibidos, cada personagem
            carrega cicatrizes profundas, e cada destino pode alterar o curso da própria
            realidade.
          </p>
          <p className="text-gray-300 text-lg leading-relaxed mt-4">
            Este portal reúne os livros, o blog de bastidores e as atualizações de todo o
            universo — de Vexon a Noctark — enquanto as histórias são escritas.
          </p>
        </div>
      </div>
    </div>
  );
}
