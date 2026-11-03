import { createTaskService } from "./service.js";
import { filterTasks, summarize } from "./domain.js";

const service = createTaskService();
const $ = id => document.getElementById(id);
const form = $("taskForm"), description = $("description"), priority = $("priority"), dueDate = $("dueDate");
const list = $("taskList"), empty = $("emptyState"), filter = $("statusFilter");
let editingId = null;

function message(text, error = false) {
  const el = $("formMessage"); el.textContent = text; el.classList.toggle("error", error);
}
function dateLabel(value) {
  if (!value) return "Sem prazo";
  const [y,m,d] = value.split("-"); return `${d}/${m}/${y}`;
}
function isOverdue(task) {
  return task.status === "pendente" && task.dueDate && task.dueDate < new Date().toISOString().slice(0,10);
}
function render() {
  const tasks = service.list(), counts = summarize(tasks);
  $("totalCount").textContent = counts.total; $("pendingCount").textContent = counts.pending; $("completedCount").textContent = counts.completed;
  const visible = filterTasks(tasks, filter.value);
  list.replaceChildren(); empty.classList.toggle("hidden", visible.length > 0);
  if (visible.length === 0 && tasks.length > 0) {
    empty.querySelector("h3").textContent = "Nenhuma tarefa neste filtro";
    empty.querySelector("p").textContent = "Altere o filtro para visualizar outras tarefas.";
  } else {
    empty.querySelector("h3").textContent = "Nenhuma tarefa por aqui";
    empty.querySelector("p").textContent = "Adicione sua primeira tarefa para começar a organizar o dia.";
  }
  for (const task of visible) {
    const card = document.createElement("article"); card.className = `task-card ${task.status === "concluida" ? "completed" : ""}`;
    const check = document.createElement("input"); check.type = "checkbox"; check.className = "task-check"; check.checked = task.status === "concluida"; check.setAttribute("aria-label", `Marcar ${task.description} como ${check.checked ? "pendente" : "concluída"}`);
    check.addEventListener("change", () => { service.replaceStatus(task.id, check.checked ? "concluida" : "pendente"); render(); });
    const main = document.createElement("div"); main.className = "task-main";
    const title = document.createElement("p"); title.className = "task-title"; title.textContent = task.description;
    const meta = document.createElement("div"); meta.className = "task-meta";
    const p = document.createElement("span"); p.className = `pill priority-${task.priority}`; p.textContent = `Prioridade ${task.priority === "media" ? "média" : task.priority}`;
    const d = document.createElement("span"); d.className = `due ${isOverdue(task) ? "overdue" : ""}`; d.textContent = `${isOverdue(task) ? "Atrasada · " : "Prazo · "}${dateLabel(task.dueDate)}`;
    meta.append(p,d); main.append(title,meta);
    const actions = document.createElement("div"); actions.className = "task-actions";
    const edit = document.createElement("button"); edit.className = "icon-button"; edit.type = "button"; edit.textContent = "Editar"; edit.addEventListener("click", () => beginEdit(task));
    const del = document.createElement("button"); del.className = "icon-button delete"; del.type = "button"; del.textContent = "Excluir"; del.addEventListener("click", () => {
      if (confirm(`Excluir a tarefa "${task.description}"?`)) { service.remove(task.id); if (editingId === task.id) resetForm(); message("Tarefa excluída."); render(); }
    });
    actions.append(edit,del); card.append(check,main,actions); list.append(card);
  }
}
function beginEdit(task) {
  editingId = task.id; description.value = task.description; priority.value = task.priority; dueDate.value = task.dueDate;
  $("formTitle").textContent = "Editar tarefa"; $("saveButton").innerHTML = "Salvar alterações <span>✓</span>"; $("cancelEdit").classList.remove("hidden");
  message("Edite os campos e salve."); description.focus(); $("formPanel")?.scrollIntoView({behavior:"smooth",block:"start"});
}
function resetForm() {
  editingId = null; form.reset(); priority.value = "media"; $("formTitle").textContent = "O que você precisa fazer?";
  $("saveButton").innerHTML = "Adicionar tarefa <span>＋</span>"; $("cancelEdit").classList.add("hidden");
}
form.addEventListener("submit", event => {
  event.preventDefault();
  const input = { description: description.value, priority: priority.value, dueDate: dueDate.value };
  try {
    if (editingId) { service.update(editingId,input); message("Tarefa atualizada com sucesso."); }
    else { service.create(input); message("Tarefa adicionada com sucesso."); }
    resetForm(); render();
  } catch (error) { message(error.message || "Não foi possível salvar a tarefa.", true); }
});
$("cancelEdit").addEventListener("click", () => { resetForm(); message(""); });
filter.addEventListener("change", render);
render();
