const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./models');

require('dotenv').config();

express.urlencoded({ extended : false });

app.use(express.json());
app.use(cors({
    origin: "*",
    credential: true
}));

const clubRouter = require('./routes/clubs.js')();
app.use("/clubs", clubRouter);

app.get('/userID', async (req, res) => {
    const stuid = req.query.stuid || 0;

    const results = await db.users.findAll({
        attributes: ['id'],
        where: {
            stuid: stuid
        }
    });

    if (results.length == 0){
        res.json({userID: 0});
        return;
    }

    else res.json({userID: results[0].id})
});

app.get('/userInfo', async (req, res) => {
    const userID = req.query.userID;

    const results = await db.users.findAll({
        attributes: ['stuid', 'name'],
        where: {
            id: userID
        }
    });

    if (results.length === 0){
        res.json({name: "", stuid: 0});
        return;
    }

    else res.json({name: results[0].name, stuid: results[0].stuid});
});

module.exports = app;