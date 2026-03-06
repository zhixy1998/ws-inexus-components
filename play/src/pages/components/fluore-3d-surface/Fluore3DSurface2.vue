<template>
  <div ref="chartRef" :style="{ width: width, height: height }"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption, ECharts } from 'echarts'

// 定义props
interface Props {
  width?: string
  height?: string
  data?: number[][]
  xAxisData?: number[]
  yAxisData?: number[]
  visualMap?: {
    min?: number
    max?: number
    calculable?: boolean
    inRange?: {
      color?: string[]
    }
  }
}

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '500px',
  visualMap: () => ({
    min: -5,
    max: 5,
    calculable: true,
    inRange: {
      color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8',
        '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
    }
  })
})

// 图表实例和DOM引用
const chartRef = ref<HTMLDivElement>()
let chartInstance: ECharts | null = null

// 生成示例数据
const generateData = () => {
  // 生成 x 轴和 y 轴数据
  const xAxisData = props.xAxisData || []
  const yAxisData = props.yAxisData || []

  // 如果没有提供数据，生成示例数据
  if (xAxisData.length === 0) {
    for (let i = -10; i <= 10; i += 0.5) {
      xAxisData.push(i)
    }
  }

  if (yAxisData.length === 0) {
    for (let i = -10; i <= 10; i += 0.5) {
      yAxisData.push(i)
    }
  }

  // 生成等高线数据
  const data: number[][] = []
  for (let i = 0; i < yAxisData.length; i++) {
    for (let j = 0; j < xAxisData.length; j++) {
      const x = xAxisData[j]
      const y = yAxisData[i]
      // 示例函数：z = sin(x) * cos(y) + 山峰效果
      const z = Math.sin(x) * Math.cos(y) +
          0.5 * Math.exp(-(x*x + y*y)/10) +
          0.3 * Math.sin(x * 2) * Math.cos(y * 2)
      data.push([x, y, z])
    }
  }

  return data
}

// 获取图表配置
const getOption = (): EChartsOption => {
  const data = props.data || generateData()

  return {
    title: {
      text: '等高线图示例',
      left: 'center',
      top: 10
    },
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        return `X: ${params.data[0].toFixed(2)}<br/>Y: ${params.data[1].toFixed(2)}<br/>Z: ${params.data[2].toFixed(2)}`
      }
    },
    visualMap: {
      min: props.visualMap?.min || -5,
      max: props.visualMap?.max || 5,
      calculable: props.visualMap?.calculable,
      inRange: props.visualMap?.inRange,
      left: 'left',
      bottom: 'bottom'
    },
    xAxis3D: {
      type: 'value',
      name: 'X',
      nameTextStyle: {
        fontSize: 14
      }
    },
    yAxis3D: {
      type: 'value',
      name: 'Y',
      nameTextStyle: {
        fontSize: 14
      }
    },
    zAxis3D: {
      type: 'value',
      name: 'Z',
      min: -5,
      max: 5,
      nameTextStyle: {
        fontSize: 14
      }
    },
    grid3D: {
      viewControl: {
        projection: 'perspective',
        autoRotate: true,
        autoRotateSpeed: 5,
        distance: 100,
        alpha: 20, // 上下角度
        beta: 30,  // 左右角度
        animation: true,
        animationDurationUpdate: 1000
      },
      boxHeight: 30,
      axisLine: {
        lineStyle: {
          color: '#333'
        }
      },
      splitLine: {
        lineStyle: {
          color: ['#ccc'],
          width: 1
        }
      }
    },
    series: [{
      type: 'surface',
      name: '等高线',
      data: data,
      shading: 'color',
      wireframe: {
        show: true,
        lineStyle: {
          color: '#999',
          width: 1,
          opacity: 0.3
        }
      },
      contour: {
        show: true,
        tooltip: true,
        laber: {
          show: true
        },
        // 等高线样式
        itemStyle: {
          color: '#000',
          opacity: 0.5,
          borderColor: '#333',
          borderWidth: 1
        }
      },
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 1,
          colorStops: [
            { offset: 0, color: '#313695' },
            { offset: 0.2, color: '#4575b4' },
            { offset: 0.4, color: '#74add1' },
            { offset: 0.6, color: '#abd9e9' },
            { offset: 0.8, color: '#e0f3f8' },
            { offset: 1, color: '#ffffbf' }
          ]
        }
      }
    }]
  }
}

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return

  if (!chartInstance) {
    chartInstance = echarts.init(chartRef.value)
  }

  const option = getOption()
  chartInstance.setOption(option)

  // 添加窗口大小变化监听
  window.addEventListener('resize', handleResize)
}

// 处理窗口大小变化
const handleResize = () => {
  chartInstance?.resize()
}

// 导出图表方法供父组件调用
const getChartInstance = () => chartInstance

defineExpose({
  getChartInstance,
  initChart
})

// 生命周期钩子
onMounted(() => {
  initChart()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
  chartInstance = null
})

// 监听数据变化
watch(() => props.data, () => {
  if (chartInstance) {
    chartInstance.setOption(getOption())
  }
}, { deep: true })

// 监听尺寸变化
watch(() => [props.width, props.height], () => {
  handleResize()
})
</script>

<style scoped>
div {
  position: relative;
}
</style>