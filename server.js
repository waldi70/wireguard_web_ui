const path = require('path');
const http = require('http');
const https = require('https');
const express = require('express');
const socketio = require('socket.io');
const app = express();
//const server = https.createServer(credentials, app);
//const io = socketio(server);
const fs = require('fs');
const sqlite = require('sqlite3');
const exec = require('child_process').exec;
const xmldoc = require('xmldoc');
const clientConf = require('./modules/client_conf');
var eth = '';
var timer;
//var conf = conf = clientConf.clientConfig("wg0", "d.walraet");
//console.log(conf);
// Certificate
const privateKey = fs.readFileSync('/etc/letsencrypt/live/dwalraet.ddns.net/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/dwalraet.ddns.net/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/dwalraet.ddns.net/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};
const server = https.createServer(credentials, app);
const io = socketio(server);
// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/clients/:id', function(req, res){
	res.setHeader('content-Type', 'text/plain');
	res.end(clientConf.clientConfig('wg0',req.params.id));
});

function makeRxTx(tbl,p){
	var tbl1 = tbl.split(/[\r\n]/);
	var tmp = tbl1[p].trim();
        tmp = tmp.replace(/\s{2,}/g, "|");
        var v = tmp.split('|');
	return v;
};

function makeVnstat(eth,laps){
	function createStringDate(minus){
		var date = new Date();
		var time = date.getTime();
		if (minus != 0) date.setTime(time-minus);
		var stringDate = '';
		stringDate = date.getFullYear();
		if ((parseInt(date.getMonth()+1,10)) < 10) stringDate = stringDate + '-0' + parseInt(date.getMonth()+1,10); else stringDate = stringDate + '-' + parseInt(date.getMonth()+1,10);
		if (parseInt(date.getDate(),10) < 10) stringDate = stringDate + '-0' + date.getDate(); else stringDate = stringDate + '-'  + date.getDate();
		if (parseInt(date.getHours(),10) < 10) stringDate = stringDate + ' 0' + date.getHours(); else stringDate = stringDate + ' '  + date.getHours();
		if (parseInt(date.getMinutes(),10) < 10) stringDate = stringDate + ':0' + date.getMinutes(); else stringDate = stringDate + ':'  + date.getMinutes();
		return stringDate;
	}
	var start = createStringDate(laps);
	var endDate = createStringDate(0);
	var cmd = "vnstat -i "+eth+" -b '"+start+"' -e '"+endDate+"' --json";
	return cmd;
}

function replace(text,pattern,replacment){
	for ( var item in pattern){
		text = text.replace(pattern[item],replacment[item]);
	}
	return text;
}

function convertG(v){
	v = v / 1024;
	return parseInt(v,10);
}

//Run vnstat at 5 minutes
function vnstatFive(){
	//console.log('début du timer eth: '+eth);
	if (eth != ''){
		//console.log('eth :'+eth);
		exec(makeVnstat(eth, 3600000), (err, stdout, stderr, vnstat_data) => {
			if (err) {
				console.erro(`exec error: ${err}`);
				return;
			}
			var label = '';
			var total ='';
			var rx = '';
			var tx = '';
			var obj = JSON.parse(stdout);
			//console.log(obj.interfaces[0]['traffic']['fiveminute'][10]['rx']);
			var objf = obj.interfaces[0]['traffic']['fiveminute'];
			objf.forEach(element => {
				label = label+',"'+element['time']['minute']+'"';
				rx = rx + ',"'+convertG(element['rx'])+'"';
				tx = tx + ',"'+convertG(element['tx'])+'"';
				total = total + ',"'+convertG(element['rx']+element['tx'])+'"';
			});
			label = '"labels":[' +label.substring(1) + '],';
			rx = '"rx":[' + rx.substring(1) + '],';
			tx = '"tx":[' + tx.substring(1) + '],';
			total = '"total":[' + total.substring(1) + ']';
			vnstat_data = "{" + label + rx + tx + total + "}";
			return vnstat_data;
			//console.log('dans exec : '+vnstat_data)
		});
		//console.log('dans if : '+vnstat_data);
		//return vnstat_data;
	}
}

