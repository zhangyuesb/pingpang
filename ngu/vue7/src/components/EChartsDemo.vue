<template>
    <div>
      <el-card>
        <template #header>
          <div class="card-header">表现分析</div>
        </template>
        <div ref="chartRef" style="width: 100%; height: 400px;"></div>
      </el-card>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue';
  import * as echarts from 'echarts';
  
  const chartRef = ref(null);
  
  const data = [10, 20, 30, 40, 50];
  
  onMounted(() => {
    const chart = echarts.init(chartRef.value);
  
    const option = {
      xAxis: {
        type: 'category',
        data: ['力量', '速度', '反应', '连贯', '技巧']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: data,
          type: 'bar'
        }
      ]
    };
  
    chart.setOption(option);
  });
  </script>