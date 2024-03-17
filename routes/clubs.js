const express = require('express');
const db = require('../models');

const router = express.Router();

router.get('/', async (req, res, next) => {
    const result = await db.clubs.findAll();

    res.json(result);
});

router.get('/ordered', async (req, res, next) => {
    let arr;
    const types = await db.clubtype.findAll({
        order: ['id']
    });

    const lists = await db.clubs.findAll({
        include: [
            {
                model: db.users,
                as: 'Leader',
                attributes: ['name', 'stuid']
            }
        ]
    });

    arr = Array.from(Array(types.length), () => Array(0).fill({}));
    arr = arr.map((x, idx) => {
        x = {
            typeIcon: types[idx].icon,
            typeName: types[idx].type,
            maxCount: types[idx].option,
            clubs: []
        };

        return x;
    });

    for (let i = 0; i < lists.length; i++){
        arr[lists[i].type - 1].clubs.push(lists[i]);
    }

    res.json(arr);
});

router.get('/types', async (req, res, next) => {
    const result = await db.clubtype.findAll();

    res.json(result);
});

router.get('/myClubs', async (req, res, next) => {
    const userID = req.params.userID;

    if (!userID){
        res.json({isLogined: false});
        return;
    }

    else{
        let arr;
        const lists = await db.clubs.findAll({
            attributes: ['id', 'name', 'maxPeople'],
            where: {
                leader: userID
            }
        });

        // 1305 류시완 -> 드론 동아리

        arr = Array.from(Array(lists.length), () => Array(0).fill(""));

        arr = arr.map((x, idx) => {
            x = {id: lists[idx].id, name: lists[idx].name, maxPeople: lists[idx].maxPeople};
            return x;
        });

        res.json(arr);
        return;
    }
});

module.exports = router;