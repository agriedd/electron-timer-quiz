import {Server} from 'net';

export type ServerTCPProps = {
  host?: string;
  port: number;
};

export interface ServerCreateReponse {
  status: boolean;
  data: Server | any;
}

export type ResponseToRenderer = {
	message?: string,
	status: boolean,
	data?: any,
	error?: any
}
