<template>
  <div class="book-detail-container">
    <!-- 小说基本信息 -->
    <el-card class="info-section">
      <div class="book-info">
        <div class="book-cover">
          <img :src="bookInfo.coverUrl" :alt="bookInfo.title">
        </div>
        <div class="book-meta">
          <h1 class="book-title">{{ bookInfo.title }}</h1>
          <div class="meta-item">
            <span class="label">作者：</span>
            <span class="value">{{ bookInfo.authorName }}</span>
          </div>
          <div class="meta-item">
            <span class="label">分类：</span>
            <span class="value">{{ bookInfo.categoryName }}</span>
          </div>
          <div class="meta-item">
            <span class="label">状态：</span>
            <el-tag :type="bookInfo.status === 1 ? 'warning' : 'success'">
              {{ bookInfo.status === 1 ? '连载中' : '已完结' }}
            </el-tag>
          </div>
          <div class="meta-item">
            <span class="label">字数：</span>
            <span class="value">{{ formatWordCount(bookInfo.wordCount) }}</span>
          </div>
          <div class="stats">
            <div class="stat-item">
              <el-icon><View /></el-icon>
              <span>{{ formatNumber(bookInfo.viewCount) }}</span>
            </div>
            <div class="stat-item">
              <el-icon><Star /></el-icon>
              <span>{{ formatNumber(bookInfo.collectCount) }}</span>
            </div>
            <div 
              class="stat-item" 
              @click="handleLike"
              :class="{ 'is-liked': isLiked }"
            >
              <el-icon><Pointer /></el-icon>
              <span>{{ formatNumber(bookInfo.likeCount) }}</span>
            </div>
          </div>
          <div class="actions">
            <el-button type="primary" @click="startReading">开始阅读</el-button>
            <el-button 
              :type="isCollected ? 'success' : 'default'"
              @click="handleCollect"
            >
              {{ isCollected ? '已收藏' : '加入书架' }}
            </el-button>
            <!-- 添加返回首页按钮 -->
            <el-button type="info" @click="goToHome">
              <el-icon><Back /></el-icon>
              返回首页
            </el-button>
          </div>
        </div>
      </div>
      <div class="book-intro">
        <h3>作品简介</h3>
        <p>{{ bookInfo.description }}</p>
      </div>
    </el-card>

    <!-- 章节列表 -->
    <el-card class="chapter-section">
      <template #header>
        <div class="chapter-header">
          <span>章节列表</span>
          <div class="chapter-filter">
            <el-radio-group v-model="chapterSort" @change="handleSortChange">
              <el-radio-button label="asc">正序</el-radio-button>
              <el-radio-button label="desc">倒序</el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </template>
      
      <el-table :data="chapterList" style="width: 100%">
        <el-table-column prop="title" label="章节标题">
          <template #default="scope">
            <router-link 
              :to="`/chapter/detail/${scope.row.id}`" 
              class="chapter-link"
            >
              {{ scope.row.title }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="wordCount" label="字数" width="120">
          <template #default="scope">
            {{ formatWordCount(scope.row.wordCount) }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="更新时间" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.createTime) }}
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[20, 50, 100, 200]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { View, Star, Pointer, Back } from '@element-plus/icons-vue'
import { 
  getBookDetail, 
  getChapterList, 
  collectBook, 
  checkCollect, 
  checkLike, 
  toggleLike,
  addReadingHistory 
} from '@/api/book'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const bookId = route.params.id

// ref 定义
const bookInfo = ref({})
const chapterList = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(20)
const chapterSort = ref('asc')
const isCollected = ref(false)
const isLiked = ref(false)

// 返回首页
const goToHome = () => {
  router.push('/')
}

// 格式化数字
const formatNumber = (num) => {
  return num > 10000 ? (num / 10000).toFixed(1) + '万' : num
}

// 格式化字数
const formatWordCount = (count) => {
  return count > 10000 ? (count / 10000).toFixed(1) + '万字' : count + '字'
}

// 格式化日期
const formatDate = (date) => {
  return new Date(date).toLocaleString()
}

// 获取小说详情
const fetchBookDetail = async () => {
  try {
    const res = await getBookDetail(bookId)
    if (res.code === 200) {
      bookInfo.value = res.data
    } else {
      ElMessage.error(res.message || '获取小说详情失败')
    }
  } catch (error) {
    ElMessage.error('获取小说详情失败')
  }
}

// 获取章节列表
const fetchChapterList = async () => {
  try {
    const res = await getChapterList({
      novelId: bookId,
      page: currentPage.value,
      pageSize: pageSize.value,
      sort: chapterSort.value
    })
    if (res.code === 200) {
      chapterList.value = res.data.list
      total.value = res.data.total
    } else {
      ElMessage.error(res.message || '获取章节列表失败')
    }
  } catch (error) {
    ElMessage.error('获取章节列表失败')
  }
}

// 开始阅读
const startReading = async () => {
  if (chapterList.value.length > 0) {
    const firstChapter = chapterList.value[0]
    try {
      await addReadingHistory({
        novelId: bookId,
        chapterId: firstChapter.id
      })
      router.push(`/chapter/detail/${firstChapter.id}`)
    } catch (error) {
      console.error('添加阅读历史失败:', error)
      ElMessage.error('添加阅读历史失败')
      router.push(`/chapter/detail/${firstChapter.id}`)
    }
  } else {
    ElMessage.warning('暂无章节')
  }
}

// 检查是否已收藏
const checkIsCollected = async () => {
  try {
    const res = await checkCollect(bookId)
    if (res.code === 200) {
      isCollected.value = res.data
    }
  } catch (error) {
    console.error('检查收藏状态失败：', error)
  }
}

// 处理收藏/取消收藏
const handleCollect = async () => {
  try {
    const res = await collectBook(bookId)
    if (res.code === 200) {
      isCollected.value = !isCollected.value
      ElMessage.success(isCollected.value ? '收藏成功' : '已取消收藏')
      fetchBookDetail()
    } else {
      ElMessage.error(res.message || '操作失败')
    }
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// 分页处理
const handleSizeChange = (val) => {
  pageSize.value = val
  fetchChapterList()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchChapterList()
}

const handleSortChange = () => {
  currentPage.value = 1
  fetchChapterList()
}

// 检查是否已点赞
const checkIsLiked = async () => {
  try {
    const res = await checkLike(bookId)
    if (res.code === 200) {
      isLiked.value = res.data
    }
  } catch (error) {
    console.error('检查点赞状态失败：', error)
  }
}

// 处理点赞/取消点赞
const handleLike = async () => {
  try {
    const res = await toggleLike(bookId)
    if (res.code === 200) {
      isLiked.value = !isLiked.value
      ElMessage.success(isLiked.value ? '点赞成功' : '已取消点赞')
      fetchBookDetail()
    } else {
      ElMessage.error(res.message || '操作失败')
    }
  } catch (error) {
    console.error('点赞操作失败：', error)
    ElMessage.error('操作失败')
  }
}

onMounted(() => {
  fetchBookDetail()
  fetchChapterList()
  checkIsCollected()
  checkIsLiked()
})
</script>

<style scoped>
.book-detail-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.info-section {
  margin-bottom: 20px;
}

.book-info {
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
}

.book-cover {
  width: 200px;
  height: 280px;
  overflow: hidden;
}

.book-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-meta {
  flex: 1;
}

.book-title {
  margin: 0 0 20px;
  font-size: 24px;
}

.meta-item {
  margin-bottom: 15px;
}

.label {
  color: #666;
  margin-right: 10px;
}

.stats {
  display: flex;
  gap: 30px;
  margin: 20px 0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.stat-item:hover {
  color: #409EFF;
}

.stat-item.is-liked {
  color: #409EFF;
}

.stat-item.is-liked .el-icon {
  transform: scale(1.1);
}

.actions {
  margin-top: 30px;
  display: flex;
  gap: 10px;
}

.book-intro {
  h3 {
    margin: 0 0 15px;
    font-size: 18px;
  }
  
  p {
    color: #666;
    line-height: 1.6;
  }
}

.chapter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chapter-link {
  color: #333;
  text-decoration: none;
  
  &:hover {
    color: #409EFF;
  }
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

@keyframes like-animation {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.stat-item.is-liked .el-icon {
  animation: like-animation 0.3s ease-in-out;
}
</style>