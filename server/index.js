const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'ramya@1601',
  database: 'game'
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

app.post('/api/games', (req, res) => {
  const { player1, player2 } = req.body;
  const insertQuery = `INSERT INTO game (player1, player2) VALUES (?, ?)`;
  connection.query(insertQuery, [player1, player2], (err, result) => {
    if (err) {
      console.error('Error creating game:', err);
      res.status(500).json({ message: 'Failed to create game' });
      return;
    }
    res.status(201).json({ id: result.insertId });
  });
});

app.put('/api/games/:id', (req, res) => {
  const gameId = req.params.id;
  const { round, player1Choice, player2Choice, winner } = req.body;
  const updateQuery = `UPDATE game SET round${round}=? WHERE id=?`;
  connection.query(updateQuery, [JSON.stringify({ player1Choice, player2Choice, winner }), gameId], (err, result) => {
    if (err) {
      console.error('Error updating game:', err);
      res.status(500).json({ message: 'Failed to update game' });
      return;
    }
    res.status(200).json({ message: 'Game updated successfully' });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
