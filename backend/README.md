# Backend (Vexon)

API em Express + TypeScript + Prisma (Postgres/Neon).

## Segurança

Este projeto foi construído com atenção deliberada a práticas de segurança comuns em aplicações web com autenticação.

**Autenticação**
- Senhas com argon2id + pepper, não apenas hash simples.
- JWT emitido no login e guardado num cookie httpOnly, secure (em produção) e sameSite=strict, nunca em localStorage. Isso remove o token do alcance de JavaScript, mitigando roubo de sessão via XSS.

**CORS**
- Origem restrita à URL exata do frontend (via variável de ambiente), com credentials habilitado. Nenhuma rota aceita requisições de qualquer origem.

**CSRF**
- Proteção via padrão double submit cookie (csrf-csrf), aplicada especificamente nas rotas que criam dados (`POST /admin/livros` e `POST /admin/livros/:slug/capitulos`).
- Escopo definido de forma consciente: login, cadastro e logout ficaram fora da proteção porque forjar essas ações tem impacto baixo ou nulo; criar conteúdo é a ação que teria valor real para um atacante.

**Rate limiting**
- `/cadastro` e `/login` limitados a 10 tentativas/hora por IP.

**Configuração**
- Segredos (`JWT_SECRET`, `PASSWORD_PEPPER`, `CSRF_SECRET`) são validados na inicialização do servidor. Se algum estiver ausente ou fora do padrão esperado, o processo recusa subir com uma mensagem de erro clara, em vez de rodar silenciosamente com configuração insegura.

**Tratamento de erros**
- O middleware de autenticação distingue falha real de token (401) de qualquer outro erro, como indisponibilidade do banco de dados (500), evitando mascarar problemas de infraestrutura como tentativa de acesso não autorizado.

### Por que `/login`, `/cadastro` e `/logout` não têm proteção CSRF

Proteção CSRF existe para impedir que uma ação com efeito real aconteça sem a intenção do usuário. As três rotas de fora do escopo têm impacto baixo ou nulo se forjadas:

- **Login CSRF** (forçar alguém a logar numa conta que o atacante controla) é um risco conhecido, mas de impacto baixo neste app — não expõe nem corrompe dados do usuário que sofreu o ataque.
- **Logout CSRF** não causa dano nenhum além de deslogar a vítima.
- **Cadastro CSRF** só cria uma conta nova; não afeta dados de terceiros.

Já **criar livro/capítulo** é a ação que teria valor real para um atacante (poluir o conteúdo do site usando a sessão do admin), e é onde a proteção CSRF realmente importa — por isso o escopo ficou limitado a essas rotas.
