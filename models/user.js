module.exports = (seq, DataTypes) => {
    const User = seq.define("users", {
        "id" : {
            "type" : DataTypes.MEDIUMINT.UNSIGNED,
            "allowNull" : false,
            "primaryKey" : true
        },
        "name" : {
            "type" : DataTypes.STRING,
            "allowNull" : false
        },
        "stuid" : {
            "type" : DataTypes.SMALLINT.UNSIGNED,
            "allowNull" : false,
            "unique" : true
        }},
        {timestamps : false,
        tableName : "IDBIusers"}
    );

    User.associate = (models) => {
        User.belongsToMany(models.clubs, {
            through: models.user_club,
            foreignKey: "userID"
        });
    };

    return User;
};