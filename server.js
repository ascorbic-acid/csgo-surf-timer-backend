const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').load();
const dashboardController = require('./controllers/dashboard-controller');
const statusController = require('./controllers/status-controller');

// initialize the php parser factory class
var engine = require('php-parser');
var transpiler = require('php-transpiler');

app.use(morgan('dev'))
app.use(cors());
app.use('/assets', express.static('assets'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true})); 
  
app.use(`/${process.env.BASE_API}/dashboard`, dashboardController);
app.use(`/${process.env.BASE_API}/status`, statusController);


app.get(`/${process.env.BASE_API}`, (req, res, next) => {
    res.json({message: 'welcome to timer api'})
});

app.listen(process.env.API_PORT, console.log(`backend run on port ${process.env.API_PORT}`));