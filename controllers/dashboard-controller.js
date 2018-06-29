const dashboardController = require('express').Router();
const db = require('../models/common-db');

let newMapsResult = [];

dashboardController.get('/most-word-records', (req, res) => {
    const sql = "SELECT COUNT(*), `name`, `auth` FROM (SELECT * FROM `round` WHERE `rank` = 1) AS s GROUP BY `auth` ORDER BY 1 DESC LIMIT 10";
    db.query(sql, (err, result, fields) => {
        if (err) throw err;
        res.json(result)
    });
})

dashboardController.get('/most-points', (req, res) => {
    const sql = "SELECT `points`, `lastname`, `auth` FROM `ranks` ORDER BY `points` DESC LIMIT 10";
    db.query(sql, (err, result, fields) => {
        if (err) throw err;
        res.json(result)
    });
})

dashboardController.get('/top-maps', (req, res) => {
    const sql = "SELECT `map`, COUNT(*) FROM `round` GROUP BY `map` ORDER BY 2 DESC LIMIT 10";
    db.query(sql, (err, result, fields) => {
        if (err) throw err;
        res.json(result)
    });
})

dashboardController.get('/new-maps', (req, res) => {

    const sql = "SELECT `map`, SUM(`type`) FROM `mapzone` WHERE `type` = 0 OR `type` = 7 GROUP BY `map` ORDER BY `id` DESC LIMIT 10";

    db.query(sql, (err, results, fields) => {
        if (err) throw err;
        for (result in results) {
            let mapname = results[result]['map'];

            db.query(`SELECT COUNT(*) FROM round WHERE map = '${mapname}';`, (err, record, fields) => {
                newMapsResult.push({
                    map_name: mapname,
                    map_record: record[0]['COUNT(*)']
                })
            });
        }
        res.json(newMapsResult);
        newMapsResult = [];
    });
})

module.exports = dashboardController;