<template>
  <div class="forum-manage">
    <el-card>
      <!-- 搜索栏 -->
      <el-form :inline="true" :model="queryParams" class="search-form">
        <el-form-item label="发帖人">
          <el-input v-model="queryParams.username" placeholder="请输入发帖人用户名" />
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="queryParams.title" placeholder="请输入帖子标题" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 数据表格 -->
      <el-table v-loading="loading" :data="forumList">
        <el-table-column label="ID" prop="id" width="80" />
        <el-table-column label="标题" prop="title" show-overflow-tooltip />
        <el-table-column label="发帖人" prop="username" width="120" />
        <el-table-column label="昵称" prop="nickname" width="120" />
        <el-table-column label="浏览量" prop="viewCount" width="100" />
        <el-table-column label="点赞数" prop="likeCount" width="100" />
        <el-table-column label="评论数" prop="commentCount" width="100" />
        <el-table-column label="发布时间" prop="createTime" width="180" />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="queryParams.pageNum"
        v-model:page-size="queryParams.pageSize"
        :total="total"
        :page-sizes="[10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getForumList, deleteForum } from '@/api/admin/forum'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const forumList = ref([])
const total = ref(0)

const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  username: '',
  title: ''
})

// 获取论坛列表
const getList = async () => {
  loading.value = true
  try {
    const res = await getForumList(queryParams.value)
    if (res.code === 200) {
      forumList.value = res.data.list
      total.value = res.data.total
    }
  } catch (error) {
    console.error('获取论坛列表失败:', error)
    ElMessage.error('获取论坛列表失败')
  } finally {
    loading.value = false
  }
}

// 删除帖子
const handleDelete = (row) => {
  ElMessageBox.confirm('确认要删除该帖子吗？', '提示', {
    type: 'warning'
  }).then(async () => {
    try {
      const res = await deleteForum(row.id)
      if (res.code === 200) {
        ElMessage.success('删除成功')
        getList()
      }
    } catch (error) {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  })
}

// 查询
const handleQuery = () => {
  queryParams.value.pageNum = 1
  getList()
}

// 重置
const resetQuery = () => {
  queryParams.value = {
    pageNum: 1,
    pageSize: 10,
    username: '',
    title: ''
  }
  getList()
}

// 分页
const handleSizeChange = (val) => {
  queryParams.value.pageSize = val
  getList()
}

const handleCurrentChange = (val) => {
  queryParams.value.pageNum = val
  getList()
}

onMounted(() => {
  getList()
})
</script>

<style scoped>
.forum-manage {
  padding: 20px;
}
.search-form {
  margin-bottom: 20px;
}
</style>