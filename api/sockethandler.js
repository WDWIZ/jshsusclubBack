const socketHandler = (io, db) => {
    io.on('connection', (socket) => {
        let userID;
         
        socket.on("ping", (data) => {
            socket.emit({msg: "pong"});
        });
    
        socket.on("login", async (data) => {
            userID = data.userID;
        });
    
        socket.on('myClubs', async () => {
            if (!userID) return;
    
            let arr;
            const lists = await db.clubs.findAll({
                attributes: ['name', 'id'],
                where: {
                    leader: userID
                }
            });
    
            arr = Array.from(Array(lists.length), () => Array(0).fill(""));
    
            arr = arr.map((x, idx) => {
                x = {id: lists[idx].id, name: lists[idx].name};
                return x;
            });
    
            socket.emit('yourClubs', arr);
        });
    });
}

module.exports = socketHandler;