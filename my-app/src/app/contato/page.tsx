export default function Contato() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 py-16 fade">
      <div className="w-full max-w-lg p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md
                      shadow-[0_0_25px_rgba(255,0,255,0.12)]">
        <h1 className="text-3xl font-bold text-center mb-2 neon-text">Contato</h1>
        <p className="text-gray-300 text-center mb-8">
          Dúvidas, parcerias ou só quer trocar uma ideia sobre o universo Vexon?
        </p>

        <form className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm text-gray-300">
              Nome
            </label>
            <input
              id="name"
              type="text"
              placeholder="Seu nome"
              className="px-4 py-3 rounded-lg bg-black/40 border border-fuchsia-500/40 text-white
                         placeholder:text-gray-500 focus:outline-none focus:border-fuchsia-400"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm text-gray-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              className="px-4 py-3 rounded-lg bg-black/40 border border-fuchsia-500/40 text-white
                         placeholder:text-gray-500 focus:outline-none focus:border-fuchsia-400"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="message" className="text-sm text-gray-300">
              Mensagem
            </label>
            <textarea
              id="message"
              rows={4}
              placeholder="Escreva sua mensagem..."
              className="px-4 py-3 rounded-lg bg-black/40 border border-fuchsia-500/40 text-white
                         placeholder:text-gray-500 focus:outline-none focus:border-fuchsia-400 resize-none"
            />
          </div>

          <button type="submit" className="vexon-btn mt-4">
            Enviar mensagem
          </button>
        </form>
      </div>
    </div>
  );
}
