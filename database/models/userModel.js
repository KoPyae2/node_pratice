module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        avatarURL: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        otpVerify: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },

    },
    // {
    // defaultScope: {
    //     attributes: {
    //         exclude: ['password']
    //     }
    // }
    // }
    );
    return User;
}