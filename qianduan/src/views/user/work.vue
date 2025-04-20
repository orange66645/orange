<template>
  <div class="works-container">
    <el-card class="works-card">
      <template #header>
        <div class="card-header">
          <span>我的作品</span>
          <el-button type="primary" @click="$router.push('/novel/publish')">
            发布新作品
          </el-button>
                      <el-button @click="$router.push('/')">返回首页</el-button>  <!-- 添加这一行 -->
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="publishedBooks"
        style="width: 100%"
      >
        <el-table-column prop="coverUrl" label="封面" width="120">
          <template #default="{ row }">
            <el-image
              :src="row.coverUrl"
              :preview-src-list="[row.coverUrl]"
              fit="cover"
              style="width: 80px; height: 120px"
            />
          </template>
        </el-table-column>

        <el-table-column prop="title" label="书名" min-width="180">
          <template #default="{ row }">
            <div class="book-info">
              <h4>{{ row.title }}</h4>
              <p class="info">
                <span class="author">作者：{{ row.authorName }}</span>
                <span class="category">分类：{{ row.categoryName }}</span>
              </p>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="wordCount" label="字数" width="100">
          <template #default="{ row }">
            {{ formatWordCount(row.wordCount) }}
          </template>
        </el-table-column>

        <el-table-column prop="viewCount" label="阅读量" width="100">
          <template #default="{ row }">
            {{ formatNumber(row.viewCount) }}
          </template>
        </el-table-column>

        <el-table-column prop="collectCount" label="收藏量" width="100">
          <template #default="{ row }">
            {{ formatNumber(row.collectCount) }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
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
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getMyPublishedBooks } from '@/api/book'

const router = useRouter()
const loading = ref(false)
const publishedBooks = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const fetchPublishedBooks = async () => {
  loading.value = true
  try {
    const res = await getMyPublishedBooks({
      pageNum: currentPage.value,
      pageSize: pageSize.value
    })
    if (res.code === 200) {
      publishedBooks.value = res.data.records || []
      total.value = res.data.total || 0
    } else {
      ElMessage.error(res.message || '获取作品列表失败')
    }
  } catch (error) {
    console.error('获取作品列表失败:', error)
    ElMessage.error('获取作品列表失败')
  } finally {
    loading.value = false
  }
}

const formatWordCount = (count) => {
  if (!count) return '0字'
  return count >= 10000 ? (count / 10000).toFixed(1) + '万字' : count + '字'
}

const formatNumber = (num) => {
  if (!num) return '0'
  return num >= 10000 ? (num / 10000).toFixed(1) + '万' : num
}

const handleEdit = (row) => {
  router.push(`/novel/publish?id=${row.id}`)
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchPublishedBooks()
}

const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
  fetchPublishedBooks()
}

onMounted(() => {
  fetchPublishedBooks()
})
</script>

<style scoped>
.works-container {
  padding: 20px;
}

.works-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.book-info {
  h4 {
    margin: 0 0 8px;
    font-size: 16px;
  }

  .info {
    margin: 0;
    font-size: 14px;
    color: #606266;
  }

  .author {
    margin-right: 15px;
  }

  .category {
    color: #909399;
  }
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>