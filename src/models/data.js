let nextId = 1;
const todos = [];

// helper functions
export function listTodos(filter = {}) {
  if (filter.completed === undefined) return [...todos];
  return todos.filter(t => t.completed === filter.completed);
}

export function getTodoById(id) {
  return todos.find(t => String(t.id) === String(id)) || null;
}

export function createTodo({ title, description = null, dueDate = null }) {
  const todo = {
    id: String(nextId++),
    title,
    description,
    completed: false,
    dueDate
  };
  todos.push(todo);
  return todo;
}

export function updateTodo(id, patch) {
  const todo = getTodoById(id);
  if (!todo) return null;
  if (patch.title !== undefined) todo.title = patch.title;
  if (patch.description !== undefined) todo.description = patch.description;
  if (patch.completed !== undefined) todo.completed = patch.completed;
  if (patch.dueDate !== undefined) todo.dueDate = patch.dueDate;
  return todo;
}

export function deleteTodo(id) {
  const idx = todos.findIndex(t => String(t.id) === String(id));
  if (idx === -1) return false;
  todos.splice(idx, 1);
  return true;
}

export function resetData() {
  nextId = 1;
  todos.length = 0;
}
