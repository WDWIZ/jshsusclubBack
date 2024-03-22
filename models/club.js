module.exports = (seq, DataTypes) => {
    const Club = seq.define("clubs", {
        id: {
            type: DataTypes.TINYINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        leader: {
            type: DataTypes.MEDIUMINT.UNSIGNED
        },
        subleader: {
            type: DataTypes.MEDIUMINT.UNSIGNED
        },
        maxPeople: {
            type: DataTypes.TINYINT
        },
        type: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 1
        }},
        
        {timestamps: false,
        tableName: "clubs"}
    );

    Club.associate = (models) => {
        Club.belongsTo(models.users, {
            foreignKey: "leader",
            as: "Leader",
            targetKey: "id",
            onDelete: "SET NULL",
            onUpdate: "CASCADE"
        });

        Club.belongsTo(models.users, {
            foreignKey: "subleader",
            as: "Subleader",
            targetKey: "id",
            onDelete: "SET NULL",
            onUpdate: "CASCADE"
        });

        Club.belongsTo(models.clubtype, {
            foreignKey: "type",
            targetKey: "id",
            onDelete: "SET DEFAULT",
            onUpdate: "CASCADE"
        })

        Club.belongsToMany(models.users, {
            through: models.apply,
            foreignKey: "clubID",
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        });
    };

    return Club;
};