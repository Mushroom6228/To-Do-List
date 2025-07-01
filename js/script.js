const localStorageKey = "to-do-list";
const inputNewTask = document.getElementById("input-new-task");
const todoListElement = document.getElementById("to-do-list");

function getTasksFromLocalStorage() {
  try {
    const tasks = JSON.parse(localStorage.getItem(localStorageKey));
    return Array.isArray(tasks) ? tasks : [];
  } catch (e) {
    console.error("Erro ao parsear tasks do localStorage:", e);
    return [];
  }
}

function saveTasksToLocalStorage(tasks) {
  localStorage.setItem(localStorageKey, JSON.stringify(tasks));
}

function taskExists(taskName) {
  const tasks = getTasksFromLocalStorage();
  return tasks.some(
    (task) => task.name.toLowerCase() === taskName.toLowerCase()
  );
}
function addNewTask() {
  inputNewTask.style.border = "";
  const newTaskName = inputNewTask.value.trim();

  if (!newTaskName) {
    inputNewTask.style.border = "1px solid red";
    alert("Por favor, digite algo para adicionar à sua lista.");
    return;
  }

  if (taskExists(newTaskName)) {
    alert("Já existe uma tarefa com essa descrição.");
    return;
  }
  const tasks = getTasksFromLocalStorage();
  tasks.push({ name: newTaskName });
  saveTasksToLocalStorage(tasks);

  inputNewTask.value = "";
  renderTasks();
}
function renderTasks() {
  const tasks = getTasksFromLocalStorage();
  todoListElement.innerHTML = "";

  if (tasks.length === 0) {
    todoListElement.innerHTML =
      '<li class="no-tasks">Nenhuma tarefa adicionada ainda.</li>';
    return;
  }

  const tasksHtml = tasks
    .map(
      (task) => `
        <li>
            ${task.name}
            <button class="remove-btn" data-task-name="${task.name}">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
                </svg>
            </button>
        </li>
    `
    )
    .join("");

  todoListElement.innerHTML = tasksHtml;
}

function removeTask(taskNameToRemove) {
  let tasks = getTasksFromLocalStorage();

  tasks = tasks.filter(
    (task) => task.name.toLowerCase() !== taskNameToRemove.toLowerCase()
  );
  saveTasksToLocalStorage(tasks);
  renderTasks();
}

todoListElement.addEventListener("click", (event) => {
  const target = event.target.closest(".remove-btn");
  if (target) {
    const taskName = target.dataset.taskName;
    if (taskName) {
      removeTask(taskName);
    }
  }
});
document.addEventListener("DOMContentLoaded", renderTasks);
