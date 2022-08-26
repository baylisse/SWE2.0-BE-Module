const express = require('express');
const app = express();
const { Dog } = require('./db');
const { sequelize } = require('./db/db');
const { Op } = require('sequelize');

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/dogs/', async (req, res, next) => {
  try {
    const dogs = await Dog.findAll();

    const { name, breed, color, description } = req.query;

    const matchingDogs = dogs.filter(dog => {
      if (name && !(dog.name === name)) {
        return;
      };
      if (breed && !(dog.breed === breed)) {
        return;
      };
      if (color && !(dog.color === color)) {
        return;
      };
      if (description && !(dog.description === description)) {
        return;
      };

      return dog;
    });

    res.send(matchingDogs);
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
