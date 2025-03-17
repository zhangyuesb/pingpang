<template>
    <div>
      <el-card>
        <template #header>
          <div class="card-header">技巧分析</div>
        </template>
        <div ref="chartRef" style="width: 100%; height: 400px;"></div>
      </el-card>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue';
  import * as echarts from 'echarts';
  
  const chartRef = ref(null);
  
  const data = [
    { value: 335, name: '发球' },
    { value: 310, name: '接发球' },
    { value: 234, name: '击球' },
    { value: 135, name: '步法' },
    { value: 1548, name: '战术' }
  ];
  
  onMounted(() => {
    const chart = echarts.init(chartRef.value);
  
    const option = {
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: data
        }
      ]
    };
  
    chart.setOption(option);
  });
  </script>