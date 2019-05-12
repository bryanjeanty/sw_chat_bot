// load dependencies
require('dotenv').config({ path: `${__dirname}/../.env` });
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const https = require('https');

// test
console.log(path.join(__dirname, '../.env'));

// load files
const processMessage = require('../process-message.js');

// initial configuration
const { PORT } = process.env;
const dev = process.env.NODE_ENV !== 'production';
const root = dev ? `https://localhost:${PORT}` : process.env.PRODUCTION_URL;
const app = express();

const options = {
   key: fs.readFileSync('server/key.pem', 'utf8'),
   cert: fs.readFileSync('server/server.crt', 'utf8')
};


// setup https server
const server = https.createServer(options, app).listen(PORT, () => {
   console.log(`Server running on ${root}`);
});


// setup http server
//const server = app.listen(PORT, () => console.log(`Running on ${root}`));

// setup middleware
app.use(cors());
app.use(express.json());

// setup routes
app.post('/chat', (request, response) => {
   const { message } = request.body;
   console.log(message);
   processMessage(message);
});
