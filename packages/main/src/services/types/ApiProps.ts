import {ServerTCP} from 'src/Net/Server/ServerTCP';

export type apiProps = {
  net: {
    createServer: any;
    serverTCP: ServerTCP;
  };
};
