<template>
    <nav>
    <router-link to="/main">返回</router-link> 
    </nav>
    <div class="history-page">
        <!-- 综合分析窗口 -->
        <el-card class="analysis-card">
            <template #header>
                <h1>用户数据综合分析</h1>
            </template>
            <Chart id="app"/>
        </el-card>

        <!-- 历史报告列表 -->
        <el-card>
            <template #header>
                <h1>历史报告记录</h1>
            </template>
            <el-table :data="reports" stripe>
                <el-table-column prop="reportName" label="报告名称"></el-table-column>
                <el-table-column prop="reportTime" label="报告时间"></el-table-column>
                <el-table-column label="操作">
                    <template #default="scope">
                    <!-- 查看报告按钮 -->
                    <el-button @click="viewReport(scope.row)">查看报告</el-button>
                    <!-- 下载报告按钮 -->
                    <el-button @click="downloadReport(scope.row)">下载</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Chart from '../components/Chart.vue';
const router = useRouter();
// 模拟历史报告数据
const reports = ref([
    {
        reportName: '报告1',
        reportTime: '2025-03-01 10:00',
        downloadUrl: 'https://example.com/report1.pdf'
    },
    {
        reportName: '报告2',
        reportTime: '2025-03-02 14:30',
        downloadUrl: 'https://example.com/report2.pdf'
    }
]);

// 查看报告的方法
const viewReport = (report) => {
    window.open(report.viewUrl, '_blank');
};

// 下载报告的方法
const downloadReport = (report) => {
    window.open(report.downloadUrl, '_blank');
};
</script>

<style scoped>
.history-page {
    padding: 20px;
}

.analysis-card {
    margin-bottom: 20px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>