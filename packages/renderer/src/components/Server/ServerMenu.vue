<template>
	<div class="grid gap-1 grid-cols-1 grid-rows-2 mx-auto max-w-xl">
		<div class="grid grid-cols-2 gap-1">
			<input type="text" class="px-3 py-2 border rounded-md" placeholder="0.0.0.0" disabled>
			<input type="number" class="px-3 py-2 border rounded-md" placeholder="Port" v-model="port">
		</div>
		<div class="d-flex">
			<button class="px-3 py-2 border rounded-md w-2/6" @click="startServer()">
				Mulai
			</button>
		</div>
		<div class="d-flex justify-center">
			{{ response.message }}
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref } from "@vue/reactivity";
import { ResponseToRenderer } from '../../../../main/src/Net/types/ServerType'

const port = ref(3500);
var response = reactive<ResponseToRenderer>({
	message: "",
	status: false,
	error: null
});

const startServer = async ()=>{
	let res = await window.electronAPI.startServer().catch(e => {
		console.log("Error: ", e);
	}) as ResponseToRenderer
	
	if(res){
		response.message = res.message
		response.status = res.status
		response.error = res.error
	}
}

</script>
