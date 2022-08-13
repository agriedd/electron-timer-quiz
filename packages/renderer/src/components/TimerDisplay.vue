<script setup lang="ts">
import {reactive, ref} from 'vue';
import {watch} from 'vue';
import {computed, watchEffect} from 'vue';
import {useStore} from 'vuex';
import TimeInput from './TimerDisplay/TimeInput.vue';
import type {TimeFormat} from '../../types/TimerType';

const store = useStore();

const time = ref(Date.now());
const start_time = ref(Date.now());
const resume_time = ref(Date.now());
const pause_at = ref(-1);
const stop_at = ref(Date.now());
const end_time = ref(Date.now());

const confirmed_done = ref(true);

const audio_end = new Audio('../assets/sounds/mixkit-notification-bell-592.wav');
const audio_ending = new Audio('../../assets/sounds/mixkit-tick-tock-clock-close-up-1059.wav');

const editMode = ref(true);

const state = reactive({
  playing: false,
});

const confirmDone = () => {
  confirmed_done.value = true;
};

const edit_mode_enabled = computed(() => {
  return editMode.value && confirmed_done.value;
});

watch(state, val => {
  editMode.value = !val.playing && stop_at.value > 0;
});
watch(stop_at, val => {
  editMode.value = !state.playing && val > 0;
});

var state_playing = computed({
  set: (val: boolean) => store.commit('SET_TIMER_PLAYING', val),
  get: () => store.state.timer.playing,
});

var handler: any = null;

const timerEndHandler = () => {
  stopCounter();
  audio_end.pause();
  audio_end.currentTime = 0;
  audio_ending.pause();
  audio_ending.currentTime = 0;

  audio_end.play();

  confirmed_done.value = false;
};
const timerEndingHandler = () => {
  // audio_ending.pause()
  // audio_ending.currentTime = 0;
  audio_ending.play();
};

const isInLast10Seconds = () => {
  return time_range.value <= 1e4;
};

const countingTime = () => {
  state.playing = true;
  stop_at.value = 0;
  if (isInLast10Seconds()) timerEndingHandler();
  if (end_time.value <= time.value) return timerEndHandler();
  handler = setTimeout(() => {
    time.value = Date.now();
    countingTime();
  }, 0);
};

const startCounter = () => {
  confirmed_done.value = true;
  if (pause_at.value > -1) {
    resumeCounter();
  } else {
    time.value = Date.now();
    start_time.value = resume_time.value = Date.now();
    end_time.value = addTime(timer_end_input, Date.now());
    countingTime();
  }
};

const addTime = (add: TimeFormat, date: number): number => {
  date += add.hours.value * 36e5;
  date += add.minutes.value * 6e4;
  date += add.seconds.value * 1e3;
  date += add.ms.value;
  return date;
};

const stopCounter = () => {
  clearTimeout(handler);

  state.playing = false;

  audio_ending.pause();
  audio_ending.currentTime = 0;

  time.value = start_time.value = resume_time.value = stop_at.value = Date.now();
  end_time.value = addTime(timer_end_input, Date.now());
  pause_at.value = -1;
};
const pauseCounter = () => {
  pause_at.value = Date.now();
  audio_ending.pause();
  clearTimeout(handler);
  state.playing = false;
};
const resumeCounter = () => {
  end_time.value = Date.now() + (end_time.value - pause_at.value);
  resume_time.value = Date.now() + (resume_time.value - pause_at.value);
  countingTime();
};

const time_elapsed = computed(() => time.value - resume_time.value);
const time_range = computed(() => end_time.value - time.value);

const timer_end_input = reactive<TimeFormat>({
  hours: {
    label: '00',
    value: 0,
  },
  minutes: {
    label: '00',
    value: 0,
  },
  seconds: {
    label: '00',
    value: 0,
  },
  ms: {
    label: '00',
    value: 0,
  },
});

const setInputMinutes = (val: number): void => {
  timer_end_input.minutes.value = val;
  timer_end_input.minutes.label = val.toLocaleString('en-US', {minimumIntegerDigits: 2});
};
const setInputSeconds = (val: number): void => {
  timer_end_input.seconds.value = val;
  timer_end_input.seconds.label = val.toLocaleString('en-US', {minimumIntegerDigits: 2});
};
const setInputHours = (val: number): void => {
  timer_end_input.hours.value = val;
  timer_end_input.hours.label = val.toLocaleString('en-US', {minimumIntegerDigits: 2});
};

