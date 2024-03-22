module.exports = (seq, DataTypes) => {
    const Apply = seq.define("apply", {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        clubID: {
            type: DataTypes.TINYINT,
            allowNull: false
        },
        userID: {
            type: DataTypes.MEDIUMINT.UNSIGNED,
            allowNull: false
        },
        type: {
            type: DataTypes.TINYINT
        },
        jimang: {
            type: DataTypes.TINYINT
        },
        approved: {
            type: DataTypes.TINYINT,
            default: 0
        }},
        {tableName : "apply"}
    );

    Apply.associate = (models) => {
        Apply.belongsTo(models.clubtype, {
            foreignKey: "type",
            as: "Type",
            targetKey: "id",
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        });
    }

    return Apply;
};