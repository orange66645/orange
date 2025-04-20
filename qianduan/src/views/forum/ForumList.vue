<template>
  <div class="forum-container">
    <div class="forum-header">
      <h2>论坛讨论区</h2>
      <el-button type="primary" @click="showCreateDialog">发布帖子</el-button>
    </div>

    <!-- 帖子列表 -->
    <div class="post-list">
      <el-card v-for="post in posts" :key="post.id" class="post-item" @click="goToDetail(post.id)">
        <div class="post-header">
          <div class="post-info">
            <div class="post-title">{{ post.title }}</div>
            <div class="post-meta">
              <span>作者：{{ post.username }}</span>
              <span>发布时间：{{ post.createTime }}</span>
              <span>评论数：{{ post.commentCount }}</span>
              <span>浏览量：{{ post.viewCount }}</span>
              <span>点赞数：{{ post.likeCount }}</span>
            </div>
          </div>
        </div>
        <div class="post-content">{{ post.content }}</div>
      </el-card>
    </div>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 发帖对话框 -->
    <el-dialog 
      v-model="dialogVisible" 
      title="发布帖子" 
      width="50%"
      :close-on-click-modal="false"
    >
      <el-form 
        :ref="setFormRef"
        :model="postForm" 
        :rules="postRules"
        label-width="80px"
      >
        <el-form-item label="标题" prop="title">
          <el-input 
            v-model="postForm.title" 
            placeholder="请输入标题"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input
            v-model="postForm.content"
            type="textarea"
            :rows="6"
            placeholder="请输入内容"
            maxlength="2000"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleCreatePost">发布</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getForumPosts, createPost } from '@/api/forum'

const router = useRouter()

// 列表数据
const posts = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 对话框控制
const dialogVisible = ref(false)
const postForm = ref({
  title: '',
  content: ''
})

// 表单引用
let formRef = null
const setFormRef = (el) => {
  formRef = el
}

// 表单验证规则
const postRules = {
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { min: 2, max: 100, message: '标题长度在2-100个字符之间', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入内容', trigger: 'blur' },
    { min: 10, max: 2000, message: '内容长度在10-2000个字符之间', trigger: 'blur' }
  ]
}

// 获取帖子列表
const fetchPosts = async () => {
  try {
    const res = await getForumPosts({
      page: currentPage.value,
      size: pageSize.value
    })
    if (res.code === 200) {
      posts.value = res.data.records
      total.value = res.data.total
    } else {
      ElMessage.error(res.msg || '获取帖子列表失败')
    }
  } catch (error) {
    console.error('获取帖子列表失败:', error)
    ElMessage.error('获取帖子列表失败')
  }
}

// 显示发帖对话框
const showCreateDialog = () => {
  postForm.value = {
    title: '',
    content: ''
  }
  dialogVisible.value = true
  // 重置表单
  if (formRef) {
    formRef.resetFields()
  }
}

// 发布帖子
const handleCreatePost = async () => {
  if (!formRef) {
    ElMessage.warning('表单未加载完成，请稍后重试')
    return
  }
  
  try {
    await formRef.validate()
    const res = await createPost({
      title: postForm.value.title,
      content: postForm.value.content
    })
    
    if (res.code === 200) {
      ElMessage.success('发布成功')
      dialogVisible.value = false
      postForm.value = {
        title: '',
        content: ''
      }
      fetchPosts()
    } else {
      ElMessage.error(res.msg || '发布失败')
    }
  } catch (error) {
    console.error('发布帖子失败:', error)
    ElMessage.error('发布失败，请检查表单内容')
  }
}

// 跳转到帖子详情
const goToDetail = (postId) => {
  router.push({
    name: 'PostDetail',  // 确保这个名字和路由配置匹配
    params: { id: postId }
  })
}

// 处理分页大小变化
const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
  fetchPosts()
}

// 处理页码变化
const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchPosts()
}

// 页面加载时获取数据
onMounted(() => {
  fetchPosts()
})
</script>

<style scoped>
.forum-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.forum-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.post-item {
  cursor: pointer;
  transition: all 0.3s;
}

.post-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.post-header {
  display: flex;
  gap: 12px;
  margin-bottom: 10px;
}

.post-info {
  flex: 1;
}

.post-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #303133;
}

.post-meta {
  font-size: 13px;
  color: #909399;
  display: flex;
  gap: 15px;
}

.post-content {
  color: #606266;
  font-size: 14px;
  line-height: 1.6;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-top: 10px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

:deep(.el-dialog__body) {
  padding: 20px 40px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>