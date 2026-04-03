<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { GridComponent, MarkPointComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
echarts.use([
  LineChart,
  GridComponent,
  MarkPointComponent,
  CanvasRenderer
])

const chartRef = ref(null)
let chart = null

const xLabels = ['','Week 1', 'Week 2', 'Week 3', 'Week 4','']
const trendData = [null,88, 52, 40, 18,null]
const startPoint = [xLabels[0], trendData[0]]
const endPoint = [xLabels[xLabels.length - 1], trendData[trendData.length - 1]]

const option = {
  grid: {
    left: 10,
    right: 10,
    top: 28,
    bottom: 44,
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: xLabels,
    boundaryGap: false,
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: {
      color: 'rgba(170,170,170,0.92)',
      fontSize: 14,
      fontWeight: 700,
      margin: 18
    },
    splitLine: {
      show: true,
      lineStyle: {
        type: 'dashed',
        color: 'rgba(129,129,129,0.65)',
        width: 1
      },
      interval: function (index) {
        // 不显示第一个和最后一个
        return index !== 0 && index !== trendData.length - 1
      }
    }
  },
  yAxis: {
    type: 'value',
    min: 0,
    max: 100,
    splitNumber: 4,
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { show: false },
    splitLine: {
      show: true,
      lineStyle: {
        type: 'dashed',
        color: 'rgba(129,129,129,0.65)',
        width: 1
      },
      interval: function (index) {
        return index !== 0
      }
    }
  },
  series: [
    {
      type: 'line',
      data: trendData,
      smooth: 0.4,
      symbol: 'none',
      lineStyle: {
        width: 4,
        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: '#FA0A77' },
          { offset: 0.58, color: '#E9F85B' },
          { offset: 1, color: '#56B718' }
        ])
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 1,
          y: 0,
          x2: 0,
          y2:0,
          colorStops: [
            {
              offset: 0,
              color: 'rgba(87, 129, 13, 0.10)' // 顶部
            },
            {
              offset: 0.3,
              color: 'rgba(235, 255, 83, 0.10)' // 底部透明
            },
            {
              offset: 0.8,
              color: 'rgba(239, 2, 94, 0.10)' // 底部透明
            },
          ]
        },
      },
      markPoint: {
        symbol: 'circle',
        symbolSize: 32,
        label: { show: false },
        z: 4,
        data: [
          {
            coord: startPoint,
            itemStyle: {
              color: '#fff',
              borderColor: '#FA0A77',
              borderWidth: 6
            }
          },
          {
            coord: endPoint,
            itemStyle: {
              color: '#fff',
              borderColor: '#56B718',
              borderWidth: 6
            }
          }
        ]
      }
    },
    {
      type: 'line',
      data: trendData,
      smooth: 0.4,
      symbol: 'none',
      lineStyle: { opacity: 0 },
      areaStyle: { opacity: 0 },
      markPoint: {
        symbol: 'circle',
        symbolSize: 12,
        label: { show: false },
        z: 5,
        data: [
          {
            coord: startPoint,
            itemStyle: {
              color: '#FA0A77'
            }
          },
          {
            coord: endPoint,
            itemStyle: {
              color: '#56B718'
            }
          }
        ]
      }
    }
  ]
};

onMounted(() => {
  chart = echarts.init(chartRef.value)
  chart.setOption(option)
  window.addEventListener('resize', resizeChart)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeChart)
  chart?.dispose()
  chart = null
})

function resizeChart() {
  chart?.resize()
}
</script>

<template>
  <div class="">
    <div class="name"></div>
    <div class="title"></div>
    <div class="subtitle"></div>
    <div ref="chartRef" class="chart"></div>
  </div>
</template>

<style scoped lang="less">
.chart{
  width: 479px;
  height: 295px;
}
</style>
