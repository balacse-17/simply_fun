const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const submissions = [];

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Task 1: HTML + Node + Express + EJS',
    submissions,
    statusMessage: req.query.status || ''
  });
});

app.post('/submit-profile', (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName || !email) {
    return res.redirect('/?status=Please+fill+out+all+Profile+fields.');
  }

  submissions.push({
    formType: 'Profile',
    fullName,
    email,
    createdAt: new Date().toLocaleString()
  });

  return res.redirect('/?status=Profile+submitted+successfully!');
});

app.post('/submit-feedback', (req, res) => {
  const { topic, message } = req.body;

  if (!topic || !message) {
    return res.redirect('/?status=Please+fill+out+all+Feedback+fields.');
  }

  submissions.push({
    formType: 'Feedback',
    topic,
    message,
    createdAt: new Date().toLocaleString()
  });

  return res.redirect('/?status=Feedback+submitted+successfully!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
