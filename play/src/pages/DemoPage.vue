<template>
  <div style=" gap: 2em">
    <LessButton @click="modalShow=!modalShow" message="点击打开弹窗"/>
    <div style="margin-bottom: 20px">
<!--      <LessButton @click="toggleAutoRotate">-->
<!--        {{ autoRotate ? '停止旋转' : '开始旋转' }}-->
<!--      </LessButton>-->
<!--      <LessButton @click="resetView">重置视角</LessButton>-->
    </div>
    <WsModal v-model="modalShow"/>
<!--    <EditTable/>-->
    <div style="display: flex; flex-wrap: wrap; gap: 20px; padding: 20px;">
      <div style="flex: 1 1 400px;">
        <Fluore3DSurface />
      </div>
      <div style="flex: 1 1 400px;">
        <FluoreHeatMap />
      </div>
      <div style="flex: 1 1 400px;">
        <FluoreContour
            ref="chartRef"
        />
      </div>
    </div>
    <!--    <TailwindButton message="tailwind"/>-->
  </div>
</template>

<script setup lang="ts">
import { WsModal,LessButton } from "@zhixingyu/ws-inexus-components";
import "@zhixingyu/ws-inexus-components/style.css";
// import EditTable from "@/pages/components/EditTable.vue";
import { ref } from 'vue'
import Fluore3DSurface from "@/pages/components/fluore-3d-surface/Fluore3DSurface.vue";
import FluoreHeatMap from "@/pages/components/fluore-heat-map/FluoreHeatMap.vue";
import FluoreContour from "@/pages/components/fluore-contour/FluoreContour1.vue";
const modalShow = ref(false);
const chartRef = ref<InstanceType<typeof FluoreContour>>()
// const autoRotate = ref(true)
// const visualMapConfig = {
//   min: -5,
//   max: 5,
//   calculable: true,
//   inRange: {
//     color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8',
//       '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
//   }
// }
//
// const toggleAutoRotate = () => {
//   const chart = chartRef.value?.getChartInstance()
//   if (chart) {
//     const option = chart.getOption()
//     autoRotate.value = !autoRotate.value
//     // 更新自动旋转设置
//     // 注意：这里需要根据实际的ECharts API来设置
//   }
// }
//
// const resetView = () => {
//   const chart = chartRef.value?.getChartInstance()
//   if (chart) {
//     chart.setOption({
//       grid3D: {
//         viewControl: {
//           alpha: 20,
//           beta: 30,
//           distance: 100
//         }
//       }
//     })
//   }
// }
</script>

<style scoped>

</style>
