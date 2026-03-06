<!--
  - Copyright (c) 2026 普析. All rights reserved.
  - This software is licensed under the MIT License.
  -->
<!-- FluorescenceHeatmap.vue -->
<template>
  <div ref="chartRef" style="width: 100%; height: 500px;"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null

// 模拟数据
const generateData = () => {
  const xData = []
  const yData = []
  const data = []

  // 生成 X 轴和 Y 轴的类目数据
  for (let emission = 300; emission <= 550; emission += 5) {
    xData.push(emission.toString())
  }
  for (let excitation = 250; excitation <= 450; excitation += 5) {
    yData.push(excitation.toString())
  }

  // 生成热力图数据 [xIndex, yIndex, intensity]
  let xIndex = 0
  for (let emission = 300; emission <= 550; emission += 5) {
    let yIndex = 0
    for (let excitation = 250; excitation <= 450; excitation += 5) {
      // 模拟一个主峰
      const x = (emission - 340) / 20
      const y = (excitation - 280) / 20
      const intensity = Math.exp(-(x**2 + y**2)) * 100
      data.push([xIndex, yIndex, intensity])
      yIndex++
    }
    xIndex++
  }

  return { xData, yData, data }
}
const { xData, yData, data } = generateData()
onMounted(() => {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)

  const option: echarts.EChartsOption = {
    title: {
      text: 'Component 1 (Z轴投影热力图)',
      left: 'center'
    },
    tooltip: {
      position: 'top',
      formatter: function (params: any) {
        return `Emission: ${params.data[0]} nm<br/>Excitation: ${params.data[1]} nm<br/>Intensity: ${params.data[2].toFixed(2)}`
      }
    },
    xAxis: {
      type: 'category',
      data: xData,
      name: 'Emission wavelength (nm)',
      nameLocation: 'middle',
      nameGap: 30,
      axisLabel: {
        rotate: 45,
        interval: 9
      }
    },
    yAxis: {
      type: 'category',
      data: yData,
      name: 'Excitation wavelength (nm)',
      nameLocation: 'middle',
      nameGap: 40
    },
    grid: {
      left: '12%',
      right: '10%',
      top: '15%',
      bottom: '20%',
    },
    visualMap: {
      min: 0,
      max: 100,
      calculable: false,
      orient: 'horizontal',
      left: 'center',
      bottom: '15px',
      inRange: {
        color: ['#00688B', '#00BFFF', '#00FF00', '#FFFF00', '#FF6347']
      }
    },
    series: [
      {
        name: 'Intensity',
        type: 'heatmap',
        data: data,
        emphasis: {
          itemStyle: {
            borderColor: '#333',
            borderWidth: 1
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