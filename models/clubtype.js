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
        },
        option: {
            type: DataTypes.TINYINT
        }},
        
        {timestamps: false,
        tableName : "clubtype"}
    );

    ClubType.associate = (models) => {
        ClubType.hasMany(models.clubs, {foreignKey: "type", sourceKey: "type"});
    };

    return ClubType;
};