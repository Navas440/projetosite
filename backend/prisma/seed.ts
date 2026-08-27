import { prisma } from "../src/db";

const livros = [
  {
    slug: "vexon",
    title: "Vexon",
    tagline: "O despertar das sombras",
    synopsis:
      "Vexon é um universo moldado por energia arcana, guerras silenciosas e poderes que desafiam o impossível. Cada facção luta por segredos proibidos, cada personagem carrega cicatrizes profundas, e cada destino pode alterar o curso da própria realidade.",
    gradient: "linear-gradient(135deg, #7a00ff, #ff003c)",
    progress: 70,
    featured: true,
  },
  {
    slug: "noctark",
    title: "Noctark",
    tagline: "O império que nunca dorme",
    synopsis:
      "No coração de Noctark, um império erguido sobre a noite eterna, a ambição e a lealdade se confundem. Enquanto tronos mudam de mãos nas sombras, uma guerra silenciosa decide o destino de todo um continente.",
    gradient: "linear-gradient(135deg, #1e1b4b, #a200ff)",
    progress: 40,
    featured: false,
  },
  {
    slug: "cinzas-do-vazio",
    title: "Cinzas do Vazio",
    tagline: "Onde os deuses morreram",
    synopsis:
      "Depois da Grande Queda, o que restou dos deuses é pó e memória. Um grupo de sobreviventes atravessa terras estéreis em busca de respostas que talvez ninguém devesse encontrar.",
    gradient: "linear-gradient(135deg, #0a000f, #ff0040)",
    progress: 15,
    featured: false,
  },
  {
    slug: "herdeiros-da-fenda",
    title: "Herdeiros da Fenda",
    tagline: "O sangue lembra o que a mente esquece",
    synopsis:
      "Uma fenda entre mundos conecta linhagens que jamais deveriam se cruzar. Os herdeiros dessa fenda carregam um poder que nem eles compreendem — e um perigo que os persegue de outra realidade.",
    gradient: "linear-gradient(135deg, #4c0519, #7a00ff)",
    progress: 5,
    featured: false,
  },
];

async function main() {
  for (const livro of livros) {
    await prisma.livro.upsert({
      where: { slug: livro.slug },
      update: livro,
      create: livro,
    });
  }
  console.log(`Seed concluído: ${livros.length} livros.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
