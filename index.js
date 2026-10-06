const express = require('express');
const moment = require('moment');

const app = express();
const PORT = 3000;

app.get('/timestamp', (req, res) => {
    res.json({
        timestamp: moment().format()
    });
});

app.get('/health', (req, res) => {
    res.json({
        status: 'ok'
    });
});

app.get('/stats', (req, res) => {
    res.json({
        uptime: process.uptime(),
        nodeVersion: process.version,
        timestamp: new Date().toISOString()
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

