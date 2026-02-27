const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 4180;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let nextId = 1;
const tasks = [];

const normalizeText = (value) => (typeof value === 'string' ? value.trim() : '');

const validateTaskPayload = (payload) => {
  const title = normalizeText(payload.title);
  const description = normalizeText(payload.description);
  const status = normalizeText(payload.status || 'todo').toLowerCase();

  if (!title || title.length < 3 || title.length > 80) {
    return { error: 'Title is required and must be 3-80 characters.' };
  }

  if (!description || description.length < 5 || description.length > 220) {
    return { error: 'Description is required and must be 5-220 characters.' };
  }

  if (!['todo', 'in-progress', 'done'].includes(status)) {
    return { error: 'Status must be one of: todo, in-progress, done.' };
  }

  return { data: { title, description, status } };
};

app.get('/api/tasks', (req, res) => {
  return res.json({ items: tasks });
});

app.get('/api/tasks/:id', (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  const task = tasks.find((item) => item.id === id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found.' });
  }

  return res.json(task);
});

app.post('/api/tasks', (req, res) => {
  const result = validateTaskPayload(req.body || {});
  if (result.error) {
    return res.status(400).json({ error: result.error });
  }

  const newTask = {
    id: nextId,
    ...result.data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  nextId += 1;
  tasks.unshift(newTask);

  return res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  const index = tasks.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Task not found.' });
  }

  const result = validateTaskPayload(req.body || {});
  if (result.error) {
    return res.status(400).json({ error: result.error });
  }

  tasks[index] = {
    ...tasks[index],
    ...result.data,
    updatedAt: new Date().toISOString()
  };

  return res.json(tasks[index]);
});

app.delete('/api/tasks/:id', (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  const index = tasks.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Task not found.' });
  }

  const [deletedTask] = tasks.splice(index, 1);
  return res.json({ deleted: deletedTask });
});

app.get('/api/free-posts', async (_req, res) => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');

    if (!response.ok) {
      return res.status(502).json({ error: 'Failed to fetch free API data.' });
    }

    const posts = await response.json();
    return res.json({ items: posts });
  } catch (error) {
    return res.status(502).json({ error: 'Free API request failed.', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Task 5 server running at http://localhost:${port}`);
});
