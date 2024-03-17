const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./models');

const indexRouter = require('./routes/index.js');
const clubsRouter = require('./routes/clubs.js');

require('dotenv').config();

express.urlencoded({ extended : false });

app.use(express.json());
app.use(cors({
    origin: "*",
    credential: true
}));

app.get('/userInfo', async (req, res) => {
    const accessKey = req.query.accessKey;

    const results = await db.users.findAll({
        attributes: ['stuid', 'name', 'level'],
        where: {
            accessKey: accessKey
        }
    });

    if (results.length === 0){
        res.json({name: "", stuid: 0});
        return;
    }

    res.json(results[0]);
});

app.use('/', indexRouter);
app.use('/clubs', clubsRouter);

module.exports = app;