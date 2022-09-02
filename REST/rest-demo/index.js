const express = require('express');
const app = express();
const { Dog } = require('./db');
const { sequelize } = require('./db/db');
const { Op } = require('sequelize');

app.use(express.json());
app.use(express.urlencoded({extended:true}));

/**
 * middleware that gets dogs that match query strings
 * not as slow as a dogs.findAll and a dogs.filter
 * not reliant on any information passed in by user
 * get req.query object, use that object in the findAll
 */

const matchingDogs = async (req, res, next) => {
  const queryObject = req.query;
  let dogs;
  //console.log(queryObject);
  try {
    if (Object.keys(queryObject).length !== 0) {
      dogs = await Dog.findAll({where: queryObject});
    } else {
      dogs = await Dog.findAll();
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
  
  
  res.locals.dogs = dogs;
  next();
}

/**
 * this function which resembles the curriculum solutions requires information about the query strings passed in to run correctly
 * depending on client-side input != restful
 * 
 * 
 */

// app.get('/dogs/', async (req, res, next) => {

//   if(Object.keys(req.query).length !== 0) {
//     const {color} = req.query 
//     const dogs = await Dog.findAll({where: {color}})
//     res.send(dogs)
//   } else {
//     const dogs = await Dog.findAll()
//     res.send(dogs)
//   }

// });

/**
 * the way I initially set up this endpoint only depends on the models
 * it isn't DRY, those if statements are repetitive and if there are a huge amount of columns, you'd need a lot of them
 * also, if there is a huge amount od data in your db, you have to .findAll AND .filter, which could be quite slow
 * 
 * 
 */


app.get('/dogs/', matchingDogs, async (req, res, next) => {
  try {
    // const dogs = await Dog.findAll();

    // const { name, breed, color, description } = req.query;

    // const matchingDogs = dogs.filter(dog => {
    //   if (name && !(dog.name === name)) {
    //     return;
    //   };
    //   if (breed && !(dog.breed === breed)) {
    //     return;
    //   };
    //   if (color && !(dog.color === color)) {
    //     return;
    //   };
    //   if (description && !(dog.description === description)) {
    //     return;
    //   };

    //   return dog;
    // });

    res.send(res.locals.dogs);
  } 
  catch (error) {
    next(error)
  }
});




const { PORT = 4000 } = process.env;

app.listen(PORT, () => {
  sequelize.sync({ force: false });
  console.log(`Dogs are ready at http://localhost:${PORT}`);
});
