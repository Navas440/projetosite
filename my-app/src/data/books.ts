export interface Chapter {
  slug: string;
  title: string;
  excerpt: string;
}

export interface Book {
  slug: string;
  title: string;
  tagline: string;
  synopsis: string;
  cover?: string;
  gradient: string;
  progress: number;
  featured?: boolean;
  chapters: Chapter[];
}

export const books: Book[] = [
  {
    slug: "vexon",
    title: "Vexon",
    tagline: "O despertar das sombras",
    synopsis:
      "Vexon é um universo moldado por energia arcana, guerras silenciosas e poderes que desafiam o impossível. Cada facção luta por segredos proibidos, cada personagem carrega cicatrizes profundas, e cada destino pode alterar o curso da própria realidade.",
    cover: "/bg-vexon.jpg",
    gradient: "linear-gradient(135deg, #7a00ff, #ff003c)",
    progress: 70,
    featured: true,
    chapters: [
      {
        slug: "capitulo-1",
        title: "O Chamado das Trevas",
        excerpt:
          "Nas ruínas de Kaldrath, uma voz antiga desperta depois de séculos de silêncio, e ninguém que a ouve permanece o mesmo.",
      },
      {
        slug: "capitulo-2",
        title: "A Cidade Sem Luz",
        excerpt:
          "Entre becos onde a luz nunca chega, os primeiros seguidores de Vexon começam a se reunir sob um mesmo símbolo.",
      },
      {
        slug: "capitulo-3",
        title: "Pactos Proibidos",
        excerpt:
          "Um acordo selado em sangue arcano promete poder — mas todo pacto com as sombras cobra um preço maior do que o prometido.",
      },
    ],
  },
  {
    slug: "noctark",
    title: "Noctark",
    tagline: "O império que nunca dorme",
    synopsis:
      "No coração de Noctark, um império erguido sobre a noite eterna, a ambição e a lealdade se confundem. Enquanto tronos mudam de mãos nas sombras, uma guerra silenciosa decide o destino de todo um continente.",
    gradient: "linear-gradient(135deg, #1e1b4b, #a200ff)",
    progress: 40,
    chapters: [
      {
        slug: "capitulo-1",
        title: "O Trono de Cinzas",
        excerpt:
          "A coroa de Noctark pesa mais do que ouro — ela carrega o peso de todos que morreram para conquistá-la.",
      },
      {
        slug: "capitulo-2",
        title: "Sussurros na Corte",
        excerpt:
          "Nos corredores do palácio, alianças se formam e se quebram antes mesmo que o sol nasça — se é que ele ainda nasce em Noctark.",
      },
    ],
  },
  {
    slug: "cinzas-do-vazio",
    title: "Cinzas do Vazio",
    tagline: "Onde os deuses morreram",
    synopsis:
      "Depois da Grande Queda, o que restou dos deuses é pó e memória. Um grupo de sobreviventes atravessa terras estéreis em busca de respostas que talvez ninguém devesse encontrar.",
    gradient: "linear-gradient(135deg, #0a000f, #ff0040)",
    progress: 15,
    chapters: [
      {
        slug: "prologo",
        title: "Prólogo: As Cinzas Ainda Quentes",
        excerpt:
          "No dia em que os céus racharam, o mundo aprendeu que até os deuses podem morrer — e que alguém sempre herda os escombros.",
      },
    ],
  },
  {
    slug: "herdeiros-da-fenda",
    title: "Herdeiros da Fenda",
    tagline: "O sangue lembra o que a mente esquece",
    synopsis:
      "Uma fenda entre mundos conecta linhagens que jamais deveriam se cruzar. Os herdeiros dessa fenda carregam um poder que nem eles compreendem — e um perigo que os persegue de outra realidade.",
    gradient: "linear-gradient(135deg, #4c0519, #7a00ff)",
    progress: 5,
    chapters: [],
  },
];

export function getBookBySlug(slug: string): Book | undefined {
  return books.find((book) => book.slug === slug);
}

export function getFeaturedBook(): Book {
  return books.find((book) => book.featured) ?? books[0];
}
