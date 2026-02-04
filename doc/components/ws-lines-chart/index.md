# WsLinesChart 组件文档

## 概述

折线图是一个基于
ECharts 实现的动态折线图组件，支持多条数据线展示、标记点标注（如波峰、波谷）、坐标轴配置以及响应式调整等功能。

---

## 属性 (Props)

| 属性名            | 类型                 | 默认值                    | 描述                                 |
|----------------|--------------------|------------------------|------------------------------------|
| `lines`        | `ChartLinesData[]` | `[]`                   | 多条线的数据配置，必填项。每个元素包含线的名称、颜色及数据点。    |
| `xAxisOptions` | `Object`           | `{ min: 0, max: 800 }` | X 轴配置，包括最小值和最大值。                   |
| `yAxisOptions` | `Object`           | `{ min: '', max: '' }` | Y 轴配置，包括最小值和最大值。                   |
| `markSelect`   | `Array`            | `[]`                   | 控制标记点类型，可选值：`['标记点', '波峰', '波谷']`。 |
| `showMark`     | `Boolean`          | `true`                 | 是否显示标记点。                           |
| `yAxisName`    | `String`           | `''`                   | Y 轴标题。                             |
| `xAxisName`    | `String`           | `''`                   | X 轴标题。                             |
| `isDataZoom`   | `Boolean`          | `false`                | 是否启用数据缩放功能。                        |

---

## 方法 (Methods)

| 方法名                                                                                                                       | 参数 | 返回值       | 描述                             |
|---------------------------------------------------------------------------------------------------------------------------|----|-----------|--------------------------------|
|  | 无  | `Promise` | 截取当前图表图像，返回 PNG 格式的 Base64 数据。 |

---

## 事件 (Events)

| 事件名        | 参数       | 描述                         |
|------------|----------|----------------------------|
| `restore`  | 无        | 图表还原时触发。                   |
| `brushEnd` | `params` | 用户完成刷选区域后触发，参数包含刷选区域的坐标范围。 |

---

## 示例用法

### 基础用法

<WsLinesChart/>

### 截图功能
<WsLinesChartHasScreenshot/>
<script setup>
import WsLinesChart from "./example/index.vue";
import WsLinesChartHasScreenshot from './example/index.vue'
</script>


## 注意事项

1. 确保传入的 `lines`
   数据格式正确，每个数据点需包含坐标。
2. 若启用 `isDataZoom`，建议同时设置合适的 `xAxisOptions` 和 `yAxisOptions` 以优化用户体验。
3. 标记点功能依赖 `markSelect` 属性，请根据需要选择显示类型。
4. 组件内部使用了 `ResizeObserver` 监听容器尺寸变化，确保父容器具备明确的宽高。

---

## 依赖

- [ECharts](https://echarts.apache.org/)
- Vue 3 Composition API