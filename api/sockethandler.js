const socketHandler = (io, db) => {
    const applicant = io.of('/applicant');
    const leader = io.of('/leader');
    const admin = io.of('/admin');

    io.on('connection', (socket) => {
        socket.on("ping", (data) => {
            socket.emit({msg: "pong"});
        });
    });

    applicant.on('connection', (socket) => {
        let userID;
        let userData;
        
        socket.on("login", async (data) => {
            let _userID = await db.users.findOne({
                attributes: ['id'],
                where: {
                    stuid: data.stuid
                }
            });

            if (!_userID) return;
            userID = _userID.id;

            const info = await db.users.findOne({
                where: {id: userID}
            });

            userData = info;
        });

        socket.on("levelCheck", async () => {
            if (!userID){
                socket.emit("again");
                return;
            }

            const data = await db.users.findOne({
                attributes: ['level'],
                where: {
                    id: userID
                }
            });

            if (!data) return;

            socket.emit("yourLevel", data.level);
        });

        socket.on('myApply', async () => {
            if (!userID) return;

            const applies = await db.apply.findAll({
                where: {
                    userID: userID
                }
            });

            socket.emit('yourApply', applies);
        });

        socket.on("init", async () => {
            if (!userID){
                socket.emit('again');
                return;
            }

            const applies = await db.apply.findAll({
                where: {
                    userID: userID
                }
            });

            socket.emit('yourApply', applies);
            socket.emit('yourUserData', userData);
        });

        socket.on('update', async (data) => {
            if (!userID) return;
            
            const clubID = data.clubID;
            const clubData = await db.clubs.findOne({
                where: {
                    id: clubID
                }
            });
            const applied = await db.apply.findOne({
                where: {
                    clubID: clubID,
                    userID: userID
                }
            });

            if (!applied){
                if (data.applied){
                    console.log('error occured at user applyInfo');
                    return;
                }

                const jimang = (data.jimang != null) ? data.jimang + 1 : null;

                const verify = await db.apply.count({
                    where: {
                        clubID: clubID,
                        userID: userID
                    }
                });

                if (verify > 0) return;

                await db.apply.create({
                    clubID: clubID,
                    userID: userID,
                    type: clubData.type,
                    jimang: jimang,
                    approved: 0
                });

                leader.emit("updateClubs", clubData.type);
                socket.emit("updateApply", userID);
            }

            else{
                if (!data.applied){
                    console.log('error occured at user applyInfo');
                    return;
                }

                const verify = await db.apply.count({
                    where: {
                        clubID: clubID,
                        userID: userID
                    }
                });

                if (verify <= 0) return;

                const apply = await db.apply.findOne({where: {id: applied.id}});
                await apply.destroy();

                leader.emit("updateClubs", clubData.type);
                socket.emit("updateApply", userID);
            }
        });
    });

    leader.on('connection', (socket) => {
        let userID;
        let userData;

        const applyTableName = db.apply.tableName;
        const clubsTableName = db.clubs.tableName;
        const usersTableName = db.users.tableName;

        socket.on("login", async (data) => {
            let _userID = await db.users.findOne({
                attributes: ['id'],
                where: {
                    stuid: data.stuid
                }
            });
            
            userID = _userID.id;

            const info = await db.users.findOne({
                where: {id: userID}
            });
            
            userData = info;
        });

        socket.on("levelCheck", async () => {
            if (!userID){
                socket.emit("again");
                return;
            }

            const data = await db.users.findOne({
                attributes: ['level'],
                where: {
                    id: userID
                }
            });

            if (!data) return;

            socket.emit("yourLevel", data.level);
        });

        socket.on("init", async () => {
            if (!userID){
                socket.emit('again');
                return
            }

            const clubs = await db.clubs.findAll({
                attributes: [
                    'id',
                    'name',
                    'maxPeople',
                    'type',
                    [db.sequelize.literal(`(SELECT COUNT(*) FROM ${applyTableName} as a WHERE a.clubID = clubs.id)`), 'currentPeople']
                ],
                where: {
                    leader: userID
                }
            });

            hisClub = clubs.map(x => x.id);

            const sqlQuery =
            `SELECT a.id, a.clubID, a.jimang, a.type, JSON_OBJECT('name', u.name, 'stuid', u.stuid, 'id', u.id) AS userInfo
            FROM ${applyTableName} a
            JOIN ${usersTableName} u ON a.userID = u.id
            WHERE a.clubID in (${hisClub.join(',')})
            ORDER BY a.clubID ASC;`;

            const _applicants = await db.sequelize.query(sqlQuery, {type: db.sequelize.QueryTypes.SELECT});
            let applicants = Array.from(Array(_applicants.length), () => Array(0).fill({}));

            applicants = applicants.map(async (x, idx) => {
                x = _applicants[idx];
                
                const applyID = x.id;
                const applicantID = x.userInfo.id;
                const approved = await db.approved.count({
                    where: {
                        applyID: applyID
                    }
                });
                const clubID = x.clubID;
                let override = 0;

                const hisApplies = await db.apply.count({
                    where: {
                        userID: applicantID,
                        type: x.type,
                        approved: 1,
                        clubID: {
                            [db.Sequelize.Op.not]: clubID
                        }
                    }
                });

                if (hisApplies > 0) override = 2;
                else{
                    const _hisApplies = await db.apply.count({
                        where: {
                            userID: applicantID,
                            type: x.type,
                            approved: 0,
                            clubID: {
                                [db.Sequelize.Op.not]: clubID
                            }
                        }
                    });

                    if (_hisApplies > 0) override = 1;
                    else override = 0;
                }
                
                const result = {
                    applyID: x.id,
                    name: x.userInfo.name,
                    stuid: x.userInfo.stuid,
                    jimang: x.jimang,
                    clubID: x.clubID,
                    override: override,
                    approved: approved
                };
                return result;
            });

            // 1305 류시완 -> 드론 동아리
            
            socket.emit('yourClubs', clubs);
            Promise.all(applicants).then(results => {
                socket.emit("yourApplicants", results);
            });
        });

        socket.on("update", async (data) => {
            if (!userID) return;

            const applyID = data.applyID;
            const approvedBy = userID;

            const clubtype = await db.apply.findOne({
                attributes: ['type'],
                where: {
                    id: applyID
                }
            });

            if (!clubtype) return;

            const verify = await db.apply.findOne({
                where: {
                    id: applyID
                }
            });
            
            if (!verify) return;

            console.log(verify, applyID);

            if (verify.approved == 0){
                const verify2 = await db.approved.count({
                    where: {
                        applyID: applyID
                    }
                });

                if (verify2 > 0) return;
                
                await db.approved.create({
                    applyID: applyID,
                    approvedBy: approvedBy
                });

                if (verify > 0) return;

                const apply = await db.apply.findByPk(applyID);
                apply.approved = 1;
                await apply.save();

                leader.emit("updateClubs", clubtype.type);
                applicant.emit("updateApply", verify.userID);
            }

            else if (verify.approved == 1){
                const verify2 = await db.approved.count({
                    where: {
                        applyID: applyID
                    }
                });

                if (verify2 <= 0) return;
                
                const approved = await db.approved.findOne({where: {applyID: applyID}});
                await approved.destroy();

                const apply = await db.apply.findByPk(applyID);
                apply.approved = 0;
                await apply.save();

                leader.emit("updateClubs", clubtype.type);
                applicant.emit("updateApply", verify.userID);
            }
        });
    });
}

module.exports = socketHandler;
