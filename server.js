const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const submissions = [];

const ALLOWED_TOPICS = ['Website', 'Support', 'Feature Request', 'Other'];
const ALLOWED_SENTIMENTS = ['Positive', 'Neutral', 'Negative'];
const ALLOWED_CONTACT_TIMES = ['Morning', 'Afternoon', 'Evening'];

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));

const sanitize = (value) => (typeof value === 'string' ? value.trim() : '');
const hasLength = (value, min, max) => value.length >= min && value.length <= max;
const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isHexColor = (value) => /^#[0-9A-Fa-f]{6}$/.test(value);

const parseIntegerInRange = (value, min, max) => {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
    return null;
  }
  return parsed;
};

const pickFeedbackHints = (message) => {
  const lower = message.toLowerCase();

  const sentiment =
    /great|awesome|love|amazing|excellent|smooth/.test(lower)
      ? 'Positive'
      : /bad|hate|broken|slow|bug|problem|issue|angry/.test(lower)
        ? 'Negative'
        : 'Neutral';

  const topic =
    /support|help|ticket|agent/.test(lower)
      ? 'Support'
      : /feature|request|idea|add|improve/.test(lower)
        ? 'Feature Request'
        : /ui|ux|page|website|design|layout/.test(lower)
          ? 'Website'
          : 'Other';

  return { sentiment, topic };
};

const storeSubmission = (entry) => {
  submissions.unshift(entry);
  if (submissions.length > 50) {
    submissions.pop();
  }
};

app.get('/', (req, res) => {
  const profileCount = submissions.filter((item) => item.formType === 'Profile').length;
  const feedbackCount = submissions.filter((item) => item.formType === 'Feedback').length;

  res.render('index', {
    title: 'Task 3: Advanced CSS Styling and Responsive Design',
    submissions,
    profileCount,
    feedbackCount,
    statusMessage: req.query.status || ''
  });
});

app.post('/submit-profile', (req, res) => {
  const fullName = sanitize(req.body.fullName);
  const email = sanitize(req.body.email).toLowerCase();
  const age = parseIntegerInRange(req.body.age, 13, 120);
  const favoriteColor = sanitize(req.body.favoriteColor);
  const bio = sanitize(req.body.bio);

  if (!hasLength(fullName, 3, 60)) {
    return res.redirect('/?status=Profile+name+must+be+between+3+and+60+characters.');
  }

  if (!isEmail(email)) {
    return res.redirect('/?status=Please+provide+a+valid+email+address.');
  }

  if (age === null) {
    return res.redirect('/?status=Age+must+be+a+number+between+13+and+120.');
  }

  if (!isHexColor(favoriteColor)) {
    return res.redirect('/?status=Please+choose+a+valid+favorite+color.');
  }

  if (!hasLength(bio, 10, 200)) {
    return res.redirect('/?status=Bio+must+be+between+10+and+200+characters.');
  }

  storeSubmission({
    formType: 'Profile',
    fullName,
    email,
    age,
    favoriteColor,
    bio,
    newsletter: req.body.newsletter === 'on',
    createdAt: new Date().toLocaleString()
  });

  return res.redirect('/?status=Profile+submitted+and+validated+successfully!');
});

app.post('/submit-feedback', (req, res) => {
  const topic = sanitize(req.body.topic);
  const message = sanitize(req.body.message);
  const sentiment = sanitize(req.body.sentiment);
  const contactTime = sanitize(req.body.contactTime);
  const rating = parseIntegerInRange(req.body.rating, 1, 5);

  if (!ALLOWED_TOPICS.includes(topic)) {
    return res.redirect('/?status=Please+select+a+valid+feedback+topic.');
  }

  if (!hasLength(message, 15, 500)) {
    return res.redirect('/?status=Feedback+message+must+be+between+15+and+500+characters.');
  }

  if (!ALLOWED_SENTIMENTS.includes(sentiment)) {
    return res.redirect('/?status=Please+choose+a+valid+sentiment+option.');
  }

  if (!ALLOWED_CONTACT_TIMES.includes(contactTime)) {
    return res.redirect('/?status=Please+choose+a+valid+preferred+contact+time.');
  }

  if (rating === null) {
    return res.redirect('/?status=Please+provide+a+rating+between+1+and+5.');
  }

  const aiHints = pickFeedbackHints(message);

  storeSubmission({
    formType: 'Feedback',
    topic,
    message,
    sentiment,
    contactTime,
    rating,
    aiSentimentHint: aiHints.sentiment,
    aiTopicHint: aiHints.topic,
    createdAt: new Date().toLocaleString()
  });

  return res.redirect('/?status=Feedback+submitted+and+validated+successfully!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
