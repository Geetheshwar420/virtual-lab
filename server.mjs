import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import { hashMessage } from './src/lib/md5'; // Import the hashMessage function

const app = express();
app.use(bodyParser.json());

app.post('/api/md5', (req, res) => {
    const { message } = req.body;
    try {
        const hash = hashMessage(message);
        res.json({ hash, length: hash.length });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.use(express.static('dist')); // Serve static files from the dist directory

// Catch-all route to serve the React app
app.get('*', (req, res) => {
    res.sendFile(path.join(path.resolve(), 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});