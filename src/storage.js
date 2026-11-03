const STORAGE_KEY = "organiza.tasks.v1";

export function loadTasks(storage = globalThis.localStorage) {
  try {
    const raw = storage?.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isStoredTask);
  } catch {
    return [];
  }
}

export function saveTasks(tasks, storage = globalThis.localStorage) {
  if (!storage) throw new Error("Armazenamento local indisponível.");
  storage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function isStoredTask(t) {
  return t && typeof t.id === "string" && typeof t.description === "string" &&
    ["baixa", "media", "alta"].includes(t.priority) &&
    ["pendente", "concluida"].includes(t.status) &&
    typeof t.dueDate === "string";
}
