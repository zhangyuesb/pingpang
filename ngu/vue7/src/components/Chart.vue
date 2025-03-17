<template>
    <div>
      <!-- 使用 ElementPlus 的开关组件来切换图表类型 -->
      <el-switch
        v-model="chartType"
        active-value="pie"
        inactive-value="bar"
        active-text="技巧分析（环形图）"
        inactive-text="表现分析（柱状图）"
      />
      <el-card>
        <template #header>
          <div class="card-header">
            <!-- 根据 chartType 动态显示标题 -->
            {{ chartType === 'bar'? '表现分析' : '技巧分析' }}
          </div>
        </template>
        <div ref="chartRef" style="width: 100%; height: 400px;"></div>
      </el-card>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref, watch } from 'vue';
  import * as echarts from 'echarts';
  import { ElSwitch, ElCard } from 'element-plus';
  
  // 定义一个属性来控制图表类型
  const chartType = ref('bar'); 
  const chartRef = ref(null);
  let chartInstance = null;
  
  // 定义柱状图的数据
  const barData = [10, 20, 30, 40, 50];
  // 定义环形图的数据
  const pieData = [
    { value: 335, name: '发球' },
    { value: 310, name: '接发球' },
    { value: 234, name: '击球' },
    { value: 135, name: '步法' },
    { value: 1548, name: '战术' }
  ];
  
  // 更新图表的方法
  const updateChart = () => {
    // 销毁之前的图表实例
    if (chartInstance) {
      chartInstance.dispose();
    }
    chartInstance = echarts.init(chartRef.value);
    let option;
    // 根据 chartType 来设置不同的图表配置
    if (chartType.value === 'bar') {
      option = {
        xAxis: {
          type: 'category',
          data: ['力量', '速度', '反应', '连贯', '技巧']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: barData,
            type: 'bar'
          }
        ]
      };
    } else {
      option = {
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            name: '技巧分析',
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
            data: pieData
          }
        ]
      };
    }
    chartInstance.setOption(option);
  };
  
  // 监听 chartType 的变化，当变化时更新图表
  watch(chartType, () => {
    updateChart();
  });
  
  onMounted(() => {
    updateChart();
  });
  </script>
  
  <style scoped>
  /* 可以添加一些样式来美化页面 */
  .el-switch {
    margin-bottom: 10px;
  }
  
  .el-card {
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .card-header {
    font-size: 18px;
    font-weight: bold;
    color: #333;
  }
  </style>