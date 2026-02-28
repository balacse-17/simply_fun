const routes = {
  '#/': 'view-home',
  '#/register': 'view-register',
  '#/activity': 'view-activity'
};

const form = document.getElementById('registerForm');
const activityContainer = document.getElementById('activityContainer');
const emptyState = document.getElementById('emptyState');
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');

const fields = {
  fullName: document.getElementById('fullName'),
  email: document.getElementById('email'),
  password: document.getElementById('password'),
  confirmPassword: document.getElementById('confirmPassword'),
  age: document.getElementById('age'),
  role: document.getElementById('role')
};

const errors = {
  fullName: document.getElementById('fullNameError'),
  email: document.getElementById('emailError'),
  password: document.getElementById('passwordError'),
  confirmPassword: document.getElementById('confirmPasswordError'),
  age: document.getElementById('ageError'),
  role: document.getElementById('roleError')
};

const setRoute = () => {
  const hash = window.location.hash || '#/';
  const targetId = routes[hash] || 'view-home';

  Object.values(routes).forEach((id) => {
    document.getElementById(id).classList.add('d-none');
  });
  document.getElementById(targetId).classList.remove('d-none');

  document.querySelectorAll('.route-link').forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === hash);
  });
};

const scorePassword = (password) => {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
};

const renderStrength = () => {
  const password = fields.password.value;
  const score = scorePassword(password);
  const levels = ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];
  const colors = ['bg-danger', 'bg-danger', 'bg-warning', 'bg-info', 'bg-success'];

  strengthBar.className = 'progress-bar';

  if (!password) {
    strengthBar.style.width = '0%';
    strengthText.textContent = 'Strength: --';
    return;
  }

  strengthBar.classList.add(colors[Math.max(score - 1, 0)]);
  strengthBar.style.width = `${Math.max(score, 1) * 20}%`;
  strengthText.textContent = `Strength: ${levels[Math.max(score - 1, 0)]}`;
};

const markError = (name, message) => {
  fields[name].classList.add('is-invalid');
  errors[name].textContent = message;
};

const clearError = (name) => {
  fields[name].classList.remove('is-invalid');
  errors[name].textContent = '';
};

const validateForm = () => {
  let isValid = true;

  Object.keys(fields).forEach(clearError);

  const fullName = fields.fullName.value.trim();
  const email = fields.email.value.trim();
  const password = fields.password.value;
  const confirmPassword = fields.confirmPassword.value;
  const age = Number.parseInt(fields.age.value, 10);
  const role = fields.role.value;

  if (fullName.length < 3 || !fullName.includes(' ')) {
    isValid = false;
    markError('fullName', 'Enter full name (first and last), at least 3 characters.');
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    isValid = false;
    markError('email', 'Enter a valid email address.');
  }

  if (scorePassword(password) < 4) {
    isValid = false;
    markError('password', 'Use a stronger password: 8+ chars with upper, lower, number, symbol.');
  }

  if (password !== confirmPassword) {
    isValid = false;
    markError('confirmPassword', 'Passwords do not match.');
  }

  if (!Number.isInteger(age) || age < 13 || age > 120) {
    isValid = false;
    markError('age', 'Age must be a number between 13 and 120.');
  }

  if (!role) {
    isValid = false;
    markError('role', 'Please choose a role.');
  }

  return {
    isValid,
    payload: { fullName, email, age, role }
  };
};

const addActivityCard = (payload) => {
  const card = document.createElement('div');
  card.className = 'col-12 col-md-6 col-lg-4';

  card.innerHTML = `
    <article class="card border-0 shadow-sm activity-card h-100">
      <div class="card-body">
        <h3 class="h6 mb-2">${payload.fullName}</h3>
        <p class="small text-secondary mb-1">${payload.email}</p>
        <p class="small mb-1">Role: <strong>${payload.role}</strong></p>
        <p class="small mb-0">Age: ${payload.age}</p>
      </div>
      <div class="card-footer bg-white small text-secondary">Created: ${new Date().toLocaleString()}</div>
    </article>
  `;

  activityContainer.prepend(card);
  emptyState.classList.add('d-none');
};

fields.password.addEventListener('input', renderStrength);
fields.confirmPassword.addEventListener('input', () => clearError('confirmPassword'));

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const result = validateForm();
  if (!result.isValid) {
    return;
  }

  addActivityCard(result.payload);
  form.reset();
  renderStrength();
  window.location.hash = '#/activity';
});

document.getElementById('autofillBtn').addEventListener('click', () => {
  fields.fullName.value = 'Grace Hopper';
  fields.email.value = 'grace.hopper@example.com';
  fields.password.value = 'StrongPass#2026';
  fields.confirmPassword.value = 'StrongPass#2026';
  fields.age.value = '34';
  fields.role.value = 'Developer';
  renderStrength();
});

document.getElementById('clearActivityBtn').addEventListener('click', () => {
  activityContainer.innerHTML = '';
  emptyState.classList.remove('d-none');
});

window.addEventListener('hashchange', setRoute);
setRoute();
