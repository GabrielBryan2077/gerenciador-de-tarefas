import { createTask, updateTask } from "./domain.js";
import { loadTasks, saveTasks } from "./storage.js";

export function createTaskService(storage = globalThis.localStorage) {
  let tasks = loadTasks(storage);
  const persist = () => saveTasks(tasks, storage);
  return {
    list: () => [...tasks],
    create(input) {
      const task = createTask(input);
      tasks = [task, ...tasks];
      persist();
      return task;
    },
    update(id, changes) {
      const index = tasks.findIndex(t => t.id === id);
      if (index < 0) throw new Error("Tarefa não encontrada.");
      tasks[index] = updateTask(tasks[index], changes);
      persist();
      return tasks[index];
    },
    remove(id) {
      const before = tasks.length;
      tasks = tasks.filter(t => t.id !== id);
      if (tasks.length === before) throw new Error("Tarefa não encontrada.");
      persist();
    },
    replaceStatus(id, status) {
      return this.update(id, { status });
    }
  };
}