// Run when client connects
io.on('connection', (socket) => {
	console.log('Client connected !');
	socket.on('msg_ready', function(msg){
		timer = setInterval( function(){
			if (eth!=''){
				exec(makeVnstat(eth, 3600000), (err, stdout, stderr) => {
					if (err) {
						console.error(`exec error: ${err}`);
						return;
					}
					var label = '';
					var total ='';
					var rx = '';
					var tx = '';
					var obj = JSON.parse(stdout);
					var objf = obj.interfaces[0]['traffic']['fiveminute'];
						objf.forEach(element => {
							label = label+',"'+element['time']['minute']+'"';
							rx = rx + ',"'+convertG(element['rx'])+'"';
							tx = tx + ',"'+convertG(element['tx'])+'"';
							total = total + ',"'+convertG(element['rx']+element['tx'])+'"';
					});
					label = '"labels":[' +label.substring(1) + '],';
					rx = '"rx":[' + rx.substring(1) + '],';
					tx = '"tx":[' + tx.substring(1) + '],';
					total = '"total":[' + total.substring(1) + ']';
					var vnstat_data = "{" + label + rx + tx + total + "}";
					socket.emit('chartVal',vnstat_data);
				});
			}
		}, 300000);
		console.log('Client is ready');
		fs.readFile('./templates/server.tpl', 'utf-8', function(error, content) {
			var render = content;
			let db = new sqlite.Database('./db/wireguard.db', sqlite.OPEN_READWRITE, (err) => {
				if (err) {
					console.error(err.message);
				}
				console.log('Connected to the wireguard database.');
			});
			db.all(`SELECT DISTINCT interface, ip, port, pkey from server`, [], (err, rows) => {
				if (err) {
					console.error(err.message);
				}
				rows.forEach((row) => {
					eth = row.interface;
					exec('ip -s -h link show '+ row.interface, (err, stdout, stderr) => {
  						if (err) {
    						console.error(`exec error: ${err}`);
    						return;
  						}
						var rx = makeRxTx(stdout,3);
						var tx = makeRxTx(stdout,5);
						render = replace(render,['$rxb$','$rxp$','$rxe$','$rxd$','$rxo$','$rxm$'],rx);
						render = replace(render,['$txb$','$txp$','$txe$','$txd$','$txo$','$txm$'],tx);
						render = render.replace(/\$INT\$/gi, row.interface);
						render = render.replace('$PORT$', row.port);
						render = render.replace('$PKEY$', row.pkey);
						socket.emit('serverContent', render);
					});
				});
				exec(makeVnstat(eth, 3600000), (err, stdout, stderr) => {
					if (err) {
						console.error(`exec error: ${err}`);
						return;
					}
					var label = '';
					var total ='';
					var rx = '';
					var tx = '';
					var obj = JSON.parse(stdout);
					//console.log(obj.interfaces[0]['traffic']['fiveminute'][10]['rx']);
					var objf = obj.interfaces[0]['traffic']['fiveminute'];
					objf.forEach(element => {
						label = label+',"'+element['time']['minute']+'"';
						rx = rx + ',"'+convertG(element['rx'])+'"';
						tx = tx + ',"'+convertG(element['tx'])+'"';
						total = total + ',"'+convertG(element['rx']+element['tx'])+'"';
					});
					label = '"labels":[' +label.substring(1) + '],';
					rx = '"rx":[' + rx.substring(1) + '],';
					tx = '"tx":[' + tx.substring(1) + '],';
					total = '"total":[' + total.substring(1) + ']';
					var render = "{" + label + rx + tx + total + "}";
					socket.emit('chartVal', render);
				});
			});
			db.close((err) => {
				if (err) {
					console.error(err.message);
				}
				console.log('Close the database connection.');
			});
			
		});//end of fs.read
	/*	fs.readFile('./templates/client.tpl', 'utf-8', function(error, content) {
			console.log('Send client conent');
			var render = '';
			for (var i=0;i<4;i++){
				render = render + content.replace('$i$', i);
			}
			socket.emit('clientContent',render);
		});*/
		socket.emit('clientContent',clientConf.clientCard(0));
	});//end of socket.on msg_ready
		//send client config
		socket.on('clientConfig', function(msg){
			socket.emit('clientConfig', clientConf.clientConfig("wg0","d.walraet"));
		});
	//});//end of socket.on msg_ready
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
