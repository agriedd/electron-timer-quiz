import {createStore} from 'vuex';
import type {TimerState} from './types/TimerState';

export default createStore({
  state(): {timer: TimerState} {
    return {
      timer: {
        playing: false,
      },
    };
  },
  mutations: {
    SET_TIMER_PLAYING(state, value: boolean) {
      state.timer.playing = value;
    },
  },
  modules: {},
});
