<script lang="ts" setup>
import TimerDisplay from './components/TimerDisplay.vue';
import {onMounted, onUnmounted, ref} from 'vue';
import {useStore} from 'vuex';
import ServerMenu from './components/Server/ServerMenu.vue';

const store = useStore();

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.keyCode === 32 && event.target == document.body) {
    store.commit('SET_TIMER_PLAYING', !store.state.timer.playing);
    event.preventDefault();
    return false;
  }
};

function handleKeyDown(event: KeyboardEvent) {
  if (event.keyCode === 32 && event.target == document.body) {
    event.preventDefault();
    return false;
  }
}

const port = ref(3500);
const msg = ref('');
const counter = ref(0);

// const startServer = async () => {
//   window.electronAPI.setTitle("Okd")
// }

// window.electronAPI.handleCounter((event: any, value: number) => {
//   console.log(value);

//   const oldValue = Number(counter.value)
//   const newValue = oldValue + value
//   counter.value = newValue
//   event.sender.send('counter-value', newValue)
// })

onMounted(() => {
  window.addEventListener('keyup', handleKeyPress, false);
  window.addEventListener('keydown', handleKeyDown, false);
});

onUnmounted(() => {
  window.removeEventListener('keyup', handleKeyPress, false);
  window.removeEventListener('keydown', handleKeyDown, false);
});
</script>

<template>
  <fieldset class="border border-solid border-gray-300 p-3">
    <legend class="text-sm">Server</legend>
    <server-menu></server-menu>
  </fieldset>
  <fieldset class="border border-solid border-gray-300 p-3">
    <legend class="text-sm">Client</legend>
  </fieldset>
  <fieldset class="border border-solid border-gray-300 p-3">
    <legend class="text-sm">Timer Display {{ counter }}</legend>
    <timer-display />
  </fieldset>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0px auto;
  /* max-width: 700px; */
}

fieldset {
  margin: 2rem;
  padding: 1rem;
}
</style>
