const express = require('express');   // bring in Express
const app = express();                // create the app (your shop)
// our pretend database: userId -> that user's transactions
const db = {
  7: [
    { to: 'Amazon', amount: 1200 },
    { to: 'Rent', amount: 15000 },
  ],
  8: [
    { to: 'Casino', amount: 90000 },  // user 8's PRIVATE data
  ],
};

app.get('/', (req, res) => {
  res.send('VaultPay API is alive');
});
app.get('/transactions/:userId', (req, res) => {
  const userId = req.params.userId;      // whatever number is in the URL
  // 🐛 BUG 4 (IDOR): we never check if the CALLER is allowed to see this user.
  // We just hand over whatever drawer they asked for.
  res.json(db[userId] || []);
});

app.listen(3000, () => {
  console.log('VaultPay API running on http://localhost:3000');
});