<template>
  <div class="profile-container">
    <el-row :gutter="20">
      <!-- 左侧用户信息卡片 -->
      <el-col :span="6">
        <el-card class="user-card">
          <div class="user-info">
            <el-avatar 
              :size="100" 
              :src="userInfo.avatarUrl"
            />
            <h2>{{ userInfo.nickname || userInfo.username }}</h2>
            <p class="user-intro">{{ userInfo.introduction || '这个人很懒，什么都没写~' }}</p>
            <div class="user-stats">
              <div class="stat-item">
                <div class="stat-value">{{ stats.bookCount || 0 }}</div>
                <div class="stat-label">收藏书籍</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ stats.commentCount || 0 }}</div>
                <div class="stat-label">我的评论</div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧内容区 -->
      <el-col :span="18">
        <el-card v-loading="loading">
          <el-tabs v-model="activeTab">
            <!-- 基本信息 -->
            <el-tab-pane label="基本信息" name="basic">
              <div class="basic-info">
                <div class="info-header">
                  <h3>基本信息</h3>
                  <el-button 
                    type="primary" 
                    link 
                    @click="toggleEdit"
                    :disabled="loading"
                  >
                    {{ isEditing ? '取消编辑' : '编辑基本信息' }}
                  </el-button>
                </div>

                <!-- 展示模式 -->
                <div v-if="!isEditing" class="info-display">
                  <div class="info-item">
                    <span class="label">用户名：</span>
                    <span class="value">{{ userInfo.username }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">昵称：</span>
                    <span class="value">{{ userInfo.nickname }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">邮箱：</span>
                    <span class="value">{{ userInfo.email || '未设置' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">手机号：</span>
                    <span class="value">{{ userInfo.phone || '未设置' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">个人简介：</span>
                    <span class="value">{{ userInfo.introduction || '这个人很懒，什么都没写~' }}</span>
                  </div>
                </div>

                <!-- 编辑模式 -->
                <el-form 
                  v-else
                  ref="userFormRef"
                  :model="userForm"
                  :rules="formRules"
                  label-width="100px"
                  status-icon
                >
                  <el-form-item label="用户名">
                    <el-input v-model="userForm.username" disabled />
                  </el-form-item>
                  <el-form-item label="昵称" prop="nickname">
                    <el-input 
                      v-model="userForm.nickname" 
                      maxlength="20"
                      show-word-limit
                    />
                  </el-form-item>
                  <el-form-item label="邮箱" prop="email">
                    <el-input v-model="userForm.email" />
                  </el-form-item>
                  <el-form-item label="手机号" prop="phone">
                    <el-input v-model="userForm.phone" />
                  </el-form-item>
                  <el-form-item label="个人简介" prop="introduction">
                    <el-input 
                      v-model="userForm.introduction"
                      type="textarea"
                      :rows="4"
                      maxlength="200"
                      show-word-limit
                    />
                  </el-form-item>
                  <el-form-item>
                    <el-button 
                      type="primary" 
                      @click="handleUpdateInfo"
                      :loading="updating"
                    >
                      保存修改
                    </el-button>
                    <el-button @click="cancelEdit">取消</el-button>
                    <el-button @click="resetForm">重置</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </el-tab-pane>

            <!-- 修改密码 -->
            <el-tab-pane label="修改密码" name="password">
              <el-form
                ref="pwdFormRef"
                :model="pwdForm"
                :rules="pwdRules"
                label-width="100px"
                status-icon
              >
                <el-form-item label="原密码" prop="oldPassword">
                  <el-input 
                    v-model="pwdForm.oldPassword"
                    type="password"
                    show-password
                  />
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                  <el-input 
                    v-model="pwdForm.newPassword"
                    type="password"
                    show-password
                  />
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword">
                  <el-input 
                    v-model="pwdForm.confirmPassword"
                    type="password"
                    show-password
                  />
                </el-form-item>
                <el-form-item>
                  <el-button 
                    type="primary" 
                    @click="handleUpdatePassword"
                    :loading="updatingPwd"
                  >
                    修改密码
                  </el-button>
                  <el-button @click="resetPwdForm">重置</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>

            <!-- 阅读历史 -->
            <el-tab-pane label="阅读历史" name="history">
              <el-table 
                :data="readingHistory" 
                style="width: 100%"
                v-loading="loadingHistory"
              >
                <el-table-column prop="novelTitle" label="小说" />
                <el-table-column prop="chapterTitle" label="章节" />
                <el-table-column prop="readTime" label="阅读时间" />
                <el-table-column fixed="right" label="操作" width="120">
                  <template #default="scope">




                     <el-button 
          link 
          type="primary" 
          @click="continueReading(scope.row)"
        >
          继续阅读
        </el-button>
        <el-button 
          link 
          type="danger" 
          @click="handleDeleteHistory(scope.row)"
        >
          删除记录
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</el-tab-pane>




            <!-- 返回首页 -->
            <el-tab-pane name="home">
              <template #label>
                <div class="home-tab">
                  <el-icon><House /></el-icon>
                  <span>返回首页</span>
                </div>
              </template>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { House } from '@element-plus/icons-vue'
import { getUserInfo, updateUserInfo, updatePassword } from '@/api/user'
import { getReadingHistory, deleteReadingHistory } from '@/api/book'

const router = useRouter()
const activeTab = ref('basic')
const isEditing = ref(false)
const loading = ref(false)
const updating = ref(false)
const updatingPwd = ref(false)
const loadingHistory = ref(false)

// 表单引用
const userFormRef = ref(null)
const pwdFormRef = ref(null)

// 用户信息相关
const userInfo = ref({})
const userForm = ref({})
const stats = ref({
  bookCount: 0,
  commentCount: 0
})

// 密码表单
const pwdForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 阅读历史
const readingHistory = ref([])

// 表单验证规则
const formRules = {
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ]
}

// 密码表单验证规则
const pwdRules = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value === pwdForm.value.oldPassword) {
          callback(new Error('新密码不能与原密码相同'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== pwdForm.value.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 监听标签页变化
watch(activeTab, (newValue) => {
  if (newValue === 'home') {
    goToHome()
    // 防止标签保持选中状态
    activeTab.value = 'basic'
  }
})

// 获取用户信息
const fetchUserInfo = async () => {
  loading.value = true
  try {
    const res = await getUserInfo()
    if (res.code === 200) {
      userInfo.value = res.data.userInfo
      stats.value = res.data.stats
      userForm.value = { ...res.data.userInfo }
    }
  } catch (error) {
    ElMessage.error('获取用户信息失败')
  } finally {
    loading.value = false
  }
}

// 切换编辑模式
const toggleEdit = () => {
  if (!isEditing.value) {
    userForm.value = { ...userInfo.value }
  }
  isEditing.value = !isEditing.value
}

// 取消编辑
const cancelEdit = () => {
  isEditing.value = false
  userForm.value = { ...userInfo.value }
}

// 重置表单
const resetForm = () => {
  userFormRef.value?.resetFields()
  userForm.value = { ...userInfo.value }
}

// 重置密码表单
const resetPwdForm = () => {
  pwdFormRef.value?.resetFields()
}

// 更新用户信息
const handleUpdateInfo = async () => {
  if (!userFormRef.value) return
  
  try {
    await userFormRef.value.validate()
    updating.value = true
    const res = await updateUserInfo(userForm.value)
    if (res.code === 200) {
      ElMessage.success('更新成功')
      isEditing.value = false
      await fetchUserInfo()
    }
  } catch (error) {
    if (error.message) {
      ElMessage.error(error.message)
    } else {
      ElMessage.error('更新用户信息失败')
    }
  } finally {
    updating.value = false
  }
}

// 修改密码
const handleUpdatePassword = async () => {
  if (!pwdFormRef.value) return

  try {
    await pwdFormRef.value.validate()
    updatingPwd.value = true
    const res = await updatePassword(pwdForm.value)
    if (res.code === 200) {
      ElMessage.success('密码修改成功，请重新登录')
      router.push('/login')
    }
  } catch (error) {
    if (error.message) {
      ElMessage.error(error.message)
    } else {
      ElMessage.error('修改密码失败')
    }
  } finally {
    updatingPwd.value = false
  }
}

// 获取阅读历史
const fetchReadingHistory = async () => {
  loadingHistory.value = true
  try {
    const res = await getReadingHistory()
    if (res.code === 200) {
      readingHistory.value = res.data
    }
  } catch (error) {
    ElMessage.error('获取阅读历史失败')
  } finally {
    loadingHistory.value = false
  }
}




// 添加删除历史记录的方法
const handleDeleteHistory = async (record) => {
  try {
    console.log('要删除的记录：', record) // 添加调试日志
    
    await ElMessageBox.confirm('确定要删除这条阅读记录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    // 使用正确的 API 路径
    const res = await deleteReadingHistory(record.id)
    
    if (res.code === 200) {
      ElMessage.success('删除成功')
      await fetchReadingHistory() // 重新获取列表
    } else {
      ElMessage.error(res.msg || '删除失败')
    }
  } catch (error) {
    console.error('删除错误：', error) // 添加错误日志
    if (error !== 'cancel') {
      ElMessage.error('删除失败：' + (error.message || '未知错误'))
    }
  }
}





// 继续阅读
const continueReading = (record) => {
  router.push(`/chapter/detail/${record.chapterId}`)
}

// 返回首页
const goToHome = () => {
  router.push('/')
}

// 页面加载时获取数据
onMounted(() => {
  fetchUserInfo()
  fetchReadingHistory()
})
</script>

<style scoped>
.profile-container {
  padding: 20px;
}

.user-card {
  text-align: center;
}

.user-info {
  padding: 20px;
}

.user-intro {
  color: #666;
  font-size: 14px;
  margin: 10px 0;
}

.user-stats {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  padding: 10px 0;
  border-top: 1px solid #eee;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 20px;
  font-weight: bold;
  color: #409EFF;
}

.stat-label {
  font-size: 12px;
  color: #666;
  margin-top: 5px;
}

.basic-info {
  padding: 20px;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.info-header h3 {
  margin: 0;
  font-size: 18px;
}

.info-item {
  margin-bottom: 15px;
  line-height: 1.6;
}

.info-item .label {
  color: #606266;
  margin-right: 10px;
  font-weight: 500;
}

.info-item .value {
  color: #333;
}

.el-form {
  max-width: 500px;
}

.el-input {
  width: 100%;
}

.home-tab {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #409EFF;
}

:deep(.el-tabs__item:hover) {
  color: #409EFF;
}

:deep(.el-tabs__item.is-active) {
  color: #409EFF;
}

.el-icon {
  margin-right: 4px;
}
</style>