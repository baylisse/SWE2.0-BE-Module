const express = require('express');
const app = express();
const { Dog } = require('./db');
const { sequelize } = require('./db/db');
const { Op } = require('sequelize');

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/dogs', async (req, res, next) => {
  try {
    const where = {}; // we will pass this into the findAll query after adding key:value pairs from req.query

    for(const key of [name, breed, color, description]) { // based on columns from model, loop through to build out the where obj
      if(req.query[key]) {
        where[key] = {
          [Op.like]: `%${req.query[key]}%` // searches within the string and finds similar matches
        }
      }
    }

    let dogs = await Dog.findAll({where});
    res.send(dogs);
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
