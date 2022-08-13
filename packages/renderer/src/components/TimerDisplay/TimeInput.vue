<script setup lang="ts">
import {reactive, ref} from 'vue';
import {computed} from 'vue';
import type {TimeObject} from '../../../types/TimerType';
import {PropType} from 'vue';

interface TimeItem {
  index: number;
  label: string;
}

const props = defineProps({
  value: {
    type: Object as () => TimeObject,
    default: (): TimeObject => ({
      value: 0,
      label: '00',
    }),
  },
  showCount: {
    type: Number,
    default: 7,
  },
  editMode: {
    type: Boolean,
    default: false,
  },
  inline: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['input']);

const input = ref(true);

const timeFormat = computed({
  set: (val: TimeObject) => {
    emit('input', val.value);
  },
  get: () => props.value,
});

const formatNumber = (num: number) => {
  return num.toLocaleString('en-US', {minimumIntegerDigits: 2});
};

const listTime = computed<Array<TimeItem>>(() => {
  /**
   * [ 9 0 1 ] selected = 0
   * [ 9 0 1 2 3 4 5 6 7 8 ]
   * [ 1 0 1 2 3 4 5 6 7 8 ]
   * [ 8 0 1 2 3 4 5 6 7 8 ]
   * [ 0 1 2 3 4 5 6 7 8 9 ]
   *
   * [ 0 1 2 ] selected = 1
   * [ 0 1 2 3 4 5 6 7 8 9 ]
   * [ 2 1 0 1 2 3 4 5 6 7 ]
   * [ 7 8 0 1 2 3 4 5 6 7 ]
   * [ 0 1 2 3 4 5 6 7 8 9 ]
   */
  return Array(60)
    .fill(0)
    .map((_, i) => {
      let selected: number = props.editMode ? selectedTime.value : props.value.value;

      let start = i + (selected - Math.floor(props.showCount * 0.5));

      let index = start % 60;
      index = index < 0 ? Math.abs(index + 60) : index;

      return {
        index,
        label: formatNumber(index),
      };
    });
});

const selectedTime = ref(0);

const showedListTime = computed(() => {
  return listTime.value.slice(0, props.showCount);
});

const selectTime = (time: number) => {
  if (!props.editMode) return;
  selectedTime.value = time;
  timeFormat.value = {
    value: time,
    label: formatNumber(time),
  };
};

const scrollHandler = (e: WheelEvent) => {
  if (!props.editMode) return;

  if (e.deltaY > 0) {
    let val = (selectedTime.value + 1) % 60;
    selectedTime.value = val < 0 ? Math.abs(val + 60) : val;
  } else {
    if (selectedTime.value > 1) {
      selectedTime.value--;
    } else {
      let val = (selectedTime.value - 1) % 60;
      selectedTime.value = val < 0 ? Math.abs(val + 60) : val;
    }
  }
};

const isSelected = (time: TimeItem): boolean => {
  if (!props.editMode) return props.value.value === time.index;
  return time.index === selectedTime.value;
};
</script>
<template>
  <div v-if="props.inline && !props.editMode">
    <transition
      name="slide-fade"
      mode="out-in"
    >
      <div
        style="font-variant-numeric: tabular-nums"
        class="text-8xl font-bold max-h-72 h-72 flex flex-col justify-center"
      >
        {{ value.label }}
      </div>
    </transition>
  </div>
  <div
    v-else
    class="flex"
    @wheel.prevent="scrollHandler"
  >
    <transition-group
      tag="div"
      class="flex flex-col max-h-72 justify-center overflow-hidden"
      :name="props.editMode ? 'list' : 'slide'"
      mode="in-out"
    >
      <div
        v-for="time in showedListTime"
        :key="time.index"
        style="font-variant-numeric: tabular-nums"
        class="font-bold rounded-sm py-1 cursor-pointer select-none active:text-gray-600 transition-colors"
        :class="[
          isSelected(time)
            ? 'text-gray-800 text-8xl z-10'
            : 'text-gray-200 text-5xl hover:text-gray-400',
        ]"
        :title="time.index.toString()"
        @click="selectTime(time.index)"
      >
        {{ time.label }}
      </div>
    </transition-group>
  </div>
</template>
<style scoped>
/* .list-enter-active {
	transition: all 0.5s ease-out;
} */
.list-move {
  transition: all 0.15s ease-out;
}

.list-leave-active {
  position: absolute;
  opacity: 0;
  /* transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1); */
}

.list-enter-to {
}

.list-enter-from {
  /* transform: translateY(-.5rem); */
  /* opacity: 0; */
}

.list-leave-from {
}

.list-leave-to {
  /* transform: translateY(.5rem);
	opacity: 0; */
}
</style>
