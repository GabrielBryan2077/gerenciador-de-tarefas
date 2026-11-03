# Organiza — Gerenciador de tarefas

> **Link do sistema publicado:** [(https://gabrielbryan2077.github.io/gerenciador-de-tarefas/)]

## Objetivo
Aplicação web simples para organizar tarefas pessoais, conforme o tema A da atividade prática.

## Funcionalidades
- Cadastrar tarefas com descrição, prioridade e prazo.
- Listar tarefas.
- Editar descrição, prioridade e prazo.
- Alterar status entre pendente e concluída.
- Excluir tarefas com confirmação.
- Validar descrição obrigatória e prioridade válida.
- Exibir mensagens de sucesso/erro e contadores por status.
- Layout responsivo para computador e celular.

## Tecnologias
- HTML5, CSS3 e JavaScript ES Modules.
- `localStorage` do navegador para persistência local.
- Node.js (test runner nativo) para executar os testes.
- Assistência de IA: ChatGPT (OpenAI), utilizada para apoiar planejamento, implementação, revisão e documentação. O código e os resultados devem ser revisados pelo aluno.

## Persistência
As tarefas são salvas no `localStorage` do navegador. Isso mantém os dados no mesmo navegador/dispositivo, mas não sincroniza entre dispositivos. A escolha evita um backend e banco remoto que não são necessários para o tema e para a versão simples da atividade.

## Executar localmente
Como o projeto usa módulos JavaScript, abra a pasta com um servidor estático local. Exemplo com Python:

```bash
python -m http.server 8000
```

Acesse `http://localhost:8000`.

## Testes
Requer Node.js 18 ou superior.

```bash
npm test
```

Os testes cobrem validação, criação, edição, status, filtros/resumo, exclusão e persistência por meio do adaptador de armazenamento. Como a aplicação não possui API ou banco de dados servidor, não há testes HTTP de rota nem banco externo; essa limitação está registrada em `AUDITORIA.md`.

## Estrutura
```text
index.html
styles.css
src/
  app.js       # interface e eventos
  domain.js    # validações e regras da tarefa
  service.js   # operações CRUD
  storage.js   # persistência local
tests/
  tasks.test.js
AUDITORIA.md
README.md
```

## Resultados dos quatro prompts
1. **Auditoria abrangente (Prompt 4):** relatório em `AUDITORIA.md`; identificadas limitações de persistência local e ausência de backend, sem achados críticos no escopo.
2. **Segurança (Prompt 1):** não há segredos, autenticação, banco remoto ou RLS. Validações permanecem no cliente por ser aplicação local.
3. **Testes (Prompt 3):** testes de módulos e persistência local implementados; não se aplicam fluxos de login/pagamento/webhook.
4. **Refatoração (Prompt 2):** código organizado em módulos; não foi necessária refatoração adicional que alterasse a estrutura.

## Evidências a completar pelo aluno
- Captura de tela do sistema funcionando.
- Saída do terminal após `npm test`.
- URL pública do deploy inserida no topo deste README.
- Repositório GitHub e URL publicada informados na entrega do Classroom.
- Relato pessoal sobre o que a IA produziu corretamente, o que foi corrigido e o que foi aprendido.