const timeFormatted = computed((): TimeFormat => {
  const hours = Math.floor(Math.abs(time_elapsed.value) / 36e5) || 0;
  const minutes = Math.floor(Math.abs(time_elapsed.value) / 6e4) % 60 || 0;
  const seconds = Math.floor(Math.abs(time_elapsed.value) / 1e3) % 60 || 0;
  const ms = Math.abs(time_elapsed.value) / 1e2 || 0;

  return {
    hours: {
      label: hours.toLocaleString('en-US', {minimumIntegerDigits: 2}),
      value: hours,
    },
    minutes: {
      label: minutes.toLocaleString('en-US', {minimumIntegerDigits: 2}),
      value: minutes,
    },
    seconds: {
      label: seconds.toLocaleString('en-US', {minimumIntegerDigits: 2}),
      value: seconds,
    },
    ms: {
      label: ((ms % 10) * 100).toLocaleString('en-US', {minimumIntegerDigits: 3}),
      value: (ms % 10) * 100,
    },
  };
});

const timeRangeFormatted = computed((): TimeFormat => {
  const hours = Math.abs(Math.floor(time_range.value / 36e5) || 0);
  const minutes = Math.abs(Math.floor(time_range.value / 6e4) % 60 || 0);
  const seconds = Math.abs(Math.floor(time_range.value / 1e3) % 60 || 0);
  const ms = Math.abs(time_range.value / 1e2 || 0);

  return {
    hours: {
      label: hours.toLocaleString('en-US', {minimumIntegerDigits: 2}),
      value: hours,
    },
    minutes: {
      label: minutes.toLocaleString('en-US', {minimumIntegerDigits: 2}),
      value: minutes,
    },
    seconds: {
      label: seconds.toLocaleString('en-US', {minimumIntegerDigits: 2}),
      value: seconds,
    },
    ms: {
      label: ((ms % 10) * 100).toLocaleString('en-US', {minimumIntegerDigits: 3}),
      value: (ms % 10) * 100,
    },
  };
});

