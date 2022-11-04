require('dotenv').config('.env');
const cors = require('cors');
const express = require('express');
const { auth } = require('express-openid-connect');
const morgan = require('morgan');


// create express app
const app = express();
// pull PORT from environment variables
const { PORT = 3000 } = process.env;

// middleware
// enable CORS
app.use(cors());
// log requests to console
app.use(morgan('dev'));
// parse request body
app.use(express.json());
app.use(express.urlencoded({extended:true}));

/* ************ START OIDC CODE ************ */
//get env variables
const {
  AUTH0_SECRET,
  AUTH0_AUDIENCE,
  AUTH0_CLIENT_ID,
  AUTH0_BASE_URL
} = process.env;

// define the config object 

const config = {
  authRequired: true,
  auth0Logout: true,
  secret: AUTH0_SECRET,
  clientID: AUTH0_CLIENT_ID,
  baseURL: AUTH0_AUDIENCE,
  issuerBaseURL: AUTH0_BASE_URL
};

    
// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));


// create a GET / route handler that sends back Logged in or Logged out
// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? `
    <h2 style="text-align: center;">My Web App, Inc.</h2>
    <h2>Welcome, ${req.oidc.user.name}</h2>
    <p><b>Username: ${req.oidc.user.email}</b></p>
    <p>${req.oidc.user.email}</p>
    <img src="${req.oidc.user.picture}" alt="${req.oidc.user.name}">
    ` : 'logged out')
})



/* ************ END OIDC CODE ************ */

// error handling middleware
app.use((error, req, res, next) => {
    console.error('SERVER ERROR: ', error);
    if(res.statusCode < 400) res.status(500);
    res.send({error: error.message, name: error.name, message: error.message});
  });
  
  app.listen(PORT, () => {
    console.log(`Server is up at http://localhost:${PORT}`);
  });