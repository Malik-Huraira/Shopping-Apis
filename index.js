const express = require('express');
const app = express();
app.use(express.json());

app.get('/test', (req, res) => {
    res.send('✅ Works without MySQL!');
});

app.listen(2000, () => {
    console.log('✅ Server running on port 5000');
});
