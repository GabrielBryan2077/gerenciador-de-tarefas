# Relatório de testes

## Escopo
Testes automatizados dos módulos de domínio, serviço CRUD e persistência local do Gerenciador de Tarefas.

## Cenários
- Criação de tarefa com descrição normalizada e status inicial pendente.
- Rejeição de descrição vazia e prioridade inválida.
- Edição de descrição, prioridade e prazo preservando ID e data de criação.
- Filtragem e resumo por status.
- Fluxo CRUD com persistência: criar, listar, editar, concluir e excluir.
- Tratamento de ID inexistente.
- Tratamento de dados corrompidos no armazenamento.

## Execução
Com Node.js 18+ instalado:

```bash
npm test
```

A saída real do comando deve ser guardada como evidência. Não declarar os testes executados até rodar o comando no ambiente local.