watch(state_playing, (val: boolean, old: boolean) => {
  if (state.playing) {
    pauseCounter();
  } else {
    startCounter();
  }
});
</script>
<template>
  <div class="relative">
    <div
      v-if="!confirmed_done"
      class="p-3 absolute z-10 w-full h-full flex justify-center items-center bg-white bg-opacity-70"
      @click.self="confirmDone"
    >
      <div class="bg-gray-800 rounded-md p-3 border border-gray-900 max-w-md w-full shadow-lg">
        <div class="pb-3 text-lg text-gray-400">
          <div class="py-3"> Waktu Berakhir </div>
        </div>
        <div>
          <button
            class="px-4 py-3 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl text-gray-400 border border-gray-900 text-sm hover:shadow-md active:shadow-sm active:border-blue-300 active:to-gray-800"
            @click="confirmDone()"
          >
            Konfirmasi
          </button>
        </div>
      </div>
    </div>
    <div class="p-3">
      <div class="flex justify-center">
        <fieldset
          class="border rounded-sm py-0 m-0"
          :style="{opacity: timeRangeFormatted.hours.value == 0 && !edit_mode_enabled ? 0.3 : 1}"
        >
          <legend class="text-xs mr-auto text-gray-600">Jam</legend>
          <TimeInput
            :edit-mode="edit_mode_enabled"
            :value="timeRangeFormatted.hours"
            :show-count="9"
            inline
            @input="setInputHours"
          />
        </fieldset>
        <div
          :style="{opacity: timeRangeFormatted.hours.value == 0 && !edit_mode_enabled ? 0.3 : 1}"
        >
          <div class="h-full flex items-center">
            <div class="text-7xl font-bold py-5"> : </div>
          </div>
        </div>
        <fieldset
          class="border rounded-sm py-0 m-0 w-36"
          :style="{opacity: timeRangeFormatted.minutes.value == 0 && !edit_mode_enabled ? 0.3 : 1}"
        >
          <legend class="text-xs mr-auto text-gray-600">Menit</legend>
          <TimeInput
            :edit-mode="edit_mode_enabled"
            :value="timeRangeFormatted.minutes"
            :show-count="9"
            inline
            @input="setInputMinutes"
          />
        </fieldset>
        <div
          :style="{opacity: timeRangeFormatted.minutes.value == 0 && !edit_mode_enabled ? 0.3 : 1}"
        >
          <div class="h-full flex items-center">
            <div class="text-7xl font-bold py-5"> : </div>
          </div>
        </div>
        <fieldset class="border rounded-sm py-0 m-0 w-36">
          <legend class="text-xs mr-auto text-gray-600">Detik</legend>
          <TimeInput
            :edit-mode="edit_mode_enabled"
            :value="timeRangeFormatted.seconds"
            :show-count="9"
            inline
            @input="setInputSeconds"
          />
        </fieldset>
        <div>
          <div class="h-full flex items-center">
            <div class="text-7xl font-bold py-5"> . </div>
          </div>
        </div>
        <fieldset class="border rounded-sm py-0 m-0 w-52">
          <legend class="text-xs mr-auto text-gray-600">Milidetik</legend>
          <TimeInput
            :edit-mode="false"
            :value="timeRangeFormatted.ms"
            :show-count="9"
            :inline="true"
          />
        </fieldset>
      </div>
    </div>
    <div class="p-3 relative">
      <div class="flex justify-center">
        <!-- <div class="relative"> -->
        <!-- <div class="absolute -bottom-2 -left-8"> -->
        <div>
          <div class="flex h-full items-center pr-3">
            <button
              class="p-3 rounded-full h-14 w-14 mr-1 bg-gradient-to-tl flex justify-end items-center"
              :class="[
                edit_mode_enabled
                  ? 'from-gray-100 to-gray-50 fill-gray-400 border'
                  : 'fill-white from-gray-900 to-gray-700 shadow-2xl shadow-gray-700',
              ]"
              :disabled="edit_mode_enabled"
              @click="stopCounter"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="100"
                height="100"
                class="bi bi-stop-fill"
                viewBox="0 0 16 16"
              >
                <path
                  d="M5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11V5A1.5 1.5 0 0 1 5 3.5z"
                />
              </svg>
            </button>
          </div>
        </div>
        <!-- </div> -->
        <button
          v-if="!state.playing"
          class="p-3 rounded-full h-32 w-32 mr-1 fill-white from-blue-700 to-blue-500 bg-gradient-to-tl shadow-2xl shadow-blue-600 flex justify-end items-center"
          @click="startCounter"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100"
            height="100"
            class="bi bi-play-fill"
            viewBox="0 0 16 16"
          >
            <path
              d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"
            />
          </svg>
        </button>
        <button
          v-else
          class="p-3 rounded-full h-32 w-32 mr-1 fill-white from-orange-700 to-orange-500 bg-gradient-to-tl shadow-2xl shadow-orange-600 flex justify-end items-center"
          @click="pauseCounter"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100"
            height="100"
            class="bi bi-pause-fill"
            viewBox="0 0 16 16"
          >
            <path
              d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"
            />
          </svg>
        </button>
        <div>
          <div class="flex h-full items-center pl-3">
            <button
              class="p-3 rounded-full h-14 w-14 mr-1 bg-gradient-to-tl flex justify-end items-center"
              :class="[
                false
                  ? 'from-gray-100 to-gray-50 fill-gray-400 border'
                  : 'from-white to-white shadow-2xl shadow-gray-700 fill-gray-600',
              ]"
              @click="stopCounter"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="100"
                height="100"
                class="bi bi-arrow-clockwise"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"
                />
                <path
                  d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"
                />
              </svg>
            </button>
          </div>
        </div>
        <!-- </div> -->
      </div>
    </div>
  </div>
</template>
<style scoped>
.slide-fade--enter-active {
  transition: all 0.1s ease-out;
}

.slide-fade--leave-active {
  transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade--enter-to {
}

.slide-fade--enter-from {
  transform: translateY(-0.5rem);
  opacity: 0;
}

.slide-fade--leave-from {
}

.slide-fade--leave-to {
  transform: translateY(0.5rem);
  opacity: 0;
}
</style>
