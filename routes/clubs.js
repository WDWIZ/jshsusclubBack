const express = require('express');
const { sequelize, clubs, clubtype, user_club, users } = require("../models");
const { Op } = require('sequelize');

function club(){
    const router = express.Router();
    
    router.get('/clubs', async (req, res) => {
        let arr;
        const types = await clubtype.findAll({
            order: ['id']
        });

        const lists = await clubs.findAll({
            include: [
                {
                    model: users,
                    as: 'Leader',
                    attributes: ['name', 'stuid']
                }
            ]
        });

        arr = Array.from(Array(types.length), () => Array(0).fill({}));
        arr = arr.map((x, idx) => {
            x = {
                typeIcon: types[idx].icon,
                typeTitle: types[idx].type,
                clubs: []
            };

            return x;
        });
    
        for (let i = 0; i < lists.length; i++){
            arr[lists[i].type - 1].clubs.push(lists[i]);
        }
    
        res.json(arr);
    });

    router.get('/leaderverify/:userID', async (req, res) => {
        const userID = req.params.userID;

        if (userID == "undefined"){
            res.json({});
            return;
        }

        let arr;
        const lists = await clubs.findAll({
            attributes: ['name'],
            where: {
                leader: userID
            }
        });

        arr = Array.from(Array(lists.length), () => Array(0).fill(""));

        arr = arr.map((x, idx) => {
            x = lists[idx].name;
            return x;
        });

        res.json(arr);
    });
    
    router.get('/applicants', async (req, res) => {
        const applicants = await users.findAll({
            where: {
                stuid: {
                    [Op.lt]: 2000
                }
            }
        });
        res.json(applicants);
    });

    router.get('/applicantsClub/:clubID', async (req, res) => {
        const clubID = (req.params.clubID == "undefined") ? 1 : req.params.clubID;
        let arr;
        const applicants = await user_club.findAll({
            attributes: ["userID"],
            where: {
                clubID: clubID
            }
        });

        arr = Array.from(Array(applicants.length), () => Array(0).fill(0));

        arr = arr.map((x, idx) => {
            x = applicants[idx].userID;
            return x;
        });

        res.json(arr);
    });

    router.get('/applicantInfo/:applicantID', async (req, res) => {
        const clubTableName = clubs.tableName;
        const user_clubTableName = user_club.tableName;

        const applicantID = (req.params.applicantID == "undefined") ? 32020 : req.params.applicantID;
        const applicantInfo = await users.findAll({
            attributes: ["name", "stuid"],
            where: {id: applicantID}
        });

        const joinedClub = await sequelize.query(
            `SELECT *
            FROM ${user_clubTableName}
            INNER JOIN ${clubTableName} ON ${user_clubTableName}.clubID = ${clubTableName}.id
            WHERE ${user_clubTableName}.userID = ${applicantID}
            ORDER BY ${user_clubTableName}.createdAt`,
            {
                replacements: { userID: applicantID },
                type: sequelize.QueryTypes.SELECT
            }
        );

        const arr = {
            applicantInfo: applicantInfo,
            joinedClub: joinedClub
        }

        res.json(arr);
    });

    router.get('/clubInfo/:clubID', async (req, res) => {
        const clubsTableName = clubs.tableName;
        const user_clubTableName = user_club.tableName;
        const usersTableName = users.tableName;

        const clubID = (req.params) ? req.params.clubID : 1;
        const clubInfo = await sequelize.query(
            `SELECT 
            u1.name AS leaderName, 
            u1.stuid AS leaderStuid, 
            u2.name AS subleaderName, 
            u2.stuid AS subleaderStuid, 
            c.name AS clubName
            FROM ${clubsTableName} c
            LEFT JOIN ${usersTableName} u1 ON c.leader = u1.id
            LEFT JOIN ${usersTableName} u2 ON c.subleader = u2.id
            WHERE c.id = ${clubID}`,
            {type: sequelize.QueryTypes.SELECT}
        );

        const joinedApplicants = await sequelize.query(
            `SELECT u.name, u.stuid, uc.createdAt
            FROM ${usersTableName} u
            INNER JOIN ${user_clubTableName} uc ON u.id = uc.userID
            INNER JOIN ${clubsTableName} c ON uc.clubID = c.id
            WHERE c.id = ${clubID}
            ORDER BY uc.createdAt`,
            {
                type: sequelize.QueryTypes.SELECT
            }
        );

        const arr = {
            clubInfo: clubInfo[0],
            joinedApplicants: joinedApplicants
        }

        res.json(arr);
    });
    
    router.post('/pick/:mode', async (req, res, next) => {
        const { clubID, applicantID } = req.body;
        const mode = req.params.mode;

        let msg = "";
    
        if (mode == "add"){
            try{
                await user_club.findOrCreate({
                    where: {
                        userID: applicantID,
                        clubID: clubID
                    },

                    defaults: {
                        userID: applicantID,
                        clubID: clubID
                    }
                }).then((result) => {
                    created = result[1];

                    if (!created) msg = 0;
                    else msg = 1;
                });

                res.status(201).json({msg: msg});
            } catch(err){
                res.send(err);
                next(err);
            }
        }
    
        else if (mode == "remove"){
            try{
                await user_club.destroy({
                    where: {
                        userID: applicantID,
                        clubID: clubID
                    }
                }).then((result) => {
                    created = result[1];

                    if (!created) msg = 0;
                    else msg = 1;
                });

                res.status(201).json({msg: msg});
            } catch(err){
                res.send(err);
                next(err);
            }
        }
    
        else res.send(`Unknown Mode : ${mode}`);
    });

    return router;
}

module.exports = club;