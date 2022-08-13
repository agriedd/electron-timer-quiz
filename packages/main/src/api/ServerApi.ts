import {BrowserWindow, ipcMain} from 'electron';
import {ServerTCP} from '../Net/Server/ServerTCP';
import {ResponseToRenderer, ServerCreateReponse} from '../Net/types/ServerType';

var server: ServerTCP;
var port: number = 3000;
var host: string;

export const serverApi = (window: BrowserWindow) => {
  ipcMain.handle('server:start', startServer);
};

const startServer = async (): Promise<ResponseToRenderer> => {
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
    };
  } else {
    return {
      message: 'Gagal',
      status: false,
      error,
    };
  }
};

type ErrorInterface = {
  message: string;
};
