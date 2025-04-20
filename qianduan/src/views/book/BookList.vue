<template>
  <div class="book-list-container">
    <!-- 筛选区域 -->
    <el-card class="filter-section">
      <div class="filters">
        <div class="filter-item">
          <span class="label">分类：</span>
          <el-select v-model="filters.category" placeholder="全部分类" clearable>
            <el-option
              v-for="item in categories"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </div>
        <div class="filter-item">
          <span class="label">状态：</span>
          <el-radio-group v-model="filters.status">
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button :label="1">连载中</el-radio-button>
            <el-radio-button :label="2">已完结</el-radio-button>
          </el-radio-group>
        </div>
        <div class="filter-item">
          <span class="label">排序：</span>
          <el-radio-group v-model="filters.sort">
            <el-radio-button label="newest">最新</el-radio-button>
            <el-radio-button label="hotest">最热</el-radio-button>
            <el-radio-button label="rating">好评</el-radio-button>
          </el-radio-group>
        </div>
        <!-- 返回首页按钮 -->
        <div class="filter-item">
          <el-button type="primary" @click="goToHome">
            <el-icon><Back /></el-icon>
            返回首页
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 小说列表 -->
    <div class="book-grid">
      <el-card 
        v-for="book in bookList" 
        :key="book.id" 
        class="book-card"
        @click="goToDetail(book.id)"
      >
        <div class="book-cover">
          <img :src="book.coverUrl" :alt="book.title">
        </div>
        <div class="book-info">
          <h3 class="book-title">{{ book.title }}</h3>
          <div class="book-author">{{ book.authorName }}</div>
          <div class="book-category">
            <el-tag size="small">{{ book.categoryName }}</el-tag>
          </div>
          <div class="book-stats">
            <span>{{ formatNumber(book.viewCount) }}阅读</span>
            <span>{{ formatNumber(book.collectCount) }}收藏</span>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[12, 24, 36, 48]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getBookList } from '@/api/book'
import { ElMessage } from 'element-plus'
import { Back } from '@element-plus/icons-vue'

const router = useRouter()
const bookList = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(12)
const categories = ref([])

// 返回首页
const goToHome = () => {
  router.push('/')
}

// 筛选条件
const filters = reactive({
  category: '',
  status: '',
  sort: 'newest'
})

// 获取小说列表
const fetchBookList = async () => {
  try {
    const res = await getBookList({
      page: currentPage.value,
      pageSize: pageSize.value,
      category: filters.category,
      status: filters.status,
      sort: filters.sort
    })
    if (res.code === 200) {
      bookList.value = res.data.list
      total.value = res.data.total
    } else {
      ElMessage.error(res.message || '获取小说列表失败')
    }
  } catch (error) {
    ElMessage.error('获取小说列表失败')
  }
}

// 跳转到详情页
const goToDetail = (bookId) => {
  router.push(`/book/detail/${bookId}`)
}

// 分页处理
const handleSizeChange = (val) => {
  pageSize.value = val
  fetchBookList()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchBookList()
}

// 格式化数字
const formatNumber = (num) => {
  return num > 10000 ? (num / 10000).toFixed(1) + '万' : num
}

// 监听筛选条件变化
watch(filters, () => {
  currentPage.value = 1
  fetchBookList()
}, { deep: true })

onMounted(() => {
  fetchBookList()
})
</script>

<style scoped>
.book-list-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.filter-section {
  margin-bottom: 20px;
}

.filters {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  align-items: center;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-item:last-child {
  margin-left: auto;
}

.label {
  color: #666;
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.book-card {
  cursor: pointer;
  transition: all 0.3s;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.book-cover {
  width: 100%;
  aspect-ratio: 3/4;
  overflow: hidden;
  margin-bottom: 10px;
}

.book-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-info {
  padding: 0 10px;
}

.book-title {
  margin: 0 0 8px;
  font-size: 16px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.book-author {
  color: #666;
  font-size: 14px;
  margin-bottom: 8px;
}

.book-category {
  margin-bottom: 8px;
}

.book-stats {
  display: flex;
  justify-content: space-between;
  color: #999;
  font-size: 12px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>