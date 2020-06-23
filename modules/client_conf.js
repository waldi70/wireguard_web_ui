const sqlite = require('better-sqlite3')('./db/wireguard.db');
const fs = require('fs');


exports.clientConfig = (interface, client) => {
	let sql = `SELECT port,endpoint,dns,pkey FROM server where interface = ?`;
	let serverEntry = sqlite.prepare(sql).get(interface);
	sql = `SELECT privkey,allowip,prekey,allowipc FROM client where name = ?`;
	let clientEntry = sqlite.prepare(sql).get(client);
	let conf = `[Interface]\n`;
	conf = conf + `PrivateKey = ${clientEntry.privkey}\n`;
	conf = conf + `Address = ${clientEntry.allowip}\n`;
	conf = conf + `DNS = ${serverEntry.dns}\n`;
	conf = conf + `\n`;
	conf = conf + `[Peer]\n`;
	conf = conf + `Publickey = ${serverEntry.pkey}\n`;
	conf = conf + `PresharedKey = ${clientEntry.prekey}\n`;
	conf = conf + `Endpoint = ${serverEntry.endpoint}:${serverEntry.port}\n`;
	conf = conf + `AllowedIPs = ${clientEntry.allowipc}`;
	return conf;
}

exports.clientCard = (client) => {
	console.log(`CLient : ${client}`);
	if (client == 0){
		let sql = `SELECT name,pkey,allowip,allowipc FROM client`;
		let client = sqlite.prepare(sql).all();
		let content = fs.readFileSync('./templates/client.tpl');
		content = content.toString();
		//console.log(content);
		var render = '';
		client.forEach(element => {
			render = render + content.replace(/\%NAME\%/gi,element['name']);
			//render = render + content;
			render = render.replace("%IP%",element['allowip']);
		});
		//render = render + content +content;
		console.log(render);
	}
	return render;
}

