const express = require('express');
const moment = require('moment');

const app = express();
const PORT = 3000;

app.get('/timestamp', (req, res) => {
    res.json({
        timestamp: moment().format()
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

