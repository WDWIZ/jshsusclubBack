module.exports = (seq, DataTypes) => {
    const ClubType = seq.define("clubtype", {
        id: {
            type: DataTypes.TINYINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        icon: {
            type: DataTypes.STRING
        }},
        
        {timestamps: false,
        tableName : "IDBIclubtype"}
    );

    ClubType.associate = (models) => {
        ClubType.hasMany(models.clubs, {foreignKey: "type", sourceKey: "type"});
    };

    return ClubType;
};