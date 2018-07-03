const maptopController = require('express').Router();
const queryDb = require('../models/common-db');

let resJsonTopPoints = {};

// Update the servers info once every 30 second default
// setInterval(query_server, process.env.UPDATE_INTERVAL || 30000);

maptopController.get('/', (req, res) => {
    let map = req.query.map;
    let style = req.query.style;
    let track = req.query.track;

    // if(map == null || style == null || track == null) {
    //     res.status(400).json({error: 400, msg: 'bad request'})
    // }

    // if(style == -1){
    //     if(track == -1){
    //         queryDb(`SELECT COUNT(*) FROM round WHERE map LIKE '${map}'`).then((stats) =>{
    //             res.json(stats)
    //         })
    //         console.log(map, style, track)
    //     }
    //     else{
    //         queryDb(`SELECT COUNT(*) FROM round WHERE map LIKE '${map}' AND track = %{track} '${map}'`).then((stats) =>{
    //             res.json(stats)
    //         })
    //     }
    // }
    // else{
    //     if(track == -1){

    //         queryDb(`SELECT COUNT(*) FROM round WHERE map LIKE '${map}' AND style = '${style}'`).then((stats) =>{
    //             res.json(stats);
    //         })
    //     }
    //     else{
    //         queryDb(`SELECT COUNT(*) FROM round WHERE map LIKE '${map}' AND track = '${track}' AND style = '${style}'`).then((stats) =>{
    //             res.json(stats);
    //         })
    //     }
    // }

    if (style == -1) {
        if (track == -1) {
            queryDb(`SELECT rank, name, auth, time, style, track, date FROM round WHERE map LIKE '${map}' ORDER BY time ASC LIMIT 25;`).then((stats) => {
                res.json(stats);
            })
        }
        else {
            []
            queryDb(`SELECT rank, name, auth, time, style, track, date FROM round WHERE map LIKE '${map}' AND track = '${track}' ORDER BY time ASC LIMIT 25;`).then((stats) => {
                res.json(stats);
            })
        }
    }
    else {
        if (track == -1) {
            queryDb(`SELECT rank, name, auth, time, style, track, date FROM round WHERE map LIKE '${map}' AND style = '${style}' ORDER BY time ASC LIMIT 25;`).then((stats) => {
                res.json(stats);
            })
        }
        else {
            queryDb(`SELECT rank, name, auth, time, style, track, date FROM round WHERE map LIKE '${map}' AND track = '${track}' AND style = '${style}' ORDER BY time ASC LIMIT 25;`).then((stats) => {
                res.json(stats);
            })
        }
    }
});

maptopController.get('/topby', (req, res) => {
    switch (req.query.by) {

        case 'points': {
            let promises = [];

            queryDb("SELECT points, lastname, auth, lastplay FROM ranks ORDER BY points DESC LIMIT 25;").then((stats) => {

                let tmp = JSON.parse(JSON.stringify(stats))

                for (let entry of tmp) {
                    let friendlySID = entry.auth.slice(10);

                    promises.push(queryDb(`SELECT AVG(rank) FROM round WHERE auth LIKE '%${friendlySID}';
                        SELECT COUNT(*) FROM round WHERE rank = 1 AND auth LIKE '%${friendlySID}';
                        SELECT COUNT(*) FROM round WHERE auth LIKE '%${friendlySID}';
                        SELECT SUM(finishcount) FROM round WHERE auth LIKE '%${friendlySID}';`))
                }

                Promise.all(promises).then((stats) => {
                    let tmp2 = JSON.parse(JSON.stringify(stats))

                    for (let i = 0; i <= tmp2.length - 1; i++) {
                        resJsonTopPoints[i] = {
                            lastname: tmp[i].lastname,
                            points: tmp[i].points,
                            count_avgrank: tmp2[i][0][0]["AVG(rank)"],
                            count_wrs: tmp2[i][1][0]["COUNT(*)"],
                            count_records: tmp2[i][2][0]["COUNT(*)"],
                            count_finishcount: tmp2[i][3][0]["SUM(finishcount)"],
                            lastplay: tmp[i].lastplay
                        }
                    }
                    res.json(resJsonTopPoints);
                }).catch((err) => {throw err; })

            }).catch((err) => {throw err; });
        }
            break;

        case 'worldrecords': {

            break;
        }
        default: {
            res.status(400).json({ error: 400, msg: 'bad request' });
        }
    }
})

// function query_server() {
//     console.log('this 1-------------------------------------------')
//     let promises = [];

//     queryDb("SELECT points, lastname, auth, lastplay FROM ranks ORDER BY points DESC LIMIT 25;").then((stats) => {

//         let tmp = JSON.parse(JSON.stringify(stats))

//         for (let entry of tmp) {
//             let friendlySID = entry.auth.slice(10);

//             promises.push(queryDb(`SELECT AVG(rank) FROM round WHERE auth LIKE '%${friendlySID}';
//         SELECT COUNT(*) FROM round WHERE rank = 1 AND auth LIKE '%${friendlySID}';
//         SELECT COUNT(*) FROM round WHERE auth LIKE '%${friendlySID}';
//         SELECT SUM(finishcount) FROM round WHERE auth LIKE '%${friendlySID}';
//         `))
//         }

//         Promise.all(promises).then((stats) => {
//             let tmp2 = JSON.parse(JSON.stringify(stats))

//             for (let i = 0; i <= tmp2.length - 1; i++) {
//                 resJsonTopPoints[i] = {
//                     lastname: tmp[i].lastname,
//                     points: tmp[i].points,
//                     count_avgrank: tmp2[i][0][0]["AVG(rank)"],
//                     count_wrs: tmp2[i][1][0]["COUNT(*)"],
//                     count_records: tmp2[i][2][0]["COUNT(*)"],
//                     count_finishcount: tmp2[i][3][0]["SUM(finishcount)"],
//                     lastplay: tmp[i].lastplay
//                 }
//             }

//         }).catch((err) => { console.log('this 1-------------------------------------------'); throw err; })

//     }).catch((err) => { console.log('this 2-----------------------------------------'); throw err;});
// }

module.exports = maptopController;