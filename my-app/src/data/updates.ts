export type UpdateCategory = "Bastidores" | "Capítulo Novo" | "Divulgação";

export interface Update {
  id: string;
  category: UpdateCategory;
  text: string;
  date: string;
}

export const updates: Update[] = [
  {
    id: "u1",
    category: "Capítulo Novo",
    text: "Capítulo 3 de Vexon, \"Pactos Proibidos\", foi publicado.",
    date: "2026-08-23",
  },
  {
    id: "u2",
    category: "Bastidores",
    text: "Novos esboços da capa de Vexon foram compartilhados no post de bastidores.",
    date: "2026-08-24",
  },
  {
    id: "u3",
    category: "Divulgação",
    text: "Pré-vendas de Vexon entram em fase de preparação.",
    date: "2026-08-20",
  },
  {
    id: "u4",
    category: "Bastidores",
    text: "Primeiras anotações de worldbuilding de Noctark foram reveladas.",
    date: "2026-08-16",
  },
  {
    id: "u5",
    category: "Divulgação",
    text: "Enquete da comunidade sobre spin-offs está aberta para votos.",
    date: "2026-08-12",
  },
  {
    id: "u6",
    category: "Capítulo Novo",
    text: "Prólogo de \"Cinzas do Vazio\" foi liberado para leitura.",
    date: "2026-07-30",
  },
];
