<template>
  <div class="post-detail-container">
    <!-- 帖子内容 -->
    <el-card class="post-card">
      <template #header>
        <div class="post-header">
          <h2 class="post-title">{{ post.title }}</h2>
          <div class="post-meta">
            <span>作者：{{ post.username }}</span>
            <span>发布时间：{{ post.createTime }}</span>
            <span>浏览量：{{ post.viewCount }}</span>
            <span>点赞数：{{ post.likeCount }}</span>
          </div>
        </div>
      </template>
      <div class="post-content">{{ post.content }}</div>
    </el-card>

    <!-- 回复列表 -->
    <div class="reply-section">
      <div class="reply-header">
        <h3>全部回复 ({{ post.commentCount || 0 }})</h3>
        <el-button type="primary" @click="openReplyDialog">发表回复</el-button>
      </div>

      <div class="reply-list">
        <el-empty v-if="!replies.length" description="暂无回复" />
        <el-card v-for="reply in replies" :key="reply.id" class="reply-item">
          <div class="reply-user">
            <span class="username">{{ reply.username }}</span>
            <span class="time">{{ reply.createTime }}</span>
          </div>
          <div v-if="reply.parentId" class="quote-box">
            <div class="quote-user">引用 {{ reply.parentUserName }} 的回复：</div>
            <div class="quote-content">{{ reply.parentContent }}</div>
          </div>
          <div class="reply-content">{{ reply.content }}</div>
          <div class="reply-actions">
            <el-button type="text" @click="handleQuoteReply(reply)">引用回复</el-button>
          </div>
        </el-card>
      </div>

      <!-- 分页 -->
      <div class="pagination" v-if="total > 0">
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
    </div>

    <!-- 回复对话框 -->
    <el-dialog 
      v-model="dialogVisible" 
      :title="quotedReply ? '引用回复' : '发表回复'"
      width="50%"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <el-form 
        ref="replyFormRef"
        :model="replyForm"
        :rules="rules"
        label-width="0"
      >
        <el-form-item v-if="quotedReply" class="quoted-content">
          <div class="quote-box">
            <div class="quote-user">引用 {{ quotedReply.username }} 的回复：</div>
            <div class="quote-content">{{ quotedReply.content }}</div>
          </div>
        </el-form-item>
        <el-form-item prop="content">
          <el-input
            v-model="replyForm.content"
            type="textarea"
            :rows="4"
            placeholder="请输入回复内容"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleReply">发表</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getPostDetail, replyPost } from '@/api/forum'

const route = useRoute()
const postId = route.params.id

// 帖子数据
const post = ref({})
const replies = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 回复表单相关
const dialogVisible = ref(false)
const replyFormRef = ref(null)
const replyForm = ref({
  content: '',
  parentId: null
})
const quotedReply = ref(null)

// 表单验证规则
const rules = {
  content: [
    { required: true, message: '请输入回复内容', trigger: 'blur' },
    { min: 2, max: 500, message: '回复内容长度在2-500个字符之间', trigger: 'blur' }
  ]
}

// 获取帖子详情
const fetchPostDetail = async () => {
  try {
    const res = await getPostDetail(postId)
    if (res.code === 200) {
      post.value = res.data
      replies.value = res.data.replies || []
      total.value = res.data.replies?.length || 0
      updatePagedReplies()
    }
  } catch (error) {
    console.error('获取数据失败:', error)
    ElMessage.error('获取数据失败')
  }
}

// 更新分页后的回复列表
const updatePagedReplies = () => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  replies.value = (post.value.replies || []).slice(start, end)
}

// 打开回复对话框
const openReplyDialog = () => {
  dialogVisible.value = true
  replyForm.value = {
    content: '',
    parentId: null
  }
  quotedReply.value = null
}

// 引用回复
const handleQuoteReply = (reply) => {
  quotedReply.value = reply
  replyForm.value = {
    content: '',
    parentId: reply.id
  }
  dialogVisible.value = true
}

// 对话框关闭前的处理
const handleClose = (done) => {
  replyFormRef.value?.resetFields()
  quotedReply.value = null
  done()
}

// 提交回复
const handleReply = async () => {
  if (!replyFormRef.value) return
  
  try {
    await replyFormRef.value.validate()
    
    const res = await replyPost({
      postId: Number(postId),
      content: replyForm.value.content,
      parentId: replyForm.value.parentId
    })

    if (res.code === 200) {
      ElMessage.success('回复成功')
      dialogVisible.value = false
      replyForm.value = {
        content: '',
        parentId: null
      }
      quotedReply.value = null
      // 刷新帖子详情
      fetchPostDetail()
    } else {
      ElMessage.error(res.msg || '回复失败')
    }
  } catch (error) {
    console.error('回复失败:', error)
    ElMessage.error('回复失败，请检查内容')
  }
}

// 处理分页大小变化
const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
  updatePagedReplies()
}

// 处理页码变化
const handleCurrentChange = (val) => {
  currentPage.value = val
  updatePagedReplies()
}

onMounted(() => {
  fetchPostDetail()
})
</script>

<style scoped>
.post-detail-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.post-card {
  margin-bottom: 20px;
}

.post-header {
  padding: 10px 0;
}

.post-title {
  font-size: 24px;
  margin-bottom: 10px;
  color: #303133;
}

.post-meta {
  font-size: 14px;
  color: #909399;
  display: flex;
  gap: 20px;
}

.post-content {
  font-size: 16px;
  line-height: 1.8;
  color: #606266;
  padding: 20px 0;
  white-space: pre-wrap;
}

.reply-section {
  margin-top: 30px;
}

.reply-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.reply-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.reply-item {
  margin-bottom: 15px;
}

.reply-user {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.username {
  font-weight: bold;
  color: #303133;
}

.time {
  color: #909399;
  font-size: 13px;
}

.reply-content {
  color: #606266;
  line-height: 1.6;
  white-space: pre-wrap;
}

.reply-actions {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}

.quote-box {
  background: #f5f7fa;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
}

.quote-user {
  color: #909399;
  font-size: 13px;
  margin-bottom: 5px;
}

.quote-content {
  color: #606266;
  font-size: 14px;
  white-space: pre-wrap;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>