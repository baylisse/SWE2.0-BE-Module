const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { User } = require('./db/User');
const { Subscriber } = require("./db/Subscriber");
const { sequelize } = require('./db/db');

const app = express();
const port = 4000;
const SALT_COUNT = 10;

sequelize.sync({ force: false });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// require jwt & dotenv
const jwt = require('jsonwebtoken');
require('dotenv').config();

// get JWT_SECRET from .env
const { JWT_SECRET } = process.env;

// middleware

const setUser = async (req, res, next) => {
    try {
        const auth = req.header('Authorization');
        console.log(auth);
        if (!auth) {
            next();
        } else {
            const [, token] = auth.split(' ');
            const user = jwt.verify(token, JWT_SECRET);
            req.user = user;
            next();
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
}



// routes, register && login

app.get("/", async (req, res, next) => {
    res.send("Up and running");
});


app.post('/register', async (req, res, next) => {
    try {
        const {username, password} = req.body;
        const hashed = await bcrypt.hash(password, SALT_COUNT);
        const newUser = await User.create({username, password: hashed});
        const token = jwt.sign({
            id: newUser.id,
            username: newUser.username
        }, JWT_SECRET)
        res.send({message: "success", token})
    } catch(err) {
        console.error(err);
        next(err);
    }
});


app.post('/login', async (req, res, next) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({where: {username}});
        const isMatch = bcrypt.compare(password, user.password);
        if (isMatch) {
            const { id, username } = user;
            const token = jwt.sign({
                id,
                username
            }, JWT_SECRET)
            res.send({message: "success", token})
        } else {
            res.sendStatus(401).send('user not found');
        }
    } catch(err) {
        console.error(err);
        next(err);
    }
});

app.post('/subscribers', setUser, async (req, res, next) => {
    if (!req.user) {
        res.sendStatus(401);
    } else {
        const { name, email, state } = req.body;
        const newSubscriber = await Subscriber.create({ name, email, state });
        res.send({status:201, subscriber: {
            name: newSubscriber.name, 
            email: newSubscriber.email, 
            state: newSubscriber.state
        }});   
    }
});





app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })