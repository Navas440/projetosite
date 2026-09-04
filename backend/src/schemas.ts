import { z } from "zod";

export const cadastroSchema = z.object({
  nome: z.string().trim().min(2, "Nome muito curto").max(50, "Nome muito longo"),
  email: z.string().trim().toLowerCase().email(),
  senha: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  senha: z.string().min(1, "Preencha todos os campos"),
});

export const bioSchema = z.object({
  bio: z.string().trim().max(500, "Bio muito longa"),
});

export const comentarioSchema = z.object({
  texto: z.string().trim().min(1, "Comentário vazio").max(2000, "Comentário muito longo"),
});

export const livroSchema = z.object({
  slug: z.string().trim().min(1),
  title: z.string().trim().min(1),
  tagline: z.string().trim().min(1),
  synopsis: z.string().trim().min(1),
  gradient: z.string().trim().min(1),
  progress: z.number().int().min(0).max(100),
  featured: z.boolean().optional(),
});

export const livroEditSchema = livroSchema.omit({ slug: true });

export const capituloSchema = z.object({
  slug: z.string().trim().min(1),
  title: z.string().trim().min(1),
  excerpt: z.string().trim().min(1),
});

export const capituloEditSchema = z.object({
  title: z.string().trim().min(1),
  excerpt: z.string().trim().min(1),
  content: z.string().max(200_000),
});
