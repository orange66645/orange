<template>
  <div class="rank-container">
    <el-card class="rank-card">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <h3>小说风云榜</h3>
            <el-tag type="warning" effect="plain" size="small">每日更新</el-tag>
          </div>
          <div class="header-right">
            <el-radio-group v-model="rankType" size="small">
              <el-radio-button label="total">总榜</el-radio-button>
              <el-radio-button label="month">月榜</el-radio-button>
              <el-radio-button label="week">周榜</el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </template>

      <!-- 加载状态 -->
      <el-skeleton :rows="10" animated v-if="loading"/>

      <!-- 空状态 -->
      <el-empty 
        v-else-if="!rankList.length" 
        description="暂无排行数据"
      />

      <!-- 排行榜列表 -->
      <div v-else class="rank-list">
        <div 
          v-for="(book, index) in rankList" 
          :key="book.id" 
          class="rank-item"
          :class="{ 'top-three': index < 3 }"
        >
          <!-- 排名 -->
          <div class="rank-number" :class="`rank-${index + 1}`">
            {{ index + 1 }}
          </div>

          <!-- 书籍信息 -->
          <div class="book-info">
            <router-link 
              :to="`/book/detail/${book.id}`" 
              class="book-title"
            >
              {{ book.title }}
            </router-link>
            <div class="book-meta">
              <span class="author">
                <el-icon><User /></el-icon>
                {{ book.author }}
              </span>
              <span class="category" v-if="book.categoryName">
                <el-icon><Collection /></el-icon>
                {{ book.categoryName }}
              </span>
            </div>
          </div>

          <!-- 数据统计 -->
          <div class="book-stats">
            <div class="stat-item">
              <el-icon><View /></el-icon>
              <span>{{ formatNumber(book.viewCount || 0) }}</span>
            </div>
            <div class="stat-item">
              <el-icon><Star /></el-icon>
              <span>{{ formatNumber(book.collectCount || 0) }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { fetchRankListAPI } from '@/api/book'
import { ElMessage } from 'element-plus'
import { User, Collection, View, Star } from '@element-plus/icons-vue'

// 状态定义
const rankList = ref([])
const loading = ref(true)
const rankType = ref('total')

// 数字格式化
const formatNumber = (num) => {
  if (!num) return '0'
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  return num.toString()
}

// 加载排行榜数据
const loadRankList = async () => {
  loading.value = true
  try {
    const res = await fetchRankListAPI(rankType.value)
    console.log('排行榜响应:', res)
    
    if (res.code === 200) {
      rankList.value = res.data
    } else {
      ElMessage.error(res.msg || '获取排行榜数据失败')
    }
  } catch (error) {
    console.error('获取排行榜失败:', error)
    ElMessage.error('获取排行榜数据失败')
  } finally {
    loading.value = false
  }
}

// 监听排行榜类型变化
watch(rankType, (newType) => {
  console.log('切换排行榜类型:', newType)
  loadRankList()
})

// 组件挂载时加载数据
onMounted(() => {
  console.log('组件挂载，开始加载数据')
  loadRankList()
})
</script>

<style scoped>
.rank-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.rank-card {
  background: #fff;
  border-radius: 8px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-left h3 {
  margin: 0;
  font-size: 18px;
  color: #303133;
}

.rank-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 0;
}

.rank-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  background: #f8f9fa;
  transition: all 0.3s ease;
}

.rank-item:hover {
  transform: translateX(5px);
  background: #f0f2f5;
}

.rank-item.top-three {
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.rank-number {
  width: 28px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  border-radius: 50%;
  font-weight: bold;
  margin-right: 16px;
  color: #fff;
  background: #909399;
}

.rank-1 { background: #f56c6c; }
.rank-2 { background: #e6a23c; }
.rank-3 { background: #67c23a; }

.book-info {
  flex: 1;
  min-width: 0;
}

.book-title {
  display: block;
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  text-decoration: none;
  margin-bottom: 8px;
}

.book-title:hover {
  color: #409eff;
}

.book-meta {
  display: flex;
  gap: 16px;
  color: #606266;
  font-size: 14px;
}

.book-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.book-stats {
  display: flex;
  gap: 16px;
  margin-left: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #909399;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .rank-container {
    padding: 10px;
  }

  .book-stats {
    display: none;
  }

  .book-meta {
    flex-direction: column;
    gap: 4px;
  }
}
</style>