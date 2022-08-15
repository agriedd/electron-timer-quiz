import * as qrcode from "qrcode-generator"
import { ref } from "vue"

export const qrData = ref<QRCode|null>(null)
export const qrElement = ref<string|null>(null);

export const makeQR = (
	data: string, 
	{typeNumber= 4, errorCorrectionLevel= 'L'}: 
		{typeNumber: TypeNumber, errorCorrectionLevel: ErrorCorrectionLevel})=>{
	qrData.value = qrcode(typeNumber, errorCorrectionLevel)
	qrData.value.addData(data)
	qrData.value.make()
}

export const writeToElement = (el: HTMLElement|Element|HTMLDivElement)=>{

	console.log(qrData.value);
	console.log(el);
	
	if(qrData.value){
		el.innerHTML = qrData.value.createSvgTag()
	}
}
export const writeQR = ()=>{
	if(qrData.value)
		qrElement.value = qrData.value.createSvgTag()
}