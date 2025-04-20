<template>
  <div class="likes-container">
    <el-card class="likes-card">
      <template #header>
        <div class="card-header">
          <span>我的点赞历史</span>
          <div class="header-buttons">
            <el-button @click="$router.push('/')">返回首页</el-button>
          </div>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="likeList"
        style="width: 100%">
        <el-table-column
          prop="novelTitle"
          label="小说名称"
          min-width="200">
          <template #default="scope">
            <el-link 
              type="primary" 
              @click="goToNovel(scope.row.novelId)">
              {{ scope.row.novelTitle }}
            </el-link>
          </template>
        </el-table-column>
        
        <el-table-column
          prop="authorName"
          label="作者"
          width="120">
        </el-table-column>

        <el-table-column
          prop="createTime"
          label="点赞时间"
          width="180">
          <template #default="scope">
            {{ formatDate(scope.row.createTime) }}
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          width="120"
          fixed="right">
          <template #default="scope">
            <el-button
              type="danger"
              size="small"
              @click="handleUnlike(scope.row)">
              取消点赞
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container" v-if="total > 0">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
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
import { getLikeHistory, unlikeNovel } from '@/api/user'

const router = useRouter()
const loading = ref(false)
const likeList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleString()
}

// 跳转到小说详情
const goToNovel = (novelId) => {
  router.push(`/book/detail/${novelId}`)
}

// 加载点赞历史
const loadLikeHistory = async () => {
  loading.value = true
  try {
    const res = await getLikeHistory({
      page: currentPage.value,
      size: pageSize.value
    })
    if (res.code === 200) {
      likeList.value = res.data.records
      total.value = res.data.total
    }
  } catch (error) {
    console.error('加载点赞历史失败:', error)
    ElMessage.error('加载点赞历史失败')
  } finally {
    loading.value = false
  }
}

// 取消点赞
const handleUnlike = async (row) => {
  try {
    await unlikeNovel(row.novelId)
    ElMessage.success('取消点赞成功')
    await loadLikeHistory()
  } catch (error) {
    console.error('取消点赞失败:', error)
    ElMessage.error('取消点赞失败')
  }
}

// 处理页码变化
const handleCurrentChange = (val) => {
  currentPage.value = val
  loadLikeHistory()
}

// 处理每页条数变化
const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
  loadLikeHistory()
}

onMounted(() => {
  loadLikeHistory()
})
</script>

<style scoped>
.likes-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.likes-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-buttons {
  display: flex;
  gap: 10px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>