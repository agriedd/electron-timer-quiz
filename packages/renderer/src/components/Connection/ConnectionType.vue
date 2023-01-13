<script setup lang="ts">
import {ref} from 'vue';
import {ConnectionType, ConnectionTypeEnum} from '../../../types/ConnectionType';

const type_connection = ref<ConnectionType>(ConnectionTypeEnum.Cable);
const connection_type_list = Object.values(ConnectionTypeEnum);
</script>
<template>
  <div>
    <select>
      <option
        :value="item"
        v-for="item in connection_type_list"
        :key="item"
      >
        {{ item }}
      </option>
    </select>
  </div>
</template>
