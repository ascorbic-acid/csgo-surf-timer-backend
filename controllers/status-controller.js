const statusController = require('express').Router();

const queryServerMiddleware = require('../middlewares/query-server');



statusController.get('/', queryServerMiddleware, (req, res) => {
    res.json(req.serversStates);
})
//
statusController.get('/most-world-records', queryServerMiddleware, (req, res) => {

    res.locals.connection.query('SELECT * from users', function (error, results, fields) {
		if (error) throw error;
		res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
	});
})
module.exports = statusController;