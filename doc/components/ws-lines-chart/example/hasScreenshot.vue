<template>
  <button @click="handleCapture">截图</button>
  <WsLinesChart ref="chartRef"/>
</template>
<script setup> import {ref} from 'vue'
import {WsLinesChart} from "@zhixingyu/ws-inexus-components";

const chartRef = ref()
const handleCapture = async () => {
  const imageData = await chartRef.value.captureChart()
}
</script>