import {ServerCreateReponse, ServerTCPProps} from '../types/ServerType';
import {createServer, Server, Socket} from 'net';

export class ServerTCP {
  host: string;
  port: number;
  connection?: Server;
  sockets: Array<Socket> = [];

  constructor({host = '0.0.0.0', port}: ServerTCPProps) {
    this.host = host;
    this.port = port;
  }
  create(port?: number, callback?: Function): Promise<ServerCreateReponse> {
    return new Promise<ServerCreateReponse>((resolve, rejects) => {
      this.port = port || this.port;
      if (this.port == null) throw new Error('Port tidak ditemukan!');

      this.connection = createServer();

      this.connection.on('error', (e: NodeJS.ErrnoException) => {
        console.log('yang ini error ', e);

        rejects(e);

        if (e.code === 'EADDRINUSE' && false) {
          console.log('Address in use, retrying...');
          setTimeout(() => {
            this.connection?.close();
            this.connection?.listen(this.port, this.host);
          }, 1000);
        }
      });

      this.connection.on('connection', (sock: Socket) => {
        if (callback != null) callback();

        console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);

        this.sockets.push(sock);

        sock.on('data', function (data: string) {
          console.log('DATA from ' + sock.remoteAddress + ': ' + data);
        });

        // Add a 'close' event handler to this instance of socket
        sock.on('close', (data: string) => {
          let index = this.sockets.findIndex(function (o) {
            return o.remoteAddress === sock.remoteAddress && o.remotePort === sock.remotePort;
          });
          if (index !== -1) {
            this.sockets.splice(index, 1);
          }
          console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
        });
      });

      try {
        this.connection.listen(this.port);
      } catch (e: any) {
        rejects({status: false, data: '😕'});
      }

      if (this.connection.listening) resolve({status: true, data: this.connection});
      else rejects({status: false, data: this.connection});
    });
  }
}
