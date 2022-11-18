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
    const hash1 = await bcrypt.hash(userJohn.password, SALT_COUNT);
    console.log("hashed: ", hash1);
    const hash2 = await bcrypt.hash(userJohn2.password, SALT_COUNT);
    console.log("hashed 2: ", hash2);


    //comparing a password with bcrypt.compare
    const match = await bcrypt.compare(userJohn.password, hash1);
    console.log(match);


    // create a user with a hashed password
    const createdUser = await User.create({username: userJohn.username, password: hash1});
  


    
    
  } catch (error) {
    console.error(error)
  } finally {
    sequelize.close();
  }
}


run();
