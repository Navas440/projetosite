# Backend (Vexon)

API em Express + TypeScript + Prisma (Postgres/Neon).

## Segurança

Este projeto foi construído com atenção deliberada a práticas de segurança comuns em aplicações web com autenticação.

**Autenticação**
- Senhas com argon2id + pepper, não apenas hash simples.
- Sessão em dois tokens, ambos em cookies httpOnly, secure (em produção) e sameSite=strict, nunca em localStorage: um access token JWT de vida curta (15 min), verificado a cada requisição autenticada, e um refresh token opaco de vida longa (30 dias), guardado no banco só como hash (`sha256`), nunca em texto puro. `/refresh` rotaciona o refresh token a cada uso (o antigo é revogado, um novo é emitido), e `/logout` marca o refresh token atual como revogado no banco, não só limpa o cookie — assim uma sessão específica pode ser derrubada sem esperar os 30 dias expirarem.
- Detecção de reuso de um refresh token já revogado (indício de roubo) fica fora do escopo desta versão: hoje isso só resulta num 401 genérico, sem revogar a "família" inteira de tokens daquela sessão. Isso também significa que duas abas renovando a sessão exatamente ao mesmo tempo podem gerar dois refresh tokens novos em vez de um (inofensivo — o token extra fica órfão e expira sozinho), já que o sistema hoje não distingue esse caso de um token realmente roubado sendo usado em paralelo.

**CORS**
- Origem restrita à URL exata do frontend (via variável de ambiente), com credentials habilitado. Nenhuma rota aceita requisições de qualquer origem.

**CSRF**
- Proteção via padrão double submit cookie (csrf-csrf), aplicada especificamente nas rotas que criam dados (`POST /admin/livros` e `POST /admin/livros/:slug/capitulos`).
- Escopo definido de forma consciente: login, cadastro e logout ficaram fora da proteção porque forjar essas ações tem impacto baixo ou nulo; criar conteúdo é a ação que teria valor real para um atacante.

**Rate limiting**
- `/cadastro` e `/login` limitados a 10 tentativas/hora por IP.

**Headers de segurança**
- Helmet aplica um conjunto de headers HTTP recomendados (CSP, X-Frame-Options, X-Content-Type-Options, HSTS, entre outros), reduzindo a superfície de ataques como clickjacking e MIME sniffing, com a configuração padrão do pacote.

**Configuração**
- Segredos (`JWT_SECRET`, `PASSWORD_PEPPER`, `CSRF_SECRET`) são validados na inicialização do servidor. Se algum estiver ausente ou fora do padrão esperado, o processo recusa subir com uma mensagem de erro clara, em vez de rodar silenciosamente com configuração insegura.

**Tratamento de erros**
- O middleware de autenticação distingue falha real de token (401) de qualquer outro erro, como indisponibilidade do banco de dados (500), evitando mascarar problemas de infraestrutura como tentativa de acesso não autorizado.

### Por que `/login`, `/cadastro`, `/logout` e `/refresh` não têm proteção CSRF

Proteção CSRF existe para impedir que uma ação com efeito real aconteça sem a intenção do usuário. Essas rotas têm impacto baixo ou nulo se forjadas:

- **Login CSRF** (forçar alguém a logar numa conta que o atacante controla) é um risco conhecido, mas de impacto baixo neste app — não expõe nem corrompe dados do usuário que sofreu o ataque.
- **Logout CSRF** não causa dano nenhum além de deslogar a vítima.
- **Cadastro CSRF** só cria uma conta nova; não afeta dados de terceiros.
- **Refresh CSRF** só rotaciona a sessão do próprio dono do cookie — não há benefício real para quem forja a chamada.

Já **criar livro/capítulo** é a ação que teria valor real para um atacante (poluir o conteúdo do site usando a sessão do admin), e é onde a proteção CSRF realmente importa — por isso o escopo ficou limitado a essas rotas.
