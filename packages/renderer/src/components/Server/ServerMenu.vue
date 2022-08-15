<template>
  <div
    class="flex"
    ref="serverMenu"
  >
    <template v-if="!serverCreated">
      <div class="grid gap-1 grid-cols-1 mx-auto max-w-xl grow pr-3">
        <div></div>
        <div class="grid grid-cols-2 gap-1">
          <input
            type="text"
            class="px-3 py-2 border rounded-md"
            placeholder="0.0.0.0"
            disabled
            :value="currentInterface.address || '0.0.0.0'"
            v-if="currentInterface"
          />
          <input
            type="text"
            class="px-3 py-2 border rounded-md"
            placeholder="0.0.0.0"
            disabled
            :value="'0.0.0.0'"
            v-else
          />
          <input
            type="number"
            class="px-3 py-2 border rounded-md"
            placeholder="Port"
            v-model="port"
          />
        </div>
        <div class="d-flex">
          <button
            class="px-3 py-2 border rounded-md w-2/6"
            @click="
              startServer({
                port,
                host: currentInterface?.address || '0.0.0.0',
                wifiNetwork: currentConnection[0],
              })
            "
          >
            Mulai
          </button>
        </div>
        <div class="d-flex justify-center">
          {{ response.message }}
        </div>
      </div>
    </template>
    <template v-else>
      <div
        class="qr-code p-3 grow flex justify-center"
        v-html="qrElementCustomHeight"
      >
      </div>
    </template>
    <template v-if="connectionExists">
      <div class="border-l pl-3">
        <legend class="text-sm text-left mb-3">Sambungan Wi-Fi</legend>
        <div class="grid gap-1 grid-cols-1 w-80">
          <div
            class="p-3 text-left rounded-md text-gray-800 fill-gray-800 transition-colors cursor-pointer pl-0 hover:bg-gray-200"
            :class="[
              {'bg-gray-200 border border-transparent': i == wifiActive},
              {border: i != wifiActive},
            ]"
            v-for="(connection, i) in connectionWiFi"
            :key="i"
            @click="setWifiActive(i)"
          >
            <div class="flex">
              <div class="mr-3">
                <div class="h-full flex items-center">
                  <div
                    class="bg-blue-400 rounded-r-sm w-1 h-full"
                    style="max-height: 90%"
                    v-if="i == wifiActive"
                  ></div>
                  <div
                    class="w-1 h-full"
                    style="max-height: 0%"
                    v-else
                  ></div>
                </div>
              </div>
              <div class="grow">
                <div class="flex">
                  <div class="pr-3">
                    <div class="flex h-full justify-center items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1.2rem"
                        height="1.2rem"
                        class="bi bi-wifi"
                        viewBox="0 0 16 16"
                      >
                        <path
                          d="M15.384 6.115a.485.485 0 0 0-.047-.736A12.444 12.444 0 0 0 8 3C5.259 3 2.723 3.882.663 5.379a.485.485 0 0 0-.048.736.518.518 0 0 0 .668.05A11.448 11.448 0 0 1 8 4c2.507 0 4.827.802 6.716 2.164.205.148.49.13.668-.049z"
                        />
                        <path
                          d="M13.229 8.271a.482.482 0 0 0-.063-.745A9.455 9.455 0 0 0 8 6c-1.905 0-3.68.56-5.166 1.526a.48.48 0 0 0-.063.745.525.525 0 0 0 .652.065A8.46 8.46 0 0 1 8 7a8.46 8.46 0 0 1 4.576 1.336c.206.132.48.108.653-.065zm-2.183 2.183c.226-.226.185-.605-.1-.75A6.473 6.473 0 0 0 8 9c-1.06 0-2.062.254-2.946.704-.285.145-.326.524-.1.75l.015.015c.16.16.407.19.611.09A5.478 5.478 0 0 1 8 10c.868 0 1.69.201 2.42.56.203.1.45.07.61-.091l.016-.015zM9.06 12.44c.196-.196.198-.52-.04-.66A1.99 1.99 0 0 0 8 11.5a1.99 1.99 0 0 0-1.02.28c-.238.14-.236.464-.04.66l.706.706a.5.5 0 0 0 .707 0l.707-.707z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <div class="flex h-full justify-center items-center">
                      <div>
                        <div>
                          {{ connection.ssid }}
                        </div>
                        <div
                          v-if="currentConnection && connection.ssid == currentConnection[0].bssid"
                          class="text-sm"
                        >
                          <span class="text-gray-500">Connected</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div> </div>
                </div>
                <div
                  v-if="i == wifiActive && false"
                  class="pt-3 flex justify-between"
                >
                  <div class="text-sm"> </div>
                  <div>
                    <button
                      v-if="currentConnection && connection.ssid == currentConnection[0].bssid"
                      class="px-10 text-sm bg-gray-50 py-2 border rounded-lg transition-colors hover:bg-white"
                      disabled
                    >
                      Putuskan
                    </button>
                    <button
                      v-else
                      class="px-10 text-sm bg-gray-50 py-2 border rounded-lg transition-colors hover:bg-white"
                      disabled
                    >
                      Sambungkan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from '@vue/reactivity';
import {onMounted, watch} from 'vue';
import {
  getInterfaces,
  currentInterface,
  connectionWiFi,
} from '/@/helpers/connections/connectionInterfaces/getConnectionInterfaces';
import {
  connectionExists,
  currentConnection,
  getCurrentConnection,
} from '/@/helpers/connections/connectionInterfaces/getCurrentConnection';
import {response, startServer, status as serverCreated} from '/@/helpers/server/createServer';
import {makeQR, writeQR, qrElement} from '/@/helpers/server/createQRCode';
import {ServerData} from '../../../../main/src/Net/types/Connection';
import {encryptAES} from '/@/helpers/security/AES';

const port = ref(3500);
const wifiActive = ref(0);

getInterfaces();
getCurrentConnection();

const setWifiActive = (i: number) => (wifiActive.value = i);

var serverMenu = ref<null | HTMLDivElement>(null);

const qrElementCustomHeight = computed(() => {
  let value = qrElement.value
    ?.replace(/(width=")([^"]+)(")/gi, '$1' + `${300}px` + '$3')
    .replace(/(height=")([^"]+)(")/gi, '$1' + `${300}px` + '$3');
  return value;
});

onMounted(() => {});

watch(serverCreated, (created: boolean) => {
  if (created) {
    let data = response.value.data as ServerData;
    let pass = encryptAES('BLBNYBIV20');
    console.log(pass);

    let str = JSON.stringify({
      ip: data.host,
      ssid: data.ssid,
      pass,
      port: data.port,
    });

    makeQR(str, {
      typeNumber: 5,
      errorCorrectionLevel: 'L',
    });
    writeQR();
  }
});
</script>
