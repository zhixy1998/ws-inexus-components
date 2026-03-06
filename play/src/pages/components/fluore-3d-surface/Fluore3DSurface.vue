<!--
  - Copyright (c) 2026 普析. All rights reserved.
  - This software is licensed under the MIT License.
  -->

<!-- Fluorescence3DSurface.vue -->
<template>
  <div ref="chartRef" style="width: 100%; height: 500px;"></div>
</template>

<script setup lang="ts">
import {ref, onMounted, onUnmounted} from 'vue'
import * as echarts from 'echarts'

const chartRef = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null

// 模拟三维荧光光谱数据
const generateData = () => {
  const data: [number, number, number][] = []
  // 发射波长 (Emission) 范围: 1100 - 1350 nm
  for (let emission = 1100; emission <= 1350; emission += 10) {
    // 激发波长 (Excitation) 范围: 620 - 860 nm
    for (let excitation = 620; excitation <= 860; excitation += 10) {
      // 模拟荧光强度 (Intensity)，生成几个峰
      const x = (emission - 1225) / 50
      const y = (excitation - 740) / 50
      const intensity = Math.exp(-(x**2 + y**2)) * 8000 + Math.random() * 500
      data.push([emission, excitation, intensity])
    }
  }
  return data
}


onMounted(() => {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)

  const option: echarts.EChartsOption = {
    title: {
      text: '三维荧光光谱立体图',
      left: 'center'
    },
    tooltip: {},
    xAxis3D: {
      type: 'value',
      name: 'Emission (nm)'
    },
    yAxis3D: {
      type: 'value',
      name: 'Excitation (nm)'
    },
    zAxis3D: {
      type: 'value',
      name: 'Intensity'
    },
    grid3D: {
      viewControl: {
        alpha:90,
        beta: 0,             // 方位角0度
        projection: 'orthographic', // 正交投影（消除透视变形）
        distance: 300,        // 调节视距
        autoRotate: false
      }
    },
    series: [
      {
        type: 'surface',
        data: generateData(),
        shading: 'lambert',
        itemStyle: {
          color: function (params: any) {
            // 根据强度值映射颜色
            const value = params.data[2]
            const r = Math.floor((value / 8000) * 255)
            const g = Math.floor((1 - value / 8000) * 255)
            return `rgb(${r}, ${g}, 0)`
          }
        }
      }
    ]
  }

  chartInstance.setOption(option)
})

onUnmounted(() => {
  chartInstance?.dispose()
})
</script>