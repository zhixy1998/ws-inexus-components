<template>
  <div ref="chartContainer" class="contour-chart"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import * as d3 from 'd3'
import type { ContourMultiPolygon } from 'd3'

interface Props {
  width?: number
  height?: number
  data?: number[][]  // 二维数组格式
  levels?: number    // 等高线数量
}

const props = withDefaults(defineProps<Props>(), {
  width: 928,
  levels: 20
})

const chartContainer = ref<HTMLDivElement>()

// 将二维数组转换为一维数组并获取尺寸
const formatData = (matrix: number[][]) => {
  const height = matrix.length
  const width = matrix[0].length
  const values = matrix.flat()
  return { width, height, values }
}

onMounted(() => {
  if (!chartContainer.value) return

  // 生成示例数据
  const generateExampleData = () => {
    const size = 100
    const data: number[][] = []

    for (let i = 0; i < size; i++) {
      const row: number[] = []
      for (let j = 0; j < size; j++) {
        const x = (j / size) * 6 - 3
        const y = (i / size) * 6 - 3

        // 双峰地形
        const z = 5 * Math.exp(-(x*x + y*y)/4) +
            4 * Math.exp(-((x-2)*(x-2) + (y-2)*(y-2))/3) +
            3 * Math.exp(-((x+2)*(x+2) + (y+2)*(y+2))/3)

        row.push(z)
      }
      data.push(row)
    }
    return data
  }
  const data = {
    width: 87,
    height: 61,
    values: [103, 104, 104, 105, 105, 106, 106, 106, 107, 107, 106, 106, 105, 105, 104, 104, 104, 104, 105, 107]
  }
  const matrixData = props.data || generateExampleData()
  const { width: gridWidth, height: gridHeight, values } = formatData(matrixData)

  // 计算SVG尺寸
  const svgWidth = props.width
  const svgHeight = Math.round(gridHeight / gridWidth * svgWidth)

  // 创建投影
  const path = d3.geoPath().projection(
      d3.geoIdentity().scale(svgWidth / gridWidth)
  )

  // 创建等高线生成器
  const contours = d3.contours().size([gridWidth, gridHeight])

  // 创建颜色比例尺
  const color = d3.scaleSequential(d3.interpolateTurbo)
      .domain(d3.extent(values) as [number, number])
      .nice()

  // 创建SVG
  const svg = d3.create("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .attr("viewBox", [0, 0, svgWidth, svgHeight])
      .style("max-width", "100%")
      .style("height", "auto")

  // 绘制等高线
  svg.append("g")
      .attr("stroke", "#333")
      .attr("stroke-width", 0.5)
      .attr("fill-opacity", 0.8)
      .selectAll()
      .data(color.ticks(props.levels))
      .join("path")
      .attr("d", (d: number) => {
        const contour = contours.contour(values, d)
        return path(contour) || ''
      })
      .attr("fill", color)

  // 添加颜色条
  const legendHeight = 200
  const legendWidth = 20
  const legendSvg = svg.append("g")
      .attr("transform", `translate(${svgWidth - 50}, 20)`)

  // 绘制渐变色条
  const defs = svg.append("defs")
  const linearGradient = defs.append("linearGradient")
      .attr("id", "legend-gradient")
      .attr("x1", "0%")
      .attr("y1", "100%")
      .attr("x2", "0%")
      .attr("y2", "0%")

  // 添加渐变颜色 stops
  const ticks = color.ticks(10)
  ticks.forEach((t: number, i: number) => {
    linearGradient.append("stop")
        .attr("offset", `${(i / (ticks.length - 1)) * 100}%`)
        .attr("stop-color", color(t))
  })

  legendSvg.append("rect")
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .style("fill", "url(#legend-gradient)")
      .attr("stroke", "#333")
      .attr("stroke-width", 0.5)

  // 添加数值标签
  const [min, max] = color.domain()
  legendSvg.append("text")
      .attr("x", legendWidth + 5)
      .attr("y", 0)
      .attr("dy", "0.3em")
      .style("font-size", "10px")
      .text(max.toFixed(1))

  legendSvg.append("text")
      .attr("x", legendWidth + 5)
      .attr("y", legendHeight)
      .attr("dy", "-0.3em")
      .style("font-size", "10px")
      .text(min.toFixed(1))

  // 清空容器并添加新的SVG
  chartContainer.value.innerHTML = ''
  chartContainer.value.appendChild(svg.node() as Node)
})
</script>

<style scoped>
.contour-chart {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}
</style>