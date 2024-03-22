module.exports = (seq, DataTypes) => {
    const User = seq.define("users", {
        id: {
            type : DataTypes.MEDIUMINT.UNSIGNED,
            allowNull : false,
            primaryKey : true
        },
        name: {
            type : DataTypes.STRING,
            allowNull : false
        },
        stuid: {
            type : DataTypes.SMALLINT.UNSIGNED,
            allowNull : false,
            unique : true
        },
        accessKey: {
            type: DataTypes.STRING,
            unique: true
        },
        level: {
            type: DataTypes.TINYINT
        }},
        {timestamps : false,
        tableName : "users"}
    );

    User.associate = (models) => {
        User.belongsToMany(models.clubs, {
            through: models.apply,
            foreignKey: "userID",
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        });
    };

    return User;
};