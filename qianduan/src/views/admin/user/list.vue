<template>
  <div class="user-manage">
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" ref="searchFormRef">
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="searchForm.username"
            placeholder="请输入用户名"
            clearable
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="正常" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>搜索
          </el-button>
          <el-button @click="resetSearch">
            <el-icon><Refresh /></el-icon>重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格区域 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>用户列表</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>新增用户
          </el-button>
        </div>
      </template>

      <el-table v-loading="loading" :data="userList" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="nickname" label="昵称" width="120" />
        <el-table-column prop="email" label="邮箱" width="180" />
        <el-table-column prop="phone" label="手机号" width="120" />
        <el-table-column prop="roleType" label="角色" width="100">
          <template #default="{ row }">
            <el-tag :type="row.roleType === 2 ? 'danger' : 'success'">
              {{ row.roleType === 2 ? '管理员' : '普通用户' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="registerTime" label="注册时间" width="180">
          <template #default="{ row }">
            {{ formatDateTime(row.registerTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="250">
          <template #default="{ row }">
            <el-button
              type="primary"
              link
              @click="handleEdit(row)"
              :disabled="row.roleType === 2"
            >
              编辑
            </el-button>
            <el-button
              type="primary"
              link
              @click="handleResetPassword(row)"
              :disabled="row.roleType === 2"
            >
              重置密码
            </el-button>
          
            <el-button
              type="danger"
              link
              @click="handleDelete(row)"
              :disabled="row.roleType === 2"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 编辑/新增用户对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'edit' ? '编辑用户' : '新增用户'"
      width="500px"
    >
      <el-form
        ref="dialogFormRef"
        :model="dialogForm"
        :rules="dialogRules"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input 
            v-model="dialogForm.username" 
            :disabled="dialogType === 'edit'"
            placeholder="请输入用户名" 
          />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input 
            v-model="dialogForm.nickname" 
            placeholder="请输入昵称"
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input 
            v-model="dialogForm.email" 
            placeholder="请输入邮箱"
          />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input 
            v-model="dialogForm.phone" 
            placeholder="请输入手机号"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="dialogForm.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="dialogType === 'add'" label="密码" prop="password">
          <el-input 
            v-model="dialogForm.password" 
            type="password"
            placeholder="请输入密码" 
            show-password
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleDialogConfirm">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus, Refresh } from '@element-plus/icons-vue'
import { getUserList, updateUserStatus, deleteUser, addUser, updateUser } from '@/api/admin/user'
import { formatDateTime } from '@/utils/format'

// 搜索表单
const searchForm = ref({
  username: '',
  status: ''
})
const searchFormRef = ref(null)

// 表格数据
const loading = ref(false)
const userList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 对话框相关
const dialogVisible = ref(false)
const dialogType = ref('edit') // edit or add
const dialogFormRef = ref(null)
const dialogForm = ref({
  id: '',
  username: '',
  nickname: '',
  email: '',
  phone: '',
  status: 1,
  password: ''
})

// 表单验证规则
const dialogRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

// 获取用户列表
const loadUserList = async () => {
  loading.value = true
  try {
    const params = {
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      username: searchForm.value.username,
      status: searchForm.value.status
    }
    const res = await getUserList(params)
    if (res.code === 200) {
      userList.value = res.data.records
      total.value = res.data.total
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  loadUserList()
}

// 重置搜索
const resetSearch = () => {
  searchFormRef.value?.resetFields()
  handleSearch()
}

// 分页处理
const handleSizeChange = (val) => {
  pageSize.value = val
  loadUserList()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  loadUserList()
}

// 状态变更
const handleStatusChange = async (row) => {
  try {
    const confirmText = row.status === 1 ? '禁用' : '启用'
    await ElMessageBox.confirm(
      `确认要${confirmText}该用户吗？`,
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const res = await updateUserStatus(row.id, row.status === 1 ? 0 : 1)
    if (res.code === 200) {
      ElMessage.success(`${confirmText}成功`)
      loadUserList()
    }
  } catch (error) {
    console.error('更新用户状态失败:', error)
  }
}

// 重置密码
const handleResetPassword = async (row) => {
  try {
    await ElMessageBox.confirm(
      '确认要重置该用户的密码吗？',
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // TODO: 调用重置密码API
    ElMessage.success('密码重置成功')
  } catch (error) {
    console.error('重置密码失败:', error)
  }
}

// 编辑用户
const handleEdit = (row) => {
  dialogType.value = 'edit'
  dialogForm.value = { ...row }
  dialogVisible.value = true
}

// 新增用户
const handleAdd = () => {
  dialogType.value = 'add'
  dialogForm.value = {
    username: '',
    nickname: '',
    email: '',
    phone: '',
    status: 1,
    password: ''
  }
  dialogVisible.value = true
}

// 删除用户
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      '确认要删除该用户吗？此操作不可恢复！',
      '警告',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const res = await deleteUser(row.id)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      loadUserList()
    }
  } catch (error) {
    console.error('删除用户失败:', error)
  }
}

// 对话框确认
const handleDialogConfirm = async () => {
  if (!dialogFormRef.value) return
  
  await dialogFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const api = dialogType.value === 'add' ? addUser : updateUser
        const res = await api(dialogForm.value)
        if (res.code === 200) {
          ElMessage.success(dialogType.value === 'add' ? '添加成功' : '更新成功')
          dialogVisible.value = false
          loadUserList()
        }
      } catch (error) {
        console.error(dialogType.value === 'add' ? '添加用户失败:' : '更新用户失败:', error)
      }
    }
  })
}

onMounted(() => {
  loadUserList()
})
</script>

<style lang="scss" scoped>
.user-manage {
  .search-card {
    margin-bottom: 20px;
  }

  .table-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>