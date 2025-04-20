<template>
  <div class="dashboard">
    <!-- 数据概览卡片 -->
    <el-row :gutter="20">
      <el-col :span="6" v-for="(item, index) in statistics" :key="index">
        <el-card shadow="hover" class="stat-card">
          <div class="card-content">
            <div class="icon">
              <el-icon :size="40"><component :is="item.icon" /></el-icon>
            </div>
            <div class="info">
              <div class="value">{{ item.value }}</div>
              <div class="label">{{ item.label }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>用户增长趋势</span>
            </div>
          </template>
          <!-- 这里可以添加图表组件 -->
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>小说分类统计</span>
            </div>
          </template>
          <!-- 这里可以添加图表组件 -->
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getDashboardData } from '@/api/admin/dashboard'

const statistics = ref([
  { label: '总用户数', value: 0, icon: 'User' },
  { label: '总小说数', value: 0, icon: 'Reading' },
  { label: '今日访问', value: 0, icon: 'View' },
  { label: '总评论数', value: 0, icon: 'ChatDotRound' }
])

onMounted(async () => {
  try {
    const res = await getDashboardData()
    if (res.code === 200) {
      // 更新统计数据
      statistics.value[0].value = res.data.userCount
      statistics.value[1].value = res.data.novelCount
      statistics.value[2].value = res.data.visitCount
      statistics.value[3].value = res.data.commentCount
    }
  } catch (error) {
    console.error('获取仪表盘数据失败:', error)
  }
})
</script>

<style scoped>
.dashboard {
  .stat-card {
    .card-content {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .icon {
      color: #409EFF;
    }

    .info {
      .value {
        font-size: 24px;
        font-weight: bold;
        color: #303133;
      }

      .label {
        font-size: 14px;
        color: #909399;
        margin-top: 5px;
      }
    }
  }

  .chart-row {
    margin-top: 20px;
  }
}
</style>