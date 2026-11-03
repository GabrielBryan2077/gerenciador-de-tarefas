import test from "node:test";
import assert from "node:assert/strict";
import { createTask, updateTask, validateTask, filterTasks, summarize } from "../src/domain.js";
import { createTaskService } from "../src/service.js";
import { loadTasks, saveTasks } from "../src/storage.js";

function memoryStorage() {
  const data = new Map();
  return { getItem: k => data.has(k) ? data.get(k) : null, setItem: (k,v) => data.set(k,v), removeItem: k => data.delete(k) };
}
const valid = { description:"Revisar atividade", priority:"media", dueDate:"2030-05-20" };

test("cria tarefa com descrição normalizada e status pendente", () => {
  const task = createTask({...valid, description:"  Revisar atividade  "}, new Date("2026-01-01T10:00:00Z"));
  assert.equal(task.description, "Revisar atividade");
  assert.equal(task.status, "pendente");
  assert.equal(task.priority, "media");
});
test("rejeita descrição vazia e prioridade inválida", () => {
  assert.match(validateTask({...valid,description:"   "}), /descrição/);
  assert.match(validateTask({...valid,priority:"urgente"}), /prioridade/);
  assert.throws(() => createTask({...valid,description:""}), /descrição/);
});
test("edita descrição, prioridade e prazo sem alterar identidade", () => {
  const task = createTask({...valid,id:"t1",createdAt:"fixed"});
  const edited = updateTask(task,{description:"Nova descrição",priority:"alta",dueDate:"2030-06-01"});
  assert.equal(edited.id,"t1"); assert.equal(edited.createdAt,"fixed");
  assert.equal(edited.description,"Nova descrição"); assert.equal(edited.priority,"alta");
});
test("filtra status e resume contagens", () => {
  const tasks = [createTask({...valid,id:"a"}), createTask({...valid,id:"b",status:"concluida"})];
  assert.equal(filterTasks(tasks,"pendente").length,1);
  assert.deepEqual(summarize(tasks),{total:2,pending:1,completed:1});
});
test("fluxo de serviço cria, persiste, lista, altera status e exclui", () => {
  const storage = memoryStorage(), service = createTaskService(storage);
  const task = service.create(valid);
  assert.equal(service.list().length,1);
  assert.equal(loadTasks(storage).length,1);
  service.update(task.id,{description:"Atualizada"});
  assert.equal(service.list()[0].description,"Atualizada");
  service.replaceStatus(task.id,"concluida");
  assert.equal(service.list()[0].status,"concluida");
  service.remove(task.id);
  assert.equal(service.list().length,0);
  assert.equal(loadTasks(storage).length,0);
});
test("serviço rejeita atualização ou exclusão de ID inexistente", () => {
  const service = createTaskService(memoryStorage());
  assert.throws(() => service.update("missing",valid),/não encontrada/);
  assert.throws(() => service.remove("missing"),/não encontrada/);
});
test("armazenamento ignora conteúdo corrompido e formato inválido", () => {
  const storage = memoryStorage(); storage.setItem("organiza.tasks.v1","{bad json");
  assert.deepEqual(loadTasks(storage),[]);
  saveTasks([createTask({...valid,id:"ok"})],storage);
  assert.equal(loadTasks(storage).length,1);
});
