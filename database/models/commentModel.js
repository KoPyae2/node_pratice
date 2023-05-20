module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define("comment", {
        text: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    return Comment;
};