<script lang="ts" setup>
import ReactiveCounter from '/@/components/ReactiveCounter.vue';
import ReactiveHash from '/@/components/ReactiveHash.vue';
import ElectronVersions from '/@/components/ElectronVersions.vue';
import TimerDisplay from './components/TimerDisplay.vue';
import { onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const handleKeyPress = (event: KeyboardEvent) => {
  if(event.keyCode === 32 && event.target == document.body){
    store.commit('SET_TIMER_PLAYING', !store.state.timer.playing);
    event.preventDefault(); 
    return false;
  }
};

function handleKeyDown (event: KeyboardEvent) {
  if(event.keyCode === 32 && event.target == document.body){
    event.preventDefault(); 
    return false;
  }
}

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
    <legend class="text-sm">Timer Display</legend>
    <timer-display />
  </fieldset>
  <!-- <fieldset class="border border-solid border-gray-300 p-3">
    <legend class="text-sm">Test Vue Reactivity</legend>
    <reactive-counter />
  </fieldset>
  <fieldset class="border border-solid border-gray-300 p-3">
    <legend class="text-sm">Test Node.js API</legend>
    <reactive-hash />
  </fieldset>
  <fieldset class="border border-solid border-gray-300 p-3">
    <legend class="text-sm">Environment</legend>
    <electron-versions />
  </fieldset> -->
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
