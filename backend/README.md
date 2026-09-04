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
- Proteção via padrão double submit cookie (csrf-csrf). Regra geral: toda rota autenticada que modifica dados reais exige CSRF — isso cobre tanto as rotas administrativas (`/admin/livros*`, upload de capa) quanto as rotas de leitor logado (favoritar, marcar capítulo como lido, editar bio, comentar, apagar o próprio comentário). Só ficam isentas as rotas de ciclo de vida da sessão em si (`/login`, `/cadastro`, `/logout`, `/refresh`), pelos motivos abaixo.

**Rate limiting**
- `/login` limitado a 10 tentativas/hora por IP e `/cadastro` a 5/hora, em buckets independentes — tentativas de um não consomem o limite do outro.
- Rotas autenticadas (editar bio, favoritar/desfavoritar, marcar/desmarcar progresso, comentar) usam limite por `usuario.id`, não por IP — rate limit por IP não faz sentido pra escrita autenticada (um usuário legítimo numa rede compartilhada pode ser bloqueado por outros, e o mesmo usuário trocando de rede escapa do limite).

**Upload de capa (Cloudflare R2)**
- Opcional: sem as variáveis `R2_*` configuradas, `POST /admin/livros/:slug/capa` responde `503` em vez de impedir o resto do servidor de subir.
- Validação real do arquivo: o tipo é detectado pelos bytes do próprio arquivo (`file-type`), nunca pelo `Content-Type` declarado no upload (falsificável) nem pela extensão do nome do arquivo enviado (também é entrada do usuário). SVG fica de fora da lista de tipos aceitos — pode conter script embutido, é um vetor clássico de XSS.
- Limitação conhecida: trocar ou apagar a capa não remove o objeto antigo do bucket (lixo órfão, inofensivo).

**Exclusão em cascata**
- Excluir um livro ou capítulo pelo painel admin é imediato e real (sem soft-delete): remove junto favoritos, progresso de leitura e comentários que apontam pra ele. Editar o slug de um livro/capítulo já criado não é permitido — evita quebrar URLs publicadas; favoritos/progresso/comentários já são seguros porque apontam pro `id`, não pro slug.

**Headers de segurança**
- Helmet aplica um conjunto de headers HTTP recomendados (CSP, X-Frame-Options, X-Content-Type-Options, HSTS, entre outros), reduzindo a superfície de ataques como clickjacking e MIME sniffing, com a configuração padrão do pacote.

**Configuração**
- Segredos (`JWT_SECRET`, `PASSWORD_PEPPER`, `CSRF_SECRET`) são validados na inicialização do servidor. Se algum estiver ausente ou fora do padrão esperado, o processo recusa subir com uma mensagem de erro clara, em vez de rodar silenciosamente com configuração insegura.

**Tratamento de erros**
- O middleware de autenticação distingue falha real de token (401) de qualquer outro erro, como indisponibilidade do banco de dados (500), evitando mascarar problemas de infraestrutura como tentativa de acesso não autorizado.

**Validação de entrada**
- Toda rota de escrita valida o corpo da requisição com `zod` (`src/schemas.ts` + middleware `validate` em `src/validate.ts`), em vez de checagens manuais de campo — inclui limites de tamanho (nome do usuário, bio, texto de comentário) que fecham lacunas óbvias de abuso (nome enorme, comentário de tamanho arbitrário).
- Email é normalizado (`trim` + minúsculas) no cadastro e no login — Postgres compara `String @unique` com case-sensitivity por padrão, então sem essa normalização `User@x.com` e `user@x.com` virariam contas distintas.

### Por que `/login`, `/cadastro`, `/logout` e `/refresh` não têm proteção CSRF

Proteção CSRF existe para impedir que uma ação com efeito real aconteça sem a intenção do usuário. Essas rotas têm impacto baixo ou nulo se forjadas:

- **Login CSRF** (forçar alguém a logar numa conta que o atacante controla) é um risco conhecido, mas de impacto baixo neste app — não expõe nem corrompe dados do usuário que sofreu o ataque.
- **Logout CSRF** não causa dano nenhum além de deslogar a vítima.
- **Cadastro CSRF** só cria uma conta nova; não afeta dados de terceiros.
- **Refresh CSRF** só rotaciona a sessão do próprio dono do cookie — não há benefício real para quem forja a chamada.

Já **criar livro/capítulo** é a ação que teria valor real para um atacante (poluir o conteúdo do site usando a sessão do admin), e é onde a proteção CSRF realmente importa — por isso o escopo ficou limitado a essas rotas.
