const Gamedig = require('gamedig');

let serversInfo = [];
const serversList = ['176.57.141.141:27515', '176.57.128.36:27025', 
'176.57.128.36:27035', '176.57.141.141:27535'];

function queryServerMiddleware(req, res, next ){

    for (server of serversList) {
        Gamedig.query({
            type: 'csgo',
            host: server.split(':')[0],
            port: server.split(':')[1]
        }).then((state) => {
            serversInfo.push({
                serverName: state.name,
                serverIP: server,
                serverMap: state.map,
                serverOnlinePlayers: state.players.length,
                serverMaxPlayers: state.maxplayers
            })
        }).catch((error) => {
            console.log(`Server: ${server} is offline`);
        });
    }
    req.serversStates = serversInfo;
    serversInfo = [];
    next()
}

module.exports = queryServerMiddleware;