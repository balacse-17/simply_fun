const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const submissions = [];

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));

const isSafeText = (value, min = 1, max = 150) =>
  typeof value === 'string' && value.trim().length >= min && value.trim().length <= max;

const isValidEmail = (email) =>
  typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const parseRating = (value) => {
  const rating = Number.parseInt(value, 10);
  return Number.isInteger(rating) && rating >= 1 && rating <= 5 ? rating : null;
};

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Task 2: Inline Styles, Validation, and Interaction',
    submissions,
    statusMessage: req.query.status || ''
  });
});

app.post('/submit-profile', (req, res) => {
  const { fullName, email, age, favoriteColor, bio, newsletter } = req.body;
  const parsedAge = Number.parseInt(age, 10);

  if (!isSafeText(fullName, 3, 60)) {
    return res.redirect('/?status=Profile+name+must+be+between+3+and+60+characters.');
  }

  if (!isValidEmail(email)) {
    return res.redirect('/?status=Please+provide+a+valid+email+address.');
  }

  if (!Number.isInteger(parsedAge) || parsedAge < 13 || parsedAge > 120) {
    return res.redirect('/?status=Age+must+be+a+number+between+13+and+120.');
  }

  if (!/^#[0-9A-Fa-f]{6}$/.test((favoriteColor || '').trim())) {
    return res.redirect('/?status=Please+choose+a+valid+favorite+color.');
  }

  if (!isSafeText(bio, 10, 200)) {
    return res.redirect('/?status=Bio+must+be+between+10+and+200+characters.');
  }

  submissions.push({
    formType: 'Profile',
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
    age: parsedAge,
    favoriteColor: favoriteColor.trim(),
    bio: bio.trim(),
    newsletter: newsletter === 'on',
    createdAt: new Date().toLocaleString()
  });

  return res.redirect('/?status=Profile+submitted+and+validated+successfully!');
});

app.post('/submit-feedback', (req, res) => {
  const { topic, message, sentiment, contactTime, rating } = req.body;
  const parsedRating = parseRating(rating);

  if (!['Website', 'Support', 'Feature Request', 'Other'].includes(topic)) {
    return res.redirect('/?status=Please+select+a+valid+feedback+topic.');
  }

  if (!isSafeText(message, 15, 500)) {
    return res.redirect('/?status=Feedback+message+must+be+between+15+and+500+characters.');
  }

  if (!['Positive', 'Neutral', 'Negative'].includes(sentiment)) {
    return res.redirect('/?status=Please+choose+a+valid+sentiment+option.');
  }

  if (!['Morning', 'Afternoon', 'Evening'].includes(contactTime)) {
    return res.redirect('/?status=Please+choose+a+valid+preferred+contact+time.');
  }

  if (parsedRating === null) {
    return res.redirect('/?status=Please+provide+a+rating+between+1+and+5.');
  }

  submissions.push({
    formType: 'Feedback',
    topic,
    message: message.trim(),
    sentiment,
    contactTime,
    rating: parsedRating,
    createdAt: new Date().toLocaleString()
  });

  return res.redirect('/?status=Feedback+submitted+and+validated+successfully!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
