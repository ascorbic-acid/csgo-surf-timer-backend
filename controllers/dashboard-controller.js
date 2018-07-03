const dashboardController = require('express').Router();
const queryDb = require('../models/common-db');


let newMapsResult = [];

dashboardController.get('/most-word-records', (req, res) => {
    const sql = "SELECT COUNT(*), `name`, `auth` FROM (SELECT * FROM `round` WHERE `rank` = 1) AS s GROUP BY `auth` ORDER BY 1 DESC LIMIT 10";
    
    queryDb(sql).then(function(results){
        res.json(results)
    }).catch((err)=> {throw err;})
})

dashboardController.get('/most-points', (req, res) => {
    const sql = "SELECT `points`, `lastname`, `auth` FROM `ranks` ORDER BY `points` DESC LIMIT 10";

    queryDb(sql).then(function(results){
        res.json(results)
    }).catch((err)=> {throw err;})
})

dashboardController.get('/top-maps', (req, res) => {
    const sql = "SELECT `map`, COUNT(*) FROM `round` GROUP BY `map` ORDER BY 2 DESC LIMIT 10";

    queryDb(sql).then(function(results){
        res.json(results)
    }).catch((err)=> {throw err;})
})

dashboardController.get('/new-maps', (req, res) => {

    const sql = "SELECT `map`, SUM(`type`) FROM `mapzone` WHERE `type` = 0 OR `type` = 7 GROUP BY `map` ORDER BY `id` DESC LIMIT 10";

    queryDb(sql).then(function(results){
        
        for (result in results) {
            let mapname = results[result]['map'];

            queryDb(`SELECT COUNT(*) FROM round WHERE map = '${mapname}';`).then(function(results){
                
                newMapsResult.push({
                    map_name: mapname,
                    map_record: results[0]['COUNT(*)']
                })
        
            }).catch((err)=> {throw err;})
        }
        res.json(newMapsResult);
        newMapsResult = [];
    }).catch((err)=> {throw err;})
})
// top info cards
dashboardController.get('/infocards', (req, res) => {

    let sqlCards = `SELECT COUNT(*) FROM ranks; SELECT COUNT(*) FROM round; SELECT SUM(points) FROM ranks WHERE points > 0; SELECT AVG(points) FROM ranks WHERE points > 100; SELECT COUNT(*) FROM mapzone WHERE type = 0; SELECT COUNT(*) FROM mapzone WHERE type = 7;`;

    queryDb(sqlCards).then((stats) => {
        let thing = {
            topworldrecord: {
              total_players: stats[0][0]['COUNT(*)'],
              total_records: stats[1][0]['COUNT(*)']
            },
            toppoints: {
              total_points: stats[2][0]['SUM(points)'],
              avg_points: stats[3][0]['AVG(points)']
            },
            maptop: { 
              total_maps: stats[4][0]['COUNT(*)'],
              total_bonusmaps: stats[5][0]['COUNT(*)']
            }
          }
          res.json(thing)
    }).catch((err) => {throw err;})
});

module.exports = dashboardController;