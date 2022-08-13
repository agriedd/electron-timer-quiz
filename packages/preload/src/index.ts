/**
 * @module preload
 */

export {sha256sum} from './nodeCrypto';
export {versions} from './versions';

import { contextBridge, ipcRenderer } from 'electron';

declare global {
	interface Window {
	  electronAPI: any;
	}
  }
  
contextBridge.exposeInMainWorld('electronAPI', {
	setTitle: (title: string) => ipcRenderer.send('set-title', title),
	startServer: () => ipcRenderer.invoke('server:start'),
	handleCounter: (callback: any) => ipcRenderer.on('update-counter', callback)
})
