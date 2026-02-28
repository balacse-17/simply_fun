#!/usr/bin/env node

const LOCAL_API_BASE = process.env.LOCAL_API_BASE || 'http://127.0.0.1:4180/api';
const FREE_API_URL = 'https://jsonplaceholder.typicode.com/posts?_limit=8';

const color = {
  cyan: (text) => `\x1b[36m${text}\x1b[0m`,
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  bold: (text) => `\x1b[1m${text}\x1b[0m`
};

const divider = () => console.log(color.cyan('─'.repeat(76)));

const title = (text) => {
  divider();
  console.log(color.bold(color.cyan(` ${text}`)));
  divider();
};

const request = async (label, url, options = {}) => {
  const method = options.method || 'GET';
  const started = Date.now();

  console.log(color.yellow(`→ ${label}: ${method} ${url}`));

  const response = await fetch(url, options);
  const elapsed = Date.now() - started;

  console.log(
    `${response.ok ? color.green('✓') : color.red('✗')} ${label}: status ${response.status} (${elapsed}ms)`
  );

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  return { ok: response.ok, status: response.status, data };
};

const truncate = (value, limit = 50) =>
  value.length > limit ? `${value.slice(0, limit - 1)}…` : value;

const renderPostsTable = (posts) => {
  if (!posts.length) {
    console.log(color.red('No posts available.'));
    return;
  }

  const rows = posts.map((post) => ({
    id: post.id,
    userId: post.userId,
    title: truncate(post.title, 48)
  }));

  console.table(rows);
};

const renderUserDistribution = (posts) => {
  const counts = posts.reduce((acc, post) => {
    acc[post.userId] = (acc[post.userId] || 0) + 1;
    return acc;
  }, {});

  console.log(color.bold('Posts by user (ASCII chart)'));

  Object.entries(counts)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .forEach(([userId, count]) => {
      const bar = '█'.repeat(count * 3);
      console.log(`user ${userId.toString().padStart(2, ' ')} | ${bar} ${count}`);
    });
};

const runLocalCrudDemo = async () => {
  title('Local Task5 API CRUD Visualization');

  try {
    const payload = {
      title: `CLI Task ${new Date().toISOString().slice(11, 19)}`,
      description: 'Created from task5_visual command-line demo.',
      status: 'todo'
    };

    const created = await request('Create task', `${LOCAL_API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!created.ok) {
      console.log(color.red('Local API returned an error. Skipping local visualization.'));
      return;
    }

    const createdTask = created.data;

    const list = await request('List tasks', `${LOCAL_API_BASE}/tasks`);
    const items = Array.isArray(list.data.items) ? list.data.items : [];

    console.log(color.bold(`Current local tasks: ${items.length}`));
    console.table(
      items.slice(0, 5).map((item) => ({
        id: item.id,
        status: item.status,
        title: truncate(item.title, 42)
      }))
    );

    await request('Delete demo task', `${LOCAL_API_BASE}/tasks/${createdTask.id}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.log(color.red(`Local API unavailable at ${LOCAL_API_BASE}`));
    console.log(color.yellow(`Reason: ${error.message}`));
    console.log(color.yellow('Tip: start Task 5 server with: node task5/server.js'));
  }
};

const runFreeApiDemo = async () => {
  title('Free API Visualization (JSONPlaceholder)');

  try {
    const response = await request('Fetch free posts', FREE_API_URL);
    if (!response.ok) {
      console.log(color.red('Free API returned an error response.'));
      return;
    }

    const posts = Array.isArray(response.data) ? response.data : [];
    renderPostsTable(posts);
    renderUserDistribution(posts);
  } catch (error) {
    console.log(color.red('Failed to reach free API.'));
    console.log(color.yellow(`Reason: ${error.message}`));
  }
};

const main = async () => {
  title('Task 5 CMD Visual API Client');
  console.log('This script makes API requests and prints visual representations in terminal.');

  await runLocalCrudDemo();
  await runFreeApiDemo();

  divider();
  console.log(color.green('Done.'));
  divider();
};

main();
