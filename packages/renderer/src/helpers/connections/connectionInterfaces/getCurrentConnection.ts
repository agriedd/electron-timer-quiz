import {computed, reactive, shallowRef} from 'vue';
import {ResponseToRenderer} from '../../../../../main/src/Net/types/ServerType';
import {WiFiNetwork} from 'node-wifi';

export var currentConnection = shallowRef<WiFiNetwork[]>([]);
export const connectionExists = computed(() => currentConnection.value.length);

export const getCurrentConnection = async () => {
  let res = (await window.electronAPI.getCurrentConnection().catch((e: Error) => {
    console.log('Error: ', e);
  })) as ResponseToRenderer;

  console.log(res);

  if (res?.data) {
    currentConnection.value = res.data as WiFiNetwork[];
  }
};
