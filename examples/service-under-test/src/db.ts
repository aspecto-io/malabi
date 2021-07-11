import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:'
});

const User = sequelize.define('User', {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING
    }
});

User.sync({ force: true }).then(() => {
    User.create({ firstName: "Rick", lastName: 'Sanchez' });
})

export default User;