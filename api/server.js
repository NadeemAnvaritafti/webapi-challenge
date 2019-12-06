const express = require('express');
const projectsRouter = require('../routers/projectsRouter');
const actionsRouter = require('../routers/actionsRouter');

const server = express();

server.use('/api/projects', projectsRouter);
server.use('/api/actions', actionsRouter);




module.exports = server;