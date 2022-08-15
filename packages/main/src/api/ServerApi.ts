import {BrowserWindow, ipcMain, IpcMainInvokeEvent, net} from 'electron';
import {ServerTCP} from '../Net/Server/ServerTCP';
import {ServerData} from '../Net/types/Connection';
import {ResponseToRenderer, ServerCreateReponse} from '../Net/types/ServerType';
import * as wifi from 'node-wifi';
import * as os from 'os';

var server: ServerTCP;
var port: number = 3000;
var host: string;

const startServer = async (data: IpcMainInvokeEvent, ...args: any): Promise<ResponseToRenderer> => {
  let serverData: ServerData = args[0] as ServerData;

  let error = null;
  if (port == null) return {message: 'Port belum diatur', status: false, error};

  const server = new ServerTCP({port});

  let res = (await server
    .create(port, () => {})
    .catch((e: Error) => {
      error = e.message;
    })) as ServerCreateReponse;

  if (res?.status) {
    return {
      message: 'Berhasil!',
      status: true,
      data: serverData,
    };
  } else {
    return {
      message: 'Gagal',
      status: false,
      error,
    };
  }
};
const getInterfaces = async (data: IpcMainInvokeEvent): Promise<ResponseToRenderer> => {
  wifi.init({
    iface: null,
  });
  let connections: wifi.WiFiNetwork[] | void = [];
  let error: string | null | undefined = null;
  connections = await wifi.scan().catch((err: Error | null) => {
    error = err?.message;
  });

  let interfaces = os.networkInterfaces()['Wi-Fi'];

  if (error)
    return {
      status: false,
      error,
    };
  return {
    data: {interfaces, connections},
    status: true,
  };
};
const getCurrentConnection = async (data: IpcMainInvokeEvent): Promise<ResponseToRenderer> => {
  wifi.init({
    iface: null,
  });
  let connection: wifi.WiFiNetwork[] | void = [];
  let error: string | null | undefined = null;
  connection = await wifi.getCurrentConnections().catch((err: Error | null) => {
    error = err?.message;
  });

  console.log(error);

  if (error)
    return {
      status: false,
      error,
    };
  return {
    data: connection,
    status: true,
  };
};

export const serverApi = (window: BrowserWindow) => {
  ipcMain.handle('interface:list', getInterfaces);
  ipcMain.handle('interface:current', getCurrentConnection);
  ipcMain.handle('server:start', startServer);
};

type ErrorInterface = {
  message: string;
};
