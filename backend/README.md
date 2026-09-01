# Backend (Vexon)

API em Express + TypeScript + Prisma (Postgres/Neon).

## Segurança

- Senhas: hash com Argon2id, com um "pepper" (HMAC-SHA256 com segredo do `.env`) aplicado antes do hash.
- Autenticação: JWT num cookie `httpOnly + sameSite=strict` (+ `secure` em produção). O JavaScript do navegador nunca tem acesso ao token.
- Rate limiting em `/cadastro` e `/login` (10 tentativas/hora por IP).
- CSRF: rotas que criam dados de verdade (`POST /admin/livros`, `POST /admin/livros/:slug/capitulos`) exigem um token CSRF (`csrf-csrf`, double-submit) além do cookie de sessão.

### Por que `/login`, `/cadastro` e `/logout` não têm proteção CSRF

Proteção CSRF existe para impedir que uma ação com efeito real aconteça sem a intenção do usuário. As três rotas de fora do escopo têm impacto baixo ou nulo se forjadas:

- **Login CSRF** (forçar alguém a logar numa conta que o atacante controla) é um risco conhecido, mas de impacto baixo neste app — não expõe nem corrompe dados do usuário que sofreu o ataque.
- **Logout CSRF** não causa dano nenhum além de deslogar a vítima.
- **Cadastro CSRF** só cria uma conta nova; não afeta dados de terceiros.

Já **criar livro/capítulo** é a ação que teria valor real para um atacante (poluir o conteúdo do site usando a sessão do admin), e é onde a proteção CSRF realmente importa — por isso o escopo ficou limitado a essas rotas.
