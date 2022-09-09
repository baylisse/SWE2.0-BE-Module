const {Sequelize, sequelize} = require('./db');

const Subscriber = sequelize.define('subscriber', {
  name: Sequelize.STRING,
  email: Sequelize.STRING,
  state: Sequelize.STRING
});

module.exports = { Subscriber };