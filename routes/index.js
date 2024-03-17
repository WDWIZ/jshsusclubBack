const express = require('express');
const db = require('../models');

const router = express.Router();

router.get('/', async (req, res, next) => {

});

router.get('/validation', async (req, res, next) => {
    const should = req.params.should;
    const userID = req.params.userID;
})

module.exports = router;