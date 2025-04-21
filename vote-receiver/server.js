const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Store votes in memory (in a real application, you'd use a database)
let receivedVotes = [];

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Route to receive vote data
app.post('/receive-vote', (req, res) => {
    const voteData = req.body;
    console.log('Received vote data:', voteData);
    
    // Add timestamp for when we received the data
    voteData.receivedAt = new Date().toISOString();
    
    // Store the vote
    receivedVotes.push(voteData);
    
    res.json({ success: true, message: 'Vote data received successfully' });
});

// Route to get all received votes
app.get('/api/votes', (req, res) => {
    res.json(receivedVotes);
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Vote receiver server running at http://localhost:${port}`);
}); 