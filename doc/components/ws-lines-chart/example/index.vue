<template>
  <WsLinesChart :lines="lineData" :x-axis-options="{ min: 0, max: 1000 }" :y-axis-options="{ min: 0, max: 100 }"
                :mark-select="['波峰', '波谷']" y-axis-name="数值" x-axis-name="时间(s)" :is-data-zoom="true"/>
</template>
<script setup>
import {ref} from 'vue';
import {WsLinesChart} from "@zhixingyu/ws-inexus-components";

const lineData = ref([{
  name: '曲线1',
  color: '#1890ff',
  data: [{x: 0, y: 10, marked: 1, feng: 0, gu: 0, astrictY: 10}, {
    x: 500,
    y: 50,
    marked: 0,
    feng: 1,
    gu: 0,
    astrictY: 50
  }, {x: 1000, y: 30, marked: 0, feng: 0, gu: 1, astrictY: 30},],
},])
</script>