<script setup>
import {ref, onMounted} from 'vue'
import * as echarts from 'echarts/core'
import {LineChart} from 'echarts/charts'
import {GridComponent} from 'echarts/components'
import {SVGRenderer} from 'echarts/renderers'

// 注册
echarts.use([
  LineChart,
  GridComponent,
  SVGRenderer
])

const props = defineProps({
  lineChartData: Array,
  type: String
})

const chartRef = ref(null)
const optionTrue = ref(null)
const widthTrue = ref(null)
const myChart = ref(null)

// const imageDomLine = document.createElement('img')
const imageDomLabel2 = document.createElement('img')
const imageDomLabel = document.createElement('img')
// imageDomLine.src = './assets/img_1.webp'
imageDomLabel2.src = new URL("@/assets/image/line-chart-tag2.webp", import.meta.url)
imageDomLabel.src = new URL("@/assets/image/line-chart-tag.webp", import.meta.url)
// 45,170,80
const startVal = Number(props.lineChartData[0].value.weight)
const endVal = Number(props.lineChartData[2].value.weight)
const lineChartData = props.lineChartData.map(i => {
  return {
    label: i.label,
    value: i.value.weight + i.value.unit
  }
})
let type = startVal > endVal ? 'down' : 'up';
(startVal === endVal) && (type = 'flat');

// 指定图表的配置项和数据
let option = {
  // 视图区域的配置
  grid: {
    left: 0,
    top: 0,
    right: 0,
    bottom: '10%',
  },
  xAxis: {
    type: 'value', //X 轴类型是数值轴
    min: 0, // 开始值
    max: 479, // 结束值
    boundaryGap: false, // 坐标轴两边留白策略
    splitLine: { // 网格线
      show: false
    },
    axisTick: { // 坐标轴刻度线
      show: false
    },
    axisLine: { // 坐标轴轴线
      show: true
    },
    axisLabel: { // 坐标轴刻度标签
      show: false
    },
  },
  //   同x轴配置
  yAxis: {
    type: 'value',
    min: 0,
    max: 295,
    axisLine: {
      show: false
    },
    axisLabel: {
      show: false
    },
    splitLine: {
      show: false
    }
  },
  series: [],
};
const beforeData = [
  {
    value: [0, 209],
  },
  {
    value: [56, 207],
    label: lineChartData[0]?.label || "Today",
    label2: lineChartData[0]?.value || "58.9kg",
    label2Class:"startText",
    //   原点颜色
    verticalLine: '#EF035F',
  },
  {
    value: [175, 145],
    label: lineChartData[1]?.label || "1st week",
    label2: lineChartData[1]?.value || "58.9kg",
    label2Class:"centerText",
    //原点颜色和垂线颜色一致
    verticalLine: '#ED7859',
  },
  {
    value: [400, 48],
    label: lineChartData[2]?.label || "Aug 1",
    label2: lineChartData[2]?.value || "58.9kg",
    label2Class:"endText",
    // labelHidden: true,
    verticalLine: '#57810D',
    labelStyle: {
      color: "#57810D"
    },
  },
  {
    value: [479, 48],
  },
]
if (type === 'flat') {
  beforeData.forEach(i => {
    i.value[1] = 135
  })
  //  echarts 数据点高度不能完全一致，不然不会渲染
  beforeData[beforeData.length - 1].value[1] = 135.1
}
if (type === 'up') {
  beforeData[2].value[1] = 115;
  [beforeData[0].value[1],beforeData[4].value[1]] = [beforeData[4].value[1],beforeData[0].value[1]];
  [beforeData[1].value[1],beforeData[3].value[1]] = [beforeData[3].value[1],beforeData[1].value[1]];
  // 微调
  beforeData[3].value[1] -=10
  beforeData[4].value[1] = beforeData[3].value[1]
}
// 数据高度赋值110%
beforeData.forEach(i => {
  i.value[1] *= 1.1
})
// 文本替换
if (props.lineChartData.endText) {
  beforeData.filter(i => i.label).forEach((i, index) => {
    i.label = props.lineChartData.endText[index]
  })
  beforeData.filter(i => i.label2).forEach((i, index) => {
    i.label2 = props.lineChartData.topLabel
  })
}

