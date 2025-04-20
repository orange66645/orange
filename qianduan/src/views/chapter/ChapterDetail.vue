<template>
  <div class="chapter-container">
    <!-- 章节导航 -->
    <div class="chapter-nav">
      <el-button @click="prevChapter" :disabled="!prevChapterId">上一章</el-button>
      <el-button @click="backToBook">返回书籍</el-button>
      <el-button @click="nextChapter" :disabled="!nextChapterId">下一章</el-button>
    </div>

    <!-- 章节内容 -->
    <div class="chapter-content">
      <h1 class="chapter-title">{{ chapterInfo.title }}</h1>
      <div class="chapter-stats">
        <span>字数：{{ formatWordCount(chapterInfo.wordCount) }}</span>
        <span>更新：{{ formatDate(chapterInfo.updateTime) }}</span>
      </div>
      <div class="content-text" v-html="chapterInfo.content"></div>
    </div>

    <!-- 底部导航 -->
    <div class="chapter-nav bottom">
      <el-button @click="prevChapter" :disabled="!prevChapterId">上一章</el-button>
      <el-button @click="backToBook">返回书籍</el-button>
      <el-button @click="nextChapter" :disabled="!nextChapterId">下一章</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getChapterDetail, updateChapterView } from '@/api/book'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const chapterInfo = ref({})
const prevChapterId = ref(null)
const nextChapterId = ref(null)

// 获取章节详情
const fetchChapterDetail = async (id) => {
  try {
    const res = await getChapterDetail(id)
    if (res.code === 200) {
      chapterInfo.value = res.data
      prevChapterId.value = res.data.prevId
      nextChapterId.value = res.data.nextId
      // 更新阅读量
      updateChapterView(id)
    } else {
      ElMessage.error(res.message || '获取章节详情失败')
    }
  } catch (error) {
    ElMessage.error('获取章节详情失败')
  }
}

// 上一章
const prevChapter = () => {
  if (prevChapterId.value) {
    router.push(`/chapter/detail/${prevChapterId.value}`)
  }
}

// 下一章
const nextChapter = () => {
  if (nextChapterId.value) {
    router.push(`/chapter/detail/${nextChapterId.value}`)
  }
}

// 返回书籍详情页
const backToBook = () => {
  router.push(`/book/detail/${chapterInfo.value.novelId}`)
}

// 格式化字数
const formatWordCount = (count) => {
  if (!count) return '0字'
  return count > 10000 ? (count / 10000).toFixed(1) + '万字' : count + '字'
}

// 格式化日期
const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleString()
}

// 监听路由参数变化，重新获取章节内容
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      fetchChapterDetail(newId)
    }
  }
)

onMounted(() => {
  const chapterId = route.params.id
  if (chapterId) {
    fetchChapterDetail(chapterId)
  }
})
</script>

<style scoped>
.chapter-container {
  max-width: 900px;
  margin: 20px auto;
  padding: 0 20px;
}

.chapter-nav {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 20px 0;
}

.chapter-content {
  background: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.chapter-title {
  text-align: center;
  margin: 0 0 20px;
  font-size: 24px;
}

.chapter-stats {
  text-align: center;
  color: #666;
  margin-bottom: 30px;
}

.chapter-stats span {
  margin: 0 10px;
}

.content-text {
  line-height: 1.8;
  font-size: 16px;
  color: #333;
  text-indent: 2em;
}

.bottom {
  margin-top: 40px;
}
</style>