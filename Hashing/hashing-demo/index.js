const bcrypt = require('bcrypt');
const { sequelize } = require('./db');
const { User } = require('./models');

const SALT_COUNT = 10;

const run = async () => {
  try {

    /* *************** SETUP *************** */
    await sequelize.sync({force: true});
    const userJohn = {username: 'johnDoe', password: 'test123'};
    const userJohn2 = {username: 'johnDoe2', password: 'test123'};

    console.log("Let's start hashing some passwords!");

    /* *************** START DEMO *************** */
    
    //hashing a password with bcrypt.hash

    const hashedPassword = await bcrypt.hash(userJohn.password, SALT_COUNT);
    const hashedPassword2 = await bcrypt.hash(userJohn2.password, SALT_COUNT);

    console.log(hashedPassword);
    console.log(hashedPassword2);

    await User.create()



    //comparing a password with bcrypt.compare

    const isMatch  = await bcrypt.compare(userJohn.password, hashedPassword)


    
    
  } catch (error) {
    console.error(error)
  } finally {
    sequelize.close();
  }
}


run();
