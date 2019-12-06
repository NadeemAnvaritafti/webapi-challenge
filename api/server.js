const express = require('express');
const projectsRouter = require('../projects/projectsRouter');

const server = express();

server.use('/api/projects', projectsRouter);




module.exports = server;