const dbConfig = require("../dbConfig.js");
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(dbConfig.DBNAME, dbConfig.USERNAME, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,

    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require('./userModel.js')(sequelize, DataTypes);
db.blog = require('./blogModel.js')(sequelize, DataTypes);
db.comment = require('./commentModel.js')(sequelize, DataTypes);

const User = db.user;
const Blog = db.blog;
const Comment = db.comment;

User.hasMany(Blog, { onDelete: "CASCADE" });
Blog.belongsTo(User);

User.hasMany(Comment, { onDelete: "CASCADE" });
Comment.belongsTo(User);
Blog.hasMany(Comment, { onDelete: "CASCADE" });
Comment.belongsTo(Blog);

module.exports = db;