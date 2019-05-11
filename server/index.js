// load dependencies
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// setup initial variables
const { PORT } = process.env;
const dev = process.env.NODE_ENV !== 'production';
const root = dev ? `http://localhost:${PORT}` : process.env.PRODUCTION_URL; 
const app = express();

// setup middleware
app.use(cors());
app.use(express.json());

// setup routes
app.post('/chat', (request, response) => {
   const { message } = request.body;
   console.log(message);
});

// setup port and server
const server = app.listen(PORT, () => {
   console.log(`Server running on ${root}`);
});
