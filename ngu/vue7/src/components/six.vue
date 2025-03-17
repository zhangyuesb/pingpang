<template>
    <div>
      <el-card>
        <template #header>
          <div class="card-header">能力分析</div>
        </template>
        <div ref="chartRef" style="width: 100%; height: 400px;"></div>
      </el-card>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue';
  import * as echarts from 'echarts';
  
  const chartRef = ref(null);
  
  // 默认数据（后续可以传入新的数据替换）
  const playerData = [85, 90, 75, 80, 95, 88];
  
  const option = {
    tooltip: {},
    radar: {
      shape: 'polygon', // 使其呈六边形
      indicator: [
        { name: '力量', max: 100 },
        { name: '速度', max: 100 },
        { name: '技术', max: 100 },
        { name: '发球', max: 100 },
        { name: '经验', max: 100 },
        { name: '防守', max: 100 }
      ],
      axisName: {
        color: '#333',
        fontSize: 16, // 字体加大
        fontWeight: 'bold'
      },
      splitLine: {
        lineStyle: {
          color: ['#aaa', '#bbb', '#ccc', '#ddd', '#eee']
        }
      }
    },
    series: [
      {
        name: '能力值',
        type: 'radar',
        data: [
          {
            value: playerData, // 这里使用默认数据
            name: '球员 A'
          }
        ],
        itemStyle: {
          color: '#ff5722' // 线条颜色
        },
        areaStyle: {
          color: 'rgba(255, 87, 34, 0.3)' // 填充颜色
        },
        animationDuration: 1000 // 动画时长
      }
    ]
  };
  
  onMounted(() => {
    const chart = echarts.init(chartRef.value);
    chart.setOption(option);
  });
  </script>
  
  <style scoped>
  .card-header {

    text-align: center;
    padding: 10px;
  }
  </style>
  