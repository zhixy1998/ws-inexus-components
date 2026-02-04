<template>
  <div ref="chartRef" class="dynamic-line-chart" style="width: 100%; height: 100%"></div>
</template>

<script setup lang="ts">
import type {ECharts, EChartsOption} from 'echarts'
import * as echarts from 'echarts'
import type {PropType} from 'vue'
import {onBeforeUnmount, onMounted, ref, watch, computed, nextTick} from 'vue'
import type {ChartLinesData, xAxisType, ChartDataItem, MarkPointItem} from './type'

const props = defineProps({
  // 多条线的数据配置
  lines: {
    type: Array as PropType<ChartLinesData[]>,
    required: true,
    default: () => [],
  },
  xAxisOptions: {
    type: Object as PropType<xAxisType>,
    default: () => ({
      min: 0,
      max: 800,
    }),
  },
  yAxisOptions: {
    type: Object,
    default: () => ({
      min: '',
      max: '',
    }),
  },
  markSelect: {
    type: Array,
    default: () => [],
  },
  // 全局标记点显示控制
  showMark: {
    type: Boolean,
    default: true,
  },
  yAxisName: {
    type: String,
    default: '',
  },
  xAxisName: {
    type: String,
    default: '',
  },
  isDataZoom: {
    type: Boolean,
    default: false,
  },
})

const chartRef = ref<HTMLDivElement>()
let chart: ECharts | null = null
const unit = computed(() => {
  const matchResult = props.xAxisName.match(/\((.*?)\)/)
  return matchResult ? matchResult[1] : ''
})
// 生成标记点数据
const generateMarkPoints = (lineData: ChartDataItem[], lineIndex: number, lineName: string) => {
  const points: MarkPointItem[] = []
  lineData.forEach((item) => {
    if (props.markSelect.includes('标记点') && Number(item.marked)) {
      points.push({
        name: `${lineName}-标记`,
        coord: [Number(item.x), Number(item.y)],
        symbolSize: 20,
        label: {
          show: true,
          formatter: `${Number(item.x)}${unit.value}, ${Number(item.astrictY)}`, // 显示坐标值
          position: 'bottom', // 标签位置
          backgroundColor: 'rgba(255, 255, 255, 0.8)', // 背景色
          padding: [1, 2],
          borderRadius: 2,
          color: '#333',
          fontSize: 11,
        },
      })
    }

    if (props.markSelect.includes('波峰') && Number(item.feng)) {
      points.push({
        name: `${lineName}-波峰`,
        coord: [Number(item.x), Number(item.y)],
        symbol:
            'path://M489.90890884 1017.28884579l0-662.73273745L551.27305136 354.55610835 551.27305135 1017.28884579l-61.3641425-2e-8z M306.28092891 358.28692148L515.86227332 1.43220042l215.24570478 356.85472106-424.82704919 0z',
        symbolSize: 20,
        symbolKeepAspect: true,
        symbolOffset: [0, -9],
        itemStyle: {
          color: '#d8001b',
        },
        label: {
          show: true,
          formatter: `${Number(item.x)}${unit.value}, ${Number(item.astrictY)}`, // 显示坐标值
          position: 'top', // 标签位置
          backgroundColor: 'rgba(255, 255, 255, 0.8)', // 背景色
          padding: [1, 2],
          borderRadius: 2,
          color: '#333',
          fontSize: 11,
        },
      })
    }

    if (props.markSelect.includes('波谷') && Number(item.gu)) {
      points.push({
        name: `${lineName}-波谷`,
        coord: [Number(item.x), Number(item.y)],
        symbol:
            'path://M533.74591785 3.77295909l0 652.37753843L473.34059007 656.15049752 473.34059007 3.77295909l60.40532778 1e-8z M714.5047106 663.14464499L508.1980747 1014.42351103l-211.88249064-351.27886604 418.18912654 0z', // 替换为你的 SVG Path
        symbolSize: 20,
        symbolKeepAspect: true,
        symbolOffset: [0, 9],
        itemStyle: {
          color: '#70b503',
        },
        label: {
          show: true,
          formatter: `${Number(item.x)}${unit.value}, ${Number(item.astrictY)}`, // 显示坐标值
          position: 'bottom', // 标签位置
          backgroundColor: 'rgba(255, 255, 255, 0.8)', // 背景色
          padding: [1, 2],
          borderRadius: 2,
          color: '#333',
          fontSize: 11,
        },
      })
    }
  })

  return points
}

// 更新图表
const updateChart = () => {
  if (!chart) return

  chart.setOption(
      {
        title: {
          text: props.yAxisName,
        },
        legend: {
          data: props.lines.map((line) => line.name),
        },
        series: props.lines.map((line, index) => ({
          name: line.name,
          type: 'line',
          symbolSize: 6,
          symbol: 'none',
          itemStyle: {
            color: line.color || '#000',
          },
          markPoint: {
            data: props.showMark
                ? generateMarkPoints(line.data as ChartDataItem[], index, line.name)
                : [],
          },
          data: line.data?.map((item) => [item.x, item.y]),
          animation: false,
        })),
      },
      {
        replaceMerge: ['series'],
      },
  )
  chart?.setOption({
    xAxis: {
      min: props.xAxisOptions.min,
      max: props.xAxisOptions.max,
    },
  })
  chart?.setOption({
    yAxis: {
      min: props.yAxisOptions.min || undefined, // 默认值0
      max: props.yAxisOptions.max || undefined, // 默认值100
    },
  })
}
let resizeObserver: ResizeObserver | null = null
// 初始化图表
const initChart = () => {
  if (!chartRef.value) return
  chart = echarts.init(chartRef.value)

  const option: EChartsOption = {
    title: {
      text: props.yAxisName,
      textStyle: {
        fontSize: 12,
        fontWeight: 'normal',
        color: '#556677',
      },
      left: 'left', // 或者使用 '0' 或具体像素值
      top: 'top', // 或者使用 '0' 或具体像素值
      padding: [15, 10], // [上, 右, 下, 左] 内边距
    },
    backgroundColor: '#fff',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
      },
    },
    legend: {
      data: props.lines.map((line) => line.name),
      bottom: '1%',
      textStyle: {
        color: '#90979c',
      },
      type: 'scroll',
    },
    grid: {
      top: 'middle',
      left: '3%',
      // right: '4%',
      bottom: '5%',
      height: '80%',
      containLabel: true,
    },
    toolbox: {
      show: props.isDataZoom,
      feature: {
        // dataZoom: {
        //   yAxisIndex: false,
        // },
        restore: {
          show: true, // ✅ 一键还原
          title: '还原',
          icon: 'M520.859759 50.094367c-93.428159 0-186.700492 30.363595-265.792761 82.898847l-0.756863-0.779124c-5.320307 3.80658-10.395747 7.924809-15.582491 11.931735-5.164482 3.739798-10.17314 7.702202-15.226318 11.642346-17.318825 14.402673-43.519669 1.780856-43.252541-20.813755l1.001732-91.625041C181.539906 19.886597 161.883707 0.27492 137.263373 0.007791 112.643039-0.437423 92.497105 18.261565 92.185455 41.746604L89.046696 308.98631c-0.289389 22.594611 17.942124 41.404902 41.204556 43.185758 0.934949 0.066782 1.847638 0.133564 2.782588 0.133564 0.289389 0 0.578778-0.066782 0.890428-0.066782 0.445214 0.022261 0.890428 0.222607 1.402424 0.222607h0.400693l244.711877-0.801385c22.127136-0.066782 42.584719-15.226319 46.124171-37.041805a44.543661 44.543661 0 0 0-43.630973-52.000996h-0.445214l-75.975769 0.289389c-24.264163 0.066782-35.483556-30.274552-17.274304-45.745738C356.84292 167.853471 438.829078 139.137167 520.859759 139.137167c213.524636 0 387.247141 173.744765 387.24714 387.269402 0 213.546897-173.700244 387.269401-387.24714 387.269401S133.568097 739.953466 133.568097 526.384308a44.5214 44.5214 0 0 0-89.042801 0c0 262.631741 213.6582 476.312202 476.334463 476.312202 262.631741 0 476.289941-213.680461 476.289941-476.312202 0-262.631741-213.6582-476.312202-476.289941-476.312202',
        },
      },
      iconStyle: {
        color: '#666', // 默认图标颜色
        borderColor: '#666', // 默认边框颜色
      },
      emphasis: {
        iconStyle: {
          color: '#1890ff', // 激活时图标颜色
          borderColor: '#1890ff', // 激活时边框颜色
        },
      },
    },
    brush: {
      toolbox: ['rect'],
      xAxisIndex: 0,
      brushMode: 'single',
    },
    xAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: 'rgba(204,187,225,0.5)',
        },
      },
      splitLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        formatter: '{value}',
        showMinLabel: true,
        showMaxLabel: true,
        color: '#556677',
      },
      min: props.xAxisOptions.min,
      max: props.xAxisOptions.max,
      name: props.xAxisName,
      nameTextStyle: {
        color: '#556677',
      },
    },
    yAxis: {
      type: 'value',
      // min: props.yAxisOptions.min,
      // max: props.yAxisOptions.max,
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: '#556677',
        formatter: '{value}',
      },
      axisLine: {
        show: false,
        lineStyle: {
          color: '#DCE2E8',
        },
      },
    },
    dataZoom: [
      // {
      //   show: true,
      //   type: 'slider', // 明确指定类型
      //   height: 20,
      //   xAxisIndex: [0],
      //   realtime: true,
      //   bottom: 2,
      //   handleIcon:
      //     'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
      //   handleSize: '80%',
      //   handleStyle: {},
      //   textStyle: {
      //     fontSize: 10,
      //   },
      //   minValueSpan: 1, // 最小显示范围
      // },
      // {
      //   type: 'inside', // 内置型 dataZoom
      //   show: true,
      //   xAxisIndex: [0],
      //   zoomLock: !props.isDataZoom, // 解锁缩放比例以允许自由缩放
      //   // 添加鼠标交互支持
      //   zoomOnMouseWheel: true, // 鼠标滚轮缩放
      //   moveOnMouseMove: true, // 鼠标拖拽移动
      //   moveOnMouseWheel: true, // 鼠标滚轮移动
      // },
      {
        type: 'inside',
        xAxisIndex: [0],
        zoomLock: false, // ✅ 必须关闭
        zoomOnMouseWheel: false, // ✅ 避免冲突
        moveOnMouseMove: false,
      },
    ],
    series: props.lines.map((line, index) => ({
      name: line.name,
      type: 'line',
      symbolSize: 6,
      symbol: 'none',
      markPoint: {
        data: props.showMark
            ? generateMarkPoints(line.data as ChartDataItem[], index, line.name)
            : [],
      },
      itemStyle: {
        color: line.color || '#000',
      },
      data: line.data?.map((item) => [item.x, item.y]),
    })),
  }

  chart.setOption(option)

  chart.on('restore', () => {
    updateChart()
  })

  chart.on('brushEnd', (params: any) => {
    const area = params.areas?.[0]
    if (!area) return

    chart!.dispatchAction({
      type: 'dataZoom',
      startValue: area.coordRange[0][0],
      endValue: area.coordRange[0][1],
    })

    chart!.dispatchAction({
      type: 'brush',
      areas: [],
    })
  })

  window.addEventListener('resize', handleResize)
  resizeObserver = new ResizeObserver(handleResize)
  resizeObserver.observe(chartRef.value)
}

