export const PRIORITIES = ["baixa", "media", "alta"];
export const STATUSES = ["pendente", "concluida"];

export function validateTask(input) {
  const description = String(input.description ?? "").trim();
  if (!description) return "Informe a descrição da tarefa.";
  if (description.length > 160) return "A descrição deve ter no máximo 160 caracteres.";
  if (!PRIORITIES.includes(input.priority)) return "Selecione uma prioridade válida.";
  if (input.dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(input.dueDate)) return "Informe um prazo válido.";
  if (input.dueDate && Number.isNaN(Date.parse(`${input.dueDate}T00:00:00`))) return "Informe um prazo válido.";
  return null;
}

export function createTask(input, now = new Date()) {
  const error = validateTask(input);
  if (error) throw new Error(error);
  return {
    id: input.id ?? (globalThis.crypto?.randomUUID?.() ?? `${now.getTime()}-${Math.random().toString(16).slice(2)}`),
    description: String(input.description).trim(),
    priority: input.priority,
    dueDate: input.dueDate || "",
    status: input.status ?? "pendente",
    createdAt: input.createdAt ?? now.toISOString()
  };
}

export function updateTask(task, changes) {
  const next = { ...task, ...changes, id: task.id, createdAt: task.createdAt };
  const error = validateTask(next);
  if (error) throw new Error(error);
  if (!STATUSES.includes(next.status)) throw new Error("Status inválido.");
  return { ...next, description: next.description.trim(), dueDate: next.dueDate || "" };
}

export function filterTasks(tasks, filter) {
  if (filter === "pendente" || filter === "concluida") return tasks.filter(t => t.status === filter);
  return [...tasks];
}

export function summarize(tasks) {
  return {
    total: tasks.length,
    pending: tasks.filter(t => t.status === "pendente").length,
    completed: tasks.filter(t => t.status === "concluida").length
  };
}
