const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const submissionRoutes = require('./routes/submissions');

dotenv.config();

const app = express();
const port = process.env.PORT || 4280;

app.use(express.json());

app.get('/', (_req, res) => {
  return res.json({
    message: 'Task 6 API running.',
    endpoints: {
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      listSubmissions: 'GET /api/submissions (Bearer token required)',
      createSubmission: 'POST /api/submissions (Bearer token required)'
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/submissions', submissionRoutes);

app.listen(port, () => {
  console.log(`Task 6 server running at http://localhost:${port}`);
});
