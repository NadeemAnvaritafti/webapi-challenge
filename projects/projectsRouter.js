const express = require('express');
const db = require('../data/helpers/projectModel');

const router = express.Router();

router.use(express.json());



module.exports = router;