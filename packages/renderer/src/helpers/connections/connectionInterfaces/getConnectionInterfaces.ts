import { computed, reactive, shallowRef } from "vue";
import { ResponseToRenderer } from '../../../../../main/src/Net/types/ServerType'
import { WiFiNetwork } from 'node-wifi'
import { NetworkInterfaceInfo, NetworkInterfaceInfoIPv4, NetworkInterfaceInfoIPv6 } from 'os'

export var connectionInterfaces = shallowRef<NetworkInterfaceInfo[]>([])
export var connectionWiFi = shallowRef<WiFiNetwork[]>([])

export const currentInterface = computed(()=>{
	return connectionInterfaces.value.filter((ints: NetworkInterfaceInfo) => {
		return ints?.family === 'IPv4'
	})[0];
})

export const getInterfaces = async ()=>{
	let res = await window.electronAPI.getInterfaces().catch((e: Error) => {
		console.log("Error: ", e);
	}) as ResponseToRenderer
	
	console.log(res.data);
	
	if(res?.data){
		connectionInterfaces.value = res.data.interfaces
		connectionWiFi.value = res.data.connections
	}
}