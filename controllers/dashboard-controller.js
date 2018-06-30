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

    let sql = "SELECT COUNT(*) FROM `round`";

    switch (req.query.cardtype){
        case 'topworldrecord': {
            let total_records_sql = "SELECT COUNT(*) FROM round";
            let total_players_sql = "SELECT COUNT(*) FROM ranks";

            let jsonRes = {};

            queryDb(total_records_sql).then(function(results){
                jsonRes.total_records = results[0]['COUNT(*)'];

                let db = queryDb(total_players_sql).then(function(results){
                    jsonRes.total_players = results[0]['COUNT(*)'];
                    res.json(jsonRes)
                })
            }).catch((err) => {
                throw err;
            })
            break;
        }
        case 'toppoints': {
            let total_point_sql = "SELECT SUM(`points`) FROM `ranks` WHERE `points` > 0";
            let total_point_avg_sql = "SELECT AVG(`points`) FROM `ranks` WHERE `points` > 100";

            let jsonRes = {};

            queryDb(total_point_sql).then(function(results){
                jsonRes.total_points = results[0]['SUM(`points`)'];
                
                queryDb(total_point_avg_sql).then(function(results){
                    jsonRes.avg_points = results[0]['AVG(`points`)'];
                    res.json(jsonRes);
                })
                
            });
            break;
        }
        case 'maptop': {
            let total_maps_sql = "SELECT COUNT(*) FROM `mapzone` WHERE `type` = 0";
            let total_bonusmaps_avg_sql = "SELECT COUNT(*) FROM `mapzone` WHERE `type` = 7";

            let jsonRes = {};

            queryDb(total_maps_sql).then(function(results){
                jsonRes.total_points = results[0]['COUNT(*)'];

                queryDb(total_bonusmaps_avg_sql).then(function(results){
                    jsonRes.avg_points = results[0]['COUNT(*)'];
                    res.json(jsonRes);
                });
            });
            break;
        }
        default : {
            res.status(404).json({error: 404, msg: 'query not found'});
        }
    }
    // if( == '') {
    //     

    //     result = 
        
    // } else if {
        
    // }
    
    //     else {
    //     console.log('query not found')
    //     res.status(404).json({error: 404, msg:'wrong query'})
    // }
});

module.exports = dashboardController;