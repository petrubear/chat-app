const express = require('express');
const path = require('path');

const port = process.env.PORT;
const app = express();

const staticFolder = path.join(__dirname, '../public');
app.use(express.static(staticFolder));

app.get('', (req, res) => {
    res.render('index');
});

app.listen(port, () => {
    console.log('listening on port', port)
});