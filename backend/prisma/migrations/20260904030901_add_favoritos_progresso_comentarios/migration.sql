-- DropForeignKey
ALTER TABLE "Capitulo" DROP CONSTRAINT "Capitulo_livroId_fkey";

-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_usuarioId_fkey";

-- AlterTable
ALTER TABLE "Capitulo" ADD COLUMN     "content" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Livro" ADD COLUMN     "capaUrl" TEXT;

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "bio" TEXT;

-- CreateTable
CREATE TABLE "Favorito" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "livroId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeituraCapitulo" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "capituloId" INTEGER NOT NULL,
    "lidoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeituraCapitulo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comentario" (
    "id" SERIAL NOT NULL,
    "texto" TEXT NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "capituloId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comentario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Favorito_livroId_idx" ON "Favorito"("livroId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorito_usuarioId_livroId_key" ON "Favorito"("usuarioId", "livroId");

-- CreateIndex
CREATE INDEX "LeituraCapitulo_capituloId_idx" ON "LeituraCapitulo"("capituloId");

-- CreateIndex
CREATE UNIQUE INDEX "LeituraCapitulo_usuarioId_capituloId_key" ON "LeituraCapitulo"("usuarioId", "capituloId");

-- CreateIndex
CREATE INDEX "Comentario_capituloId_idx" ON "Comentario"("capituloId");

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Capitulo" ADD CONSTRAINT "Capitulo_livroId_fkey" FOREIGN KEY ("livroId") REFERENCES "Livro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorito" ADD CONSTRAINT "Favorito_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorito" ADD CONSTRAINT "Favorito_livroId_fkey" FOREIGN KEY ("livroId") REFERENCES "Livro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeituraCapitulo" ADD CONSTRAINT "LeituraCapitulo_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeituraCapitulo" ADD CONSTRAINT "LeituraCapitulo_capituloId_fkey" FOREIGN KEY ("capituloId") REFERENCES "Capitulo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_capituloId_fkey" FOREIGN KEY ("capituloId") REFERENCES "Capitulo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
