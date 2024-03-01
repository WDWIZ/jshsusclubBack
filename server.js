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

app.get('/userInfo', async (req, res) => {
    const userID = req.query.userID;

    const results = await db.users.findAll({
        attributes: ['stuid', 'name'],
        where: {
            id: userID
        }
    });

    if (results == null) res.json({stuid: "", name: ""});

    res.json({name: results[0].name, stuid: results[0].stuid});
});

module.exports = app;