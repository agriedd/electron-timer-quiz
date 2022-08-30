<script lang="ts" setup>
import { computed } from '@vue/reactivity';
import { Team } from '../../../types/TeamsType'
import { ref } from "vue";
import { teams } from '../../helpers/teams/TeamState'

const props = defineProps({
	item: {
		type: Object as () => Team,
		required: true
	},
	position: {
		type: Number,
		required: true
	}
})

var input_point = ref(25)
var show_options = ref(false)

const firstPosition = computed(() => {
	return props.position == 0
})
const increasePoint = () => {
	props.item.point += input_point.value
}
const decreasePoint = () => {
	props.item.point -= input_point.value
}
const resetPoint = () => {
	props.item.point = 0
}


const deleteItem = () => {
	let confirm_delete = confirm("Apakah anda yakin?")
	if (confirm_delete) {
		let index = teams.findIndex((e: Team) => e.id === props.item.id)
		if (index > -1)
			teams.splice(index, 1);
	}
}

</script>
<template>
	<div class="relative">
		<div class="p-4 text-left flex rounded-lg cursor-pointer"
			:class="[{ 'bg-teal-50': firstPosition, 'border': !firstPosition }]" @click="show_options = !show_options">
			<div class="fill-teal-500 pr-3 w-20">
				<div class="flex justify-center items-center h-full relative" v-if="firstPosition">
					<div class="absolute fill-teal-600">
						<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"
							class="bi bi-award-fill drop-shadow-lg" viewBox="0 0 16 16">
							<path
								d="m8 0 1.669.864 1.858.282.842 1.68 1.337 1.32L13.4 6l.306 1.854-1.337 1.32-.842 1.68-1.858.282L8 12l-1.669-.864-1.858-.282-.842-1.68-1.337-1.32L2.6 6l-.306-1.854 1.337-1.32.842-1.68L6.331.864 8 0z" />
							<path d="M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1 4 11.794z" />
						</svg>
					</div>
					<div class="absolute mb-3 fill-teal-50">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="bi bi-trophy-fill"
							viewBox="0 0 16 16">
							<path
								d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5c0 .538-.012 1.05-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33.076 33.076 0 0 1 2.5.5zm.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935zm10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935z" />
						</svg>
					</div>
				</div>
			</div>
			<div class="flex-1">
				<div class="flex justify-center flex-col h-full">
					<div class="text-3xl font-bold font-mono">
						{{  item.name  }}
					</div>
				</div>
			</div>
			<div>
				<div class="flex justify-center flex-col h-full">
					<div class="text-3xl font-bold font-sans">
						{{  item.point  }}
					</div>
				</div>
			</div>
		</div>
		<div class="py-3 text-left flex" v-if="show_options">
			<div class="flex">
				<button class="p-3 bg-indigo-50 rounded-lg mr-3" @click="resetPoint">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" 
						class="bi bi-arrow-clockwise" viewBox="0 0 16 16">
						<path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />
						<path
							d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
					</svg>
				</button>
				<button class="p-3 bg-indigo-50 rounded-lg mr-3" @click="deleteItem">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="bi bi-trash3"
						viewBox="0 0 16 16">
						<path
							d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
					</svg>
				</button>
			</div>
			<div class="flex-1">
				<div class="flex">
					<div class="flex-1"></div>
					<button class="p-3 bg-indigo-50 rounded-lg mr-3" @click="decreasePoint">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="bi bi-dash-lg"
							viewBox="0 0 16 16">
							<path fill-rule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8Z" />
						</svg>
					</button>
					<input type="number" class="px-3 py-2 shrink w-24 mr-3 rounded-lg border" step="5"
						v-model="input_point">
					<button class="p-3 bg-indigo-50 rounded-lg" @click="increasePoint">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="bi bi-plus-lg"
							viewBox="0 0 16 16">
							<path fill-rule="evenodd"
								d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" />
						</svg>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>