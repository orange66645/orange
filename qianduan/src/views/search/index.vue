<template>
  <div class="search-container">
    <!-- 搜索框 -->
    <div class="search-header">
      <el-input
        v-model="keyword"
        placeholder="搜索小说名称、作者"
        class="search-input"
        clearable
        @keyup.enter="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
        <template #append>
          <el-button @click="handleSearch">搜索</el-button>
        </template>
      </el-input>
    </div>

    <!-- 搜索结果 -->
    <div class="search-content">
      <!-- 加载状态 -->
      <el-skeleton :rows="10" animated v-if="loading"/>

      <!-- 空状态 -->
      <el-empty 
        v-else-if="!searchResults.length" 
        :description="keyword ? '未找到相关小说' : '请输入关键词搜索'"
      />

      <!-- 搜索结果列表 -->
      <div v-else class="search-list">
        <div 
          v-for="book in searchResults" 
          :key="book.id" 
          class="book-item"
        >
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
            <div class="book-desc" v-if="book.description">
              {{ book.description }}
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
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { searchNovels } from '@/api/book'
import { ElMessage } from 'element-plus'
import { Search, User, Collection, View, Star } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

// 状态定义
const keyword = ref('')
const searchResults = ref([])
const loading = ref(false)

// 数字格式化
const formatNumber = (num) => {
  if (!num) return '0'
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  return num.toString()
}

// 搜索方法
const handleSearch = async () => {
  if (!keyword.value.trim()) {
    ElMessage.warning('请输入搜索关键词')
    return
  }

  loading.value = true
  try {
    // 更新 URL 参数
    router.push({
      path: '/search',
      query: { keyword: keyword.value }
    })

    const res = await searchNovels(keyword.value)
    if (res.code === 200) {
      searchResults.value = res.data
    } else {
      ElMessage.error(res.msg || '搜索失败')
    }
  } catch (error) {
    console.error('搜索失败:', error)
    ElMessage.error('搜索失败')
  } finally {
    loading.value = false
  }
}

// 从 URL 参数中获取搜索关键词并执行搜索
onMounted(() => {
  const urlKeyword = route.query.keyword
  if (urlKeyword) {
    keyword.value = urlKeyword
    handleSearch()
  }
})
</script>

<style scoped>
.search-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.search-header {
  margin-bottom: 24px;
}

.search-input {
  max-width: 600px;
}

.search-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.book-item {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.book-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.book-info {
  flex: 1;
  min-width: 0;
}

.book-title {
  display: block;
  font-size: 18px;
  font-weight: 500;
  color: #303133;
  text-decoration: none;
  margin-bottom: 12px;
}

.book-title:hover {
  color: #409eff;
}

.book-meta {
  display: flex;
  gap: 16px;
  color: #606266;
  font-size: 14px;
  margin-bottom: 12px;
}

.book-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.book-desc {
  color: #909399;
  font-size: 14px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.book-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-left: 24px;
  min-width: 100px;
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
  .search-container {
    padding: 10px;
  }

  .book-item {
    flex-direction: column;
  }

  .book-stats {
    flex-direction: row;
    margin-left: 0;
    margin-top: 12px;
    justify-content: flex-start;
  }
}
</style>