module.exports = (sequelize, DataTypes) => {
    const Blog = sequelize.define("blog", {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        body: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        viewsCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        likeCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        commentCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        imageURL: {
            type: DataTypes.STRING,
        },
    });

    return Blog;
};