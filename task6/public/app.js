const messageEl = document.getElementById('message');
const authStatusEl = document.getElementById('authStatus');
const submissionListEl = document.getElementById('submissionList');
const emptyStateEl = document.getElementById('emptyState');

let authToken = '';
let currentUser = null;

const setMessage = (text, type = 'success') => {
  messageEl.textContent = text;
  messageEl.className = `small mt-2 mb-0 ${type}`;
};

const setAuthState = (token, user) => {
  authToken = token || '';
  currentUser = user || null;

  if (!authToken || !currentUser) {
    authStatusEl.textContent = 'Not logged in.';
    return;
  }

  authStatusEl.textContent = `Logged in as ${currentUser.email}`;
};

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${authToken}`
});

const renderSubmissions = (items) => {
  submissionListEl.innerHTML = '';

  if (!items.length) {
    emptyStateEl.classList.remove('d-none');
    return;
  }

  emptyStateEl.classList.add('d-none');

  items.forEach((item) => {
    const node = document.createElement('article');
    node.className = 'item-card';
    node.innerHTML = `
      <div class="fw-semibold">${item.title}</div>
      <div class="small text-secondary">${item.content}</div>
      <div class="small mt-1">Created: ${new Date(item.created_at).toLocaleString()}</div>
    `;

    submissionListEl.appendChild(node);
  });
};

const parseJson = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
};

document.getElementById('registerForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  try {
    const payload = {
      name: document.getElementById('registerName').value.trim(),
      email: document.getElementById('registerEmail').value.trim(),
      password: document.getElementById('registerPassword').value
    };

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await parseJson(response);
    setMessage(data.message || 'Registered successfully. You can now login.', 'success');
  } catch (error) {
    setMessage(error.message, 'error');
  }
});

document.getElementById('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  try {
    const payload = {
      email: document.getElementById('loginEmail').value.trim(),
      password: document.getElementById('loginPassword').value
    };

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await parseJson(response);
    setAuthState(data.token, data.user);
    setMessage('Login successful.', 'success');
  } catch (error) {
    setMessage(error.message, 'error');
  }
});

document.getElementById('submissionForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!authToken) {
    setMessage('Please login first.', 'error');
    return;
  }

  try {
    const payload = {
      title: document.getElementById('submissionTitle').value.trim(),
      content: document.getElementById('submissionContent').value.trim()
    };

    const response = await fetch('/api/submissions', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload)
    });

    await parseJson(response);
    setMessage('Submission created successfully.', 'success');
    document.getElementById('submissionForm').reset();
    document.getElementById('loadBtn').click();
  } catch (error) {
    setMessage(error.message, 'error');
  }
});

document.getElementById('loadBtn').addEventListener('click', async () => {
  if (!authToken) {
    setMessage('Please login first.', 'error');
    return;
  }

  try {
    const response = await fetch('/api/submissions', {
      headers: authHeaders()
    });

    const data = await parseJson(response);
    renderSubmissions(data.items || []);
    setMessage('Loaded submissions.', 'success');
  } catch (error) {
    setMessage(error.message, 'error');
  }
});

setAuthState('', null);
