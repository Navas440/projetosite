export default function Cadastro() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 fade">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md
                      shadow-[0_0_25px_rgba(255,0,255,0.12)]">
        <h1 className="text-3xl font-bold text-center mb-2 neon-text">Cadastro</h1>
        <p className="text-gray-300 text-center mb-8">
          Junte-se ao <strong className="vexon-subtitle-vexon">Universo Vexon</strong>
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
            <label htmlFor="password" className="text-sm text-gray-300">
              Senha
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="px-4 py-3 rounded-lg bg-black/40 border border-fuchsia-500/40 text-white
                         placeholder:text-gray-500 focus:outline-none focus:border-fuchsia-400"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="confirmPassword" className="text-sm text-gray-300">
              Confirmar senha
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              className="px-4 py-3 rounded-lg bg-black/40 border border-fuchsia-500/40 text-white
                         placeholder:text-gray-500 focus:outline-none focus:border-fuchsia-400"
            />
          </div>

          <button type="submit" className="vexon-btn mt-4">
            Criar conta
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Já tem uma conta?{" "}
          <a href="/login" className="text-fuchsia-400 hover:text-fuchsia-300">
            Entrar
          </a>
        </p>
      </div>
    </div>
  );
}
