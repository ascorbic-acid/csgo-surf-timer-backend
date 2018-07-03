const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').load();
const dashboardController = require('./controllers/dashboard-controller');
const statusController = require('./controllers/status-controller');
const maptopController = require('./controllers/maptop-controller');

app.use(morgan('dev'))
app.use(cors());
//app.disable('etag');
app.use('/assets', express.static('assets'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true})); 
  
app.use(`/${process.env.BASE_API}/dashboard`, dashboardController);
app.use(`/${process.env.BASE_API}/status`, statusController);
app.use(`/${process.env.BASE_API}/maptop`, maptopController);

app.get(`/`, (req, res, next) => {
    res.status(404).end();
});

app.listen(process.env.API_PORT, console.log(`backend run on port ${process.env.API_PORT}`));