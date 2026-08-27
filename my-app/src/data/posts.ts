export type PostCategory = "Bastidores" | "Capítulo Novo" | "Divulgação" | "Lore";

export interface Post {
  slug: string;
  title: string;
  category: PostCategory;
  date: string;
  gradient: string;
  excerpt: string;
  content: string;
}

export const posts: Post[] = [
  {
    slug: "bastidores-capa-vexon",
    title: "Bastidores da capa de Vexon",
    category: "Bastidores",
    date: "2026-08-24",
    gradient: "linear-gradient(135deg, #ff003c, #7a00ff)",
    excerpt: "Como nasceu a arte da capa que estampa o universo de Vexon.",
    content:
      "A capa de Vexon passou por mais de dez versões antes da arte final. Cada rascunho tentava capturar a mesma sensação: poder antigo escondido sob uma camada de escuridão. Neste post, mostramos os primeiros esboços e como o roxo e o magenta se tornaram a assinatura visual do universo.",
  },
  {
    slug: "capitulo-3-disponivel",
    title: "Capítulo 3 de Vexon já está disponível!",
    category: "Capítulo Novo",
    date: "2026-08-23",
    gradient: "linear-gradient(135deg, #c800ff, #ff0040)",
    excerpt: "\"Pactos Proibidos\" chegou — e o preço cobrado é alto.",
    content:
      "O terceiro capítulo de Vexon já pode ser lido na página do livro. Pactos são selados, alianças são testadas, e o universo começa a revelar quem realmente está no controle das sombras.",
  },
  {
    slug: "vexon-pre-vendas",
    title: "Vexon chega às pré-vendas em breve",
    category: "Divulgação",
    date: "2026-08-20",
    gradient: "linear-gradient(135deg, #8b00ff, #ff00ff)",
    excerpt: "A primeira etapa da publicação oficial está próxima.",
    content:
      "Com 70% do primeiro volume concluído, os preparativos para a pré-venda de Vexon já começaram. Detalhes sobre datas e edições especiais serão anunciados nas próximas semanas — fique de olho nas atualizações.",
  },
  {
    slug: "origens-noctark",
    title: "As origens de Noctark: primeiras anotações",
    category: "Bastidores",
    date: "2026-08-16",
    gradient: "linear-gradient(135deg, #1e1b4b, #a200ff)",
    excerpt: "Um vislumbre das anotações originais que deram vida ao império.",
    content:
      "Antes de se tornar um império inteiro, Noctark era apenas uma anotação de margem: 'um lugar onde a noite nunca termina'. Compartilhamos aqui os primeiros rascunhos de worldbuilding que evoluíram para o livro atual.",
  },
  {
    slug: "enquete-spin-off",
    title: "Enquete: qual personagem merece um spin-off?",
    category: "Divulgação",
    date: "2026-08-12",
    gradient: "linear-gradient(135deg, #ff0040, #c800ff)",
    excerpt: "A comunidade vai ajudar a decidir o próximo projeto.",
    content:
      "Recebemos muitos pedidos para explorar personagens secundários do universo Vexon. Abrimos uma enquete para a comunidade escolher qual deles merece uma história própria.",
  },
  {
    slug: "novo-mapa-universo",
    title: "Novo mapa do universo Vexon revelado",
    category: "Lore",
    date: "2026-08-08",
    gradient: "linear-gradient(135deg, #7a00ff, #0a000f)",
    excerpt: "As fronteiras entre os reinos finalmente ganham forma visual.",
    content:
      "Depois de meses de worldbuilding, o mapa oficial que conecta Vexon, Noctark e os territórios do Vazio está pronto. Ele vai acompanhar as próximas edições e ajudar a situar cada nova história dentro do universo.",
  },
];

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}
