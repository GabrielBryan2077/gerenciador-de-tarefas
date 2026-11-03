# AUDITORIA.md — Organiza

## Escopo e contexto
Auditoria do projeto **Organiza — Gerenciador de tarefas**, tema A da atividade. O sistema contempla somente cadastrar tarefas, editar descrição, definir prioridade e prazo, alterar status (pendente/concluída), listar e excluir. A aplicação é front-end estático e persiste no `localStorage` do navegador; não possui servidor, autenticação, pagamentos, usuários, banco remoto ou APIs.

**Limitação explícita:** auditoria estática do código entregue. Não foi possível verificar deploy, configurações de hospedagem, ambiente real do navegador do avaliador ou políticas de infraestrutura ainda não configuradas.

## Cinco achados de maior risco
1. **Médio — dados locais por navegador:** tarefas ficam no armazenamento do próprio navegador, não sincronizam entre dispositivos e podem ser apagadas pelo usuário/limpeza de dados.
2. **Baixo — validações no cliente:** validações são executadas no navegador; adequadas ao escopo sem API/servidor, mas não constituem controle confiável para dados compartilhados.
3. **Baixo — confirmação de exclusão:** a ação é confirmada por diálogo nativo para reduzir exclusões acidentais.
4. **Baixo — conteúdo de tarefa:** descrição é renderizada via `textContent`, evitando interpretação como HTML.
5. **Baixo — dependência de disponibilidade do navegador:** se o armazenamento local estiver indisponível, gravação apresenta erro; não há cópia remota.

## Etapa 1 — Testes de integração
| Achado | Risco | Arquivo/linha | Correção sugerida |
|---|---|---|---|
| Aplicação não possui rotas HTTP ou banco de dados; os fluxos são implementados por módulos JavaScript e `localStorage`. | Baixo | `src/service.js`, `src/storage.js` | Para o escopo atual, testes de serviço e persistência local são proporcionais. Se houver backend futuramente, criar testes reais de rotas e banco de teste. |
| Testes cobrem criação, validação, edição, status, listagem/filtro, exclusão e persistência via adaptador de armazenamento. | Baixo | `tests/tasks.test.js` | Executar `npm test` e guardar a saída como evidência. |
| Não existem fluxos de cadastro/login, checkout, pagamento, webhook ou acesso entre usuários, pois não fazem parte do tema. | Informativo | Projeto | Não implementar esses fluxos sem requisito. |

## Etapa 2 — Confiança no cliente
| Achado | Risco | Arquivo/linha | Correção sugerida |
|---|---|---|---|
| Regras de validação e operações de tarefas são executadas no cliente. Não há servidor para transferir regras. | Baixo no escopo local; alto se usado como sistema multiusuário | `src/domain.js`, `src/service.js` | Manter para o sistema local. Se evoluir para multiusuário, validar no servidor. |
| Não foram identificadas chaves, tokens ou segredos no front-end. | Baixo | Arquivos do projeto | Manter sem credenciais; revisar antes de publicar. |
| Não há Supabase, banco exposto por API, tabelas ou policies/RLS. | Não aplicável | Projeto | Nenhuma ação necessária. |
| Descrição é inserida na tela usando `textContent`, não `innerHTML` com dados do usuário. | Baixo | `src/app.js` | Manter a renderização segura. |

## Etapa 3 — Race condition
| Achado | Risco | Arquivo/linha | Correção sugerida |
|---|---|---|---|
| Não há recursos compartilhados limitados (estoque, saldo, cupons, vagas) nem múltiplas requisições concorrentes ao servidor. | Não aplicável | Projeto | Não adicionar locks ou transações sem necessidade. |
| Duas abas podem sobrescrever mudanças porque cada instância mantém estado em memória e grava o conjunto completo no `localStorage`. | Médio | `src/service.js`, `src/storage.js` | Limitação aceitável para uso individual simples; se sincronização entre abas for requisito, tratar evento `storage` e reconciliar estado. |

## Etapa 4 — Idempotência
| Achado | Risco | Arquivo/linha | Correção sugerida |
|---|---|---|---|
| Não há webhooks nem chamadas a gateway de pagamento. | Não aplicável | Projeto | Nenhuma ação necessária. |
| Operações de criação geram novo ID a cada envio; não há idempotência distribuída. | Baixo | `src/domain.js` | Adequado ao CRUD local. Evitar duplo clique no botão durante uma futura integração com servidor, se necessário. |

## Etapa 5 — Separação de responsabilidades
| Achado | Risco | Arquivo/linha | Correção sugerida |
|---|---|---|---|
| Responsabilidades separadas em domínio/validação, serviço CRUD, persistência e UI. | Baixo | `src/domain.js`, `src/service.js`, `src/storage.js`, `src/app.js` | Estrutura atual é suficiente; não se recomenda refatoração adicional sem necessidade. |
| `src/app.js` contém renderização e eventos da interface, sem regras de validação duplicadas. | Baixo | `src/app.js` | Manter UI focada em interação e apresentação. |

## Decisão sobre os prompts
- **Prompt 4 — Auditoria abrangente:** aplicado em leitura; este documento registra achados e limites verificáveis.
- **Prompt 1 — Segurança:** aplicado ao contexto do front-end estático; não há backend, segredos ou RLS para configurar.
- **Prompt 3 — Testes de integração:** adaptado ao desenho sem rotas/backend. Os testes exercitam os módulos de domínio/serviço e o adaptador de persistência; não são testes HTTP de rota nem usam banco externo.
- **Prompt 2 — Refatoração:** a separação por módulos já atende ao escopo. Não foi feita refatoração desnecessária. A aplicação mantém comportamento e cobertura dos fluxos.

**Prompt de correção recomendado primeiro:** nenhum prompt adicional de correção é necessário com os achados atuais. Se a aplicação evoluir para backend ou multiusuário, executar novamente o Prompt 1 e então criar testes de integração reais para a arquitetura escolhida.
