import { ServerTCPProps } from "../types/ServerType";
import { createServer, Server, Socket } from "net";

export class ServerTCP {
	host: string;
	port: number;
	connection?: Server;
	constructor({ host = '0.0.0.0', port }: ServerTCPProps){
		this.host = host
		this.port = port
	}
	create(port?: number, callback?: Function ){
		this.port = port || this.port
		if(this.port == null) throw new Error("Port tidak ditemukan!")
		
		this.connection = createServer()
		console.log(this.connection);
		
		this.connection.listen(this.port)
		
		console.log(this.connection);
		
		
		this.connection.on('connection', function(sock: Socket) {
			console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
			// sockets.push(sock);
		
			// sock.on('data', function(data) {
			// 	console.log('DATA from ' + sock.remoteAddress + ': ' data);
			// });
		
			// // Add a 'close' event handler to this instance of socket
			// sock.on('close', function(data) {
			// 	let index = sockets.findIndex(function(o) {
			// 		return o.remoteAddress === sock.remoteAddress && o.remotePort === sock.remotePort;
			// 	})
			// 	if (index !== -1) {
			// 		sockets.splice(index, 1);
			// 	}
			// 	console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
			// });
		});
	}
}