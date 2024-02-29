module.exports = (seq, DataTypes) => {
    const user_club = seq.define("user_club", {
        "clubID" : {
            "type" : DataTypes.TINYINT,
            "allowNull" : false
        },
        "userID" : {
            "type" : DataTypes.MEDIUMINT.UNSIGNED,
            "allowNull" : false
        }},
        {tableName : "IDBIuser_club"}
    );

    return user_club;
};