const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const DATA_FILE = path.join(__dirname, 'submissions.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

function readData() {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading data file', e);
    return [];
  }
}

function writeData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Error writing data file', e);
  }
}

app.get('/api/submissions', (req, res) => {
  const data = readData();
  res.json(data);
});

app.post('/api/submissions', (req, res) => {
  const submission = req.body || {};
  if (!submission.id) submission.id = Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
  const data = readData();
  data.push(submission);
  writeData(data);
  res.status(201).json(submission);
});

app.put('/api/submissions/:id', (req, res) => {
  const id = req.params.id;
  const data = readData();
  const idx = data.findIndex(s => String(s.id) === String(id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  data[idx] = Object.assign({}, data[idx], req.body);
  writeData(data);
  res.json(data[idx]);
});

app.delete('/api/submissions/:id', (req, res) => {
  const id = req.params.id;
  const data = readData();
  const idx = data.findIndex(s => String(s.id) === String(id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const removed = data.splice(idx, 1)[0];
  writeData(data);
  res.json({ ok: true, removed });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