// 截图功能
const captureChart = () => {
  return new Promise((resolve) => {
    const imgData = chart?.getDataURL({
      type: 'png',
      pixelRatio: 2,
      backgroundColor: '#fff',
    })
    resolve(imgData)
  })
}

// 响应式调整
const handleResize = () => {
  chart?.resize()
}

// 监听props变化
watch(() => props.lines, updateChart, {deep: true})
watch(() => props.markSelect, updateChart, {deep: true})
watch(() => props.showMark, updateChart)
watch(
    () => props.yAxisOptions,
    (newVal) => {
      nextTick(() => {
        // 强制设置为默认值或者空值
        chart?.setOption({
          yAxis: {
            min: newVal.min || undefined, // 默认值0
            max: newVal.max || undefined, // 默认值100
          },
        })
      })
    },
    {deep: true, immediate: true},
)
watch(
    () => props.xAxisOptions,
    (newValue) => {
      nextTick(() => {
        chart?.setOption({
          xAxis: {
            min: newValue.min,
            max: newValue.max,
          },
        })
      })
    },
    {deep: true, immediate: true},
)
// 生命周期
onMounted(initChart)
onBeforeUnmount(() => {
  if (chart) {
    chart.dispose()
    window.removeEventListener('resize', handleResize)
  }
})

defineExpose({captureChart})
</script>

<style scoped>
.dynamic-line-chart {
  background: #dce2e8;
  border-radius: 4px;
}
</style>