// 生成连接的虚线
function createLine(pointArray, option = {}) {
  return {
    type: 'line',
    key: option.key || '',
    smooth: 0.3,
    symbol: 'rect',
    itemStyle: {
      color: 'rgba(0,0,0,0)'
    },
    animationDurationUpdate: option.animationDuration || 500,
    animationDelayUpdate: option.animationDelay || 0,
    label: {
      show: option.labelHidden ? !option.labelHidden : true,
      position: "bottom",
      formatter: option.formatter || '',
      rich: {
        text: {
          // 默认底部文字颜色
          color: 'white',
          align: "center",
          verticalAlign: 'top',
          fontWeight: 600,
          fontFamily: "",
          fontSize: 18 / 479 * widthTrue.value,
          ...(option.labelStyle || {})
        }
      }
    },
    lineStyle: {
      normal: {
        width: (option.width || 1.5) / 479 * widthTrue.value,  // 虚线宽度
        type: option.type || [6, 6],  // 虚线类型
        color: option.color || 'blue'  // 虚线颜色
      }
    },
    data: pointArray
  }
}

// 生成数据点
function computeData(inputData) {
  let array = []
  inputData.forEach((item, index) => {
    array[index] = item.value
  })
  return array
}

// 数据初始化
function init() {
  option.series = []
  beforeData.forEach(item => {
    // 生成垂线
    if (item.label) {
      option.series.push(createLine([[item.value[0], 0], item.value], {
        ...item,
        type: [4, 4],
        color: item.verticalLine,
        formatter(params) {
          return params.dataIndex === 0 ? `{text|${item.label}}` : ''
        },
      }))
    }
  })
  // 最后生成弧线
  const curveSeries = {
    name: 'line',
    type: 'line',
    smooth: true,
    animation: true,
    data: computeData(beforeData),
    symbol: (value, params) => {
      return beforeData[params.dataIndex].verticalLine ? 'circle' : 'none'
    },
    symbolSize: 20 / 360 * widthTrue.value,
    itemStyle: {
      borderWidth: 2,
      borderColor: 'white',
      color: (params) => beforeData[params.dataIndex].verticalLine,
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
    lineStyle: {
      width: 6 / 479 * widthTrue.value,
      color: {
        // image: imageDomLine, // 支持为 HTMLImageElement, HTMLCanvasElement，不支持路径字符串
        // repeat: 'no-repeat'
        type: 'linear',
        x: 0,
        y: 0,
        x2: 1,
        y2: 0,
        colorStops: [
          {offset: 0, color: '#EF025E'},
          {offset: 0.7, color: '#EBFF53'},
          {offset: 1, color: '#57810D'}
        ],
        global: false // 缺省为 false
      }
    },
    label: {
      show: true,
      position: 'top',
      distance: 0,
      formatter: (params) => {
        let label2 = beforeData[params.dataIndex].label2
        const label2Class = beforeData[params.dataIndex].label2Class
        return label2 ? (`{${label2Class?label2Class:'endText'}|${label2}}`) : ''
      },
      rich: {
        "endText": {
          backgroundColor: {
            image: imageDomLabel
          },
          width: 139 / 479 * widthTrue.value,
          height: 81 / 479 * widthTrue.value,
          color: 'white',
          align: "center",
          verticalAlign: 'top',
          fontWeight: 600,
          fontSize: 32 / 479 * widthTrue.value,
          padding: [0, 0, 10 / 479 * widthTrue.value, 0],
        },
        "centerText": {
          backgroundColor: {
            image: imageDomLabel2,
          },
          width: 76 / 479 * widthTrue.value,
          height: 42 / 479 * widthTrue.value,
          color: '#323233',
          align: "center",
          verticalAlign: 'top',
          fontWeight: 700,
          fontSize: 17 / 479 * widthTrue.value,
          padding: [0, 0, 6 / 479 * widthTrue.value, 0],
        },
        "startText": {
          color: 'white',
          align: "center",
          verticalAlign: 'top',
          fontWeight: 600,
          fontSize: 18 / 479 * widthTrue.value,
          padding: [0, 0, 10 / 479 * widthTrue.value, 0],
        },
      }
    },
  }
  // 生成弧线备份
  option.series.push(curveSeries)
  myChart.value.setOption(option)
}


onMounted(() => {
  myChart.value = echarts.init(chartRef.value, null, {
    renderer: 'svg'
  })
  widthTrue.value = chartRef.value.offsetWidth
  init()
})
</script>

<template>
  <div ref="chartRef" style="width: 100%; height: 100%;"></div>
</template>
