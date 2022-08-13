import {ServerTCP} from '../Net/Server/ServerTCP';
import {ServerTCPProps} from '../Net/types/ServerType';

const createServer = ({port}: ServerTCPProps): ServerTCP => {
  return new ServerTCP({port});
};

export const net = {
  createServer,
  serverTCP: ServerTCP,
};
