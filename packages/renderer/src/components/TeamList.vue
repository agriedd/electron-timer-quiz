<script setup lang="ts">
import {Team} from 'types/TeamsType';
import {ref} from 'vue';
import {
  teams,
  isTeamEmpty,
  modalCreate,
  hideModalCreate,
  pushTeam,
  showModalCreate,
  teamsOrdered,
} from '../helpers/teams/TeamState';
import TeamItem from './TeamList/TeamItem.vue';

const foo = ref('bar');
const team_name = ref<string>('');
const team_button_id = ref<string>('');
const error_message = ref<string | null>(null);

const addTeam = async () => {
  let result = await pushTeam({
    name: team_name.value,
    history: [],
    point: 0,
    id: Date.now(),
    button_id: team_button_id.value
  }).catch((e: any) => {
    error_message.value = e;
  });
  if (result) {
    clearErrorMessage();
    clearTeamName();
    hideModalCreate();
  }
};

const clearTeamName = () => {
  team_name.value = '';
};

const clearErrorMessage = () => {
  error_message.value = null;
};

const increaseTeamPoint = (item: Team) => {
  item.point += 10;
};
</script>
<template>
  <div class="relative">
    <div
      class="absolute h-full w-full left-0 top-0 z-20"
      v-if="modalCreate"
    >
      <div class="bg-white shadow-2xl border rounded-md">
        <fieldset class="border border-solid border-gray-300 p-0">
          <legend class="text-sm">Nama Tim</legend>
          <input
            class="px-3 py-2 w-full relative"
            placeholder="Nama TIM"
            v-model="team_name"
            @keydown="clearErrorMessage"
          />
        </fieldset>
        <fieldset class="border border-solid border-gray-300 p-0">
          <legend class="text-sm">ID Tombol</legend>
          <input
            class="px-3 py-2 w-full relative"
            placeholder="ID Tombol"
            v-model="team_button_id"
            @keydown="clearErrorMessage"
          />
        </fieldset>
        <fieldset
          class="border border-solid border-pink-300 p-0 text-red-900 bg-pink-50 mt-0"
          v-if="error_message != null"
        >
          <legend class="text-sm ml-1 mr-auto px-2">Kesalahan</legend>
          <div class="p-3 text-sm">
            {{ error_message }}
          </div>
        </fieldset>
        <hr />
        <div class="p-3 flex">
          <button
            class="px-3 py-3 rounded-lg bg-indigo-50 w-full text-indigo-900 hover:bg-indigo-100 transition-colors border border-indigo-100 flex-1"
            @click="addTeam"
          >
            Tambah
          </button>
          <button
            class="px-3 py-3 ml-3 rounded-lg text-gray-600 hover:text-gray-800 transition-colors"
            @click="hideModalCreate"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
    <transition-group
      tag="div"
      name="list"
      v-if="!isTeamEmpty"
      class="grid grid-cols-1 gap-4 mb-4"
    >
      <TeamItem
        v-for="(item, pos) in teamsOrdered"
        :key="item.id"
        :item="item"
        :position="pos"
      ></TeamItem>
    </transition-group>
    <div>
      <div
        class="border cursor-pointer p-4 rounded-md flex"
        @click="showModalCreate"
      >
        <div class="flex-1"> Tambah Tim </div>
        <div class="pl-4 fill-indigo-800 border-l">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            class="bi bi-plus-square-dotted"
            viewBox="0 0 16 16"
          >
            <path
              d="M2.5 0c-.166 0-.33.016-.487.048l.194.98A1.51 1.51 0 0 1 2.5 1h.458V0H2.5zm2.292 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zm1.833 0h-.916v1h.916V0zm1.834 0h-.917v1h.917V0zm1.833 0h-.917v1h.917V0zM13.5 0h-.458v1h.458c.1 0 .199.01.293.029l.194-.981A2.51 2.51 0 0 0 13.5 0zm2.079 1.11a2.511 2.511 0 0 0-.69-.689l-.556.831c.164.11.305.251.415.415l.83-.556zM1.11.421a2.511 2.511 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415L1.11.422zM16 2.5c0-.166-.016-.33-.048-.487l-.98.194c.018.094.028.192.028.293v.458h1V2.5zM.048 2.013A2.51 2.51 0 0 0 0 2.5v.458h1V2.5c0-.1.01-.199.029-.293l-.981-.194zM0 3.875v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 5.708v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zM0 7.542v.916h1v-.916H0zm15 .916h1v-.916h-1v.916zM0 9.375v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .916v.917h1v-.917H0zm16 .917v-.917h-1v.917h1zm-16 .917v.458c0 .166.016.33.048.487l.98-.194A1.51 1.51 0 0 1 1 13.5v-.458H0zm16 .458v-.458h-1v.458c0 .1-.01.199-.029.293l.981.194c.032-.158.048-.32.048-.487zM.421 14.89c.183.272.417.506.69.689l.556-.831a1.51 1.51 0 0 1-.415-.415l-.83.556zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373c.158.032.32.048.487.048h.458v-1H2.5c-.1 0-.199-.01-.293-.029l-.194.981zM13.5 16c.166 0 .33-.016.487-.048l-.194-.98A1.51 1.51 0 0 1 13.5 15h-.458v1h.458zm-9.625 0h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zm1.834-1v1h.916v-1h-.916zm1.833 1h.917v-1h-.917v1zm1.833 0h.917v-1h-.917v1zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 1s cubic-bezier(0.075, 0.82, 0.165, 1);
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-2rem);
}

.list-leave-active {
  position: absolute;
}
</style>
