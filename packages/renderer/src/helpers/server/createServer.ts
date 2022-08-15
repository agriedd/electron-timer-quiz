import { WiFiNetwork } from "node-wifi";
import { computed, reactive, shallowReactive, shallowRef } from "vue";
import { host, ServerData } from "../../../../main/src/Net/types/Connection";
import { ResponseToRenderer } from "../../../../main/src/Net/types/ServerType";

export var response = shallowRef<ResponseToRenderer>({
	message: "",
	status: false,
	error: null,
	data: null
});

export var status = computed(()=>{
	return response.value.status
})

export const startServer = async ({ port, host = '0.0.0.0', wifiNetwork }: 
	{ port: number, host: host|string, wifiNetwork: WiFiNetwork})=>{
	const data: ServerData = {
		port: port,
		host: host,
		maxParticipants: 10,
		maxClients: 10*2,
		title: port.toString(),
		ssid: wifiNetwork.bssid || wifiNetwork.ssid
	}
	let res = await window.electronAPI.startServer(data).catch((e: Error) => {
		console.log("Error: ", e);
	}) as ResponseToRenderer

	if(res){
		response.value = res
	}
}
