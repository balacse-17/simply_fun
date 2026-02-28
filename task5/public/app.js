const apiBase = '/api';

const taskForm = document.getElementById('taskForm');
const taskIdInput = document.getElementById('taskId');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const statusInput = document.getElementById('status');
const formError = document.getElementById('formError');

const taskList = document.getElementById('taskList');
const taskEmpty = document.getElementById('taskEmpty');

const freeApiList = document.getElementById('freeApiList');
const freeApiEmpty = document.getElementById('freeApiEmpty');

const readForm = () => ({
  title: titleInput.value.trim(),
  description: descriptionInput.value.trim(),
  status: statusInput.value
});

const resetForm = () => {
  taskIdInput.value = '';
  titleInput.value = '';
  descriptionInput.value = '';
  statusInput.value = 'todo';
  formError.textContent = '';
};

const showFormError = (message) => {
  formError.textContent = message || 'Something went wrong.';
};

const renderTasks = (items) => {
  taskList.innerHTML = '';

  if (!items.length) {
    taskEmpty.classList.remove('d-none');
    return;
  }

  taskEmpty.classList.add('d-none');

  items.forEach((task) => {
    const row = document.createElement('article');
    row.className = 'task-card';

    row.innerHTML = `
      <div class="d-flex justify-content-between align-items-start gap-2 flex-wrap">
        <div>
          <div class="fw-semibold">${task.title}</div>
          <div class="small text-secondary">${task.description}</div>
          <div class="small mt-1">Status: <span class="badge text-bg-light">${task.status}</span></div>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-sm btn-outline-primary" data-action="edit" data-id="${task.id}">Edit</button>
          <button class="btn btn-sm btn-outline-danger" data-action="delete" data-id="${task.id}">Delete</button>
        </div>
      </div>
    `;

    taskList.appendChild(row);
  });
};

const loadTasks = async () => {
  const response = await fetch(`${apiBase}/tasks`);
  const data = await response.json();
  renderTasks(data.items || []);
};

const saveTask = async (payload) => {
  const id = taskIdInput.value;
  const url = id ? `${apiBase}/tasks/${id}` : `${apiBase}/tasks`;
  const method = id ? 'PUT' : 'POST';

  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to save task.');
  }

  resetForm();
  await loadTasks();
};

const deleteTask = async (id) => {
  const response = await fetch(`${apiBase}/tasks/${id}`, { method: 'DELETE' });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to delete task.');
  }

  await loadTasks();
};

const editTask = async (id) => {
  const response = await fetch(`${apiBase}/tasks/${id}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Task not found.');
  }

  taskIdInput.value = data.id;
  titleInput.value = data.title;
  descriptionInput.value = data.description;
  statusInput.value = data.status;
  formError.textContent = '';
};

const renderFreeApiItems = (items) => {
  freeApiList.innerHTML = '';

  if (!items.length) {
    freeApiEmpty.textContent = 'No free API data returned.';
    freeApiEmpty.classList.remove('d-none');
    return;
  }

  freeApiEmpty.classList.add('d-none');

  items.forEach((post) => {
    const node = document.createElement('article');
    node.className = 'free-card';
    node.innerHTML = `
      <div class="fw-semibold">${post.title}</div>
      <div class="small text-secondary">${post.body}</div>
    `;
    freeApiList.appendChild(node);
  });
};

const loadFreeApiData = async () => {
  const response = await fetch(`${apiBase}/free-posts`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Free API request failed.');
  }

  renderFreeApiItems(data.items || []);
};

taskForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  formError.textContent = '';

  try {
    await saveTask(readForm());
  } catch (error) {
    showFormError(error.message);
  }
});

document.getElementById('resetBtn').addEventListener('click', resetForm);
document.getElementById('refreshBtn').addEventListener('click', loadTasks);
document.getElementById('loadFreeApiBtn').addEventListener('click', async () => {
  freeApiEmpty.textContent = 'Loading free API data...';
  freeApiEmpty.classList.remove('d-none');

  try {
    await loadFreeApiData();
  } catch (error) {
    freeApiEmpty.textContent = error.message;
    freeApiEmpty.classList.remove('d-none');
  }
});

taskList.addEventListener('click', async (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;

  const id = button.getAttribute('data-id');
  const action = button.getAttribute('data-action');

  try {
    if (action === 'edit') {
      await editTask(id);
      return;
    }

    if (action === 'delete') {
      await deleteTask(id);
    }
  } catch (error) {
    showFormError(error.message);
  }
});

loadTasks().catch((error) => showFormError(error.message));
