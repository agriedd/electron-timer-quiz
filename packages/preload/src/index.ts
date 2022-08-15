/**
 * @module preload
 */

export {sha256sum} from './nodeCrypto';
export {versions} from './versions';

import { contextBridge, ipcRenderer } from 'electron';
import { ServerData } from '../../main/src/Net/types/Connection'

contextBridge.exposeInMainWorld('electronAPI', {
	/**
	 * from renderer to main
	 * 
	 */
	handleCounter: (callback: any) => ipcRenderer.on('update-counter', callback),
	/**
	 * from main to renderer
	 * 
	 */
	setTitle: (title: string) => ipcRenderer.send('set-title', title),
	startServer: (data: ServerData) => ipcRenderer.invoke('server:start', data),
	getInterfaces: (data: any) => ipcRenderer.invoke('interface:list', data),
	getCurrentConnection: (data: any) => ipcRenderer.invoke('interface:current', data)
})
