module.exports = (seq, DataTypes) => {
    const Approved = seq.define("approved", {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        applyID: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        approvedBy: {
            type: DataTypes.MEDIUMINT.UNSIGNED,
            allowNull: false
        }},
        {tableName : "approved"}
    );

    Approved.associate = (models) => {
        Approved.belongsTo(models.apply, {
            foreignKey: "applyID",
            as: "ApplyID",
            targetKey: "id",
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        });

        Approved.belongsTo(models.users, {
            foreignKey: "approvedBy",
            as: "ApprovedBy",
            targetKey: "id",
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        });
    };

    return Approved;
};