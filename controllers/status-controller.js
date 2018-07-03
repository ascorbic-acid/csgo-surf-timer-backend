const statusController = require('express').Router();
const Gamedig = require('gamedig');

// delay time for each server
const UPDATE_INTERVAL = 30000;
let gLoopCounter = 0
let tmp = [];
let serversInfo = [];
const serversList = [
	'176.57.141.141:27515', '176.57.128.36:27025',
	'176.57.128.36:27035', '176.57.141.141:27535'];


// Update the servers info once every 30 second 
setInterval(query_server, process.env.UPDATE_INTERVAL || 30000);

statusController.get('/', (req, res, next) => {
	res.json(serversInfo);
})
function query_server() {

	Gamedig.query({
		type: 'csgo',
		host: serversList[gLoopCounter].split(':')[0],
		port: serversList[gLoopCounter].split(':')[1]
	}).then((state) => {
		tmp[gLoopCounter] = {
			serverName: state.name,
			serverIP: serversList[gLoopCounter],
			serverMap: state.map,
			serverOnlinePlayers: state.players.length,
			serverMaxPlayers: state.maxplayers
		};
	}).catch((err) => { console.log('error at query server'); throw err })

	if(gLoopCounter == serversList.length - 1){
		gLoopCounter = 0;
		serversInfo = tmp
		tmp = [];
		
		return 0;
	}
	gLoopCounter++
}

module.exports = statusController;