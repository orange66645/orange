<template>
  <div class="novel-manage">
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" ref="searchFormRef">
        <el-form-item label="书名" prop="title">
          <el-input
            v-model="searchForm.title"
            placeholder="请输入书名"
            clearable
          />
        </el-form-item>
        <el-form-item label="作者" prop="authorName">
          <el-input
            v-model="searchForm.authorName"
            placeholder="请输入作者名"
            clearable
          />
        </el-form-item>
        <el-form-item label="分类" prop="categoryId">
          <el-select v-model="searchForm.categoryId" placeholder="请选择分类" clearable>
            <el-option
              v-for="item in categoryList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="连载中" :value="1" />
            <el-option label="已完结" :value="2" />
            <el-option label="审核中" :value="0" />
            <el-option label="已下架" :value="-1" />
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
          <span>小说列表</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>新增小说
          </el-button>
        </div>
      </template>

      <el-table v-loading="loading" :data="novelList" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="书名" width="200" />
        <el-table-column label="封面" width="100">
          <template #default="{ row }">
            <el-image
              v-if="row.coverUrl"
              :src="row.coverUrl"
              :preview-src-list="[row.coverUrl]"
              fit="cover"
              style="width: 60px; height: 80px"
            />
            <span v-else>暂无封面</span>
          </template>
        </el-table-column>
        <el-table-column prop="authorName" label="作者" width="120" />
        <el-table-column prop="categoryName" label="分类" width="100" />
        <el-table-column label="数据统计" width="300">
          <template #default="{ row }">
            <div class="stats">
              <span>字数：{{ formatWordCount(row.wordCount) }}</span>
              <span>阅读：{{ formatNumber(row.viewCount) }}</span>
              <span>收藏：{{ formatNumber(row.collectCount) }}</span>
              <span>评论：{{ formatNumber(row.commentCount) }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDateTime(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-button type="primary" @click="handleEdit(row)" link>
                <el-icon><Edit /></el-icon>编辑
              </el-button>
              <el-button 
                type="primary" 
                @click="handleChapterManage(row)" 
                link
              >
                <el-icon><List /></el-icon>章节
              </el-button>
              <el-button 
                type="primary" 
                @click="handleCommentManage(row)" 
                link
              >
                <el-icon><ChatDotRound /></el-icon>评论
              </el-button>
              <el-button 
                type="danger" 
                @click="handleDelete(row.id)" 
                link
              >
                <el-icon><Delete /></el-icon>删除
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="formRef?.resetFields()"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="书名" prop="title">
          <el-input v-model="formData.title" placeholder="请输入书名" />
        </el-form-item>
        
        <el-form-item label="作者" prop="authorId">
          <el-select v-model="formData.authorId" placeholder="请选择作者">
            <el-option
              v-for="item in userList"
              :key="item.id"
              :label="item.nickname"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="分类" prop="categoryId">
          <el-select v-model="formData.categoryId" placeholder="请选择分类">
            <el-option
              v-for="item in categoryList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="封面" prop="coverUrl">
          <el-upload
            class="cover-uploader"
            :action="uploadUrl"
            :headers="uploadHeaders"
            :show-file-list="false"
            :on-success="handleCoverSuccess"
            :before-upload="beforeCoverUpload"
          >
            <img v-if="formData.coverUrl" :src="formData.coverUrl" class="cover" />
            <el-icon v-else class="cover-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>

        <el-form-item label="简介" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="4"
            placeholder="请输入简介"
          />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="formData.status" placeholder="请选择状态">
            <el-option label="连载中" :value="1" />
            <el-option label="已完结" :value="2" />
            <el-option label="审核中" :value="0" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  getNovelList, 
  addNovel, 
  updateNovel, 
  deleteNovel, 
  updateNovelStatus 
} from '@/api/admin/novel'
import { getCategoryList } from '@/api/admin/category'
import { getUserList } from '@/api/admin/user'
import { formatDateTime, formatNumber, formatWordCount } from '@/utils/format'

const router = useRouter()

// 搜索表单
const searchForm = ref({
  title: '',
  authorName: '',
  categoryId: '',
  status: ''
})

// 表格数据
const loading = ref(false)
const novelList = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// 分类列表
const categoryList = ref([])
// 用户列表
const userList = ref([])

// 对话框控制
const dialogVisible = ref(false)
const dialogType = ref('add')
const dialogTitle = computed(() => dialogType.value === 'add' ? '新增小说' : '编辑小说')

// 表单数据
const formRef = ref(null)
const formData = ref({
  title: '',
  authorId: '',
  categoryId: '',
  coverUrl: '',
  description: '',
  status: 1
})

// 表单验证规则
const rules = {
  title: [{ required: true, message: '请输入小说名称', trigger: 'blur' }],
  authorId: [{ required: true, message: '请选择作者', trigger: 'change' }],
  categoryId: [{ required: true, message: '请选择分类', trigger: 'change' }],
  description: [{ required: true, message: '请输入简介', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

// 上传相关
const uploadUrl = import.meta.env.VITE_API_URL + '/upload'
const uploadHeaders = {
  // 如果需要token等header
}

// 加载小说列表
const loadNovelList = async () => {
  try {
    loading.value = true
    const res = await getNovelList({
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      ...searchForm.value
    })
    if (res.code === 200) {
      novelList.value = res.data.list
      total.value = res.data.total
    }
  } catch (error) {
    console.error('获取小说列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 加载分类列表
const loadCategoryList = async () => {
  try {
    const res = await getCategoryList()
    if (res.code === 200) {
      categoryList.value = res.data
    }
  } catch (error) {
    console.error('获取分类列表失败:', error)
  }
}

// 加载用户列表
const loadUserList = async () => {
  try {
    const res = await getUserList({
      pageNum: 1,
      pageSize: 1000 // 获取足够多的用户
    })
    if (res.code === 200) {
      userList.value = res.data.records
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  loadNovelList()
}

// 重置搜索
const resetSearch = () => {
  searchForm.value = {
    title: '',
    authorName: '',
    categoryId: '',
    status: ''
  }
  handleSearch()
}

// 获取状态类型
const getStatusType = (status) => {
  switch (status) {
    case 1: return 'success'
    case 2: return 'warning'
    case 0: return 'info'
    case -1: return 'danger'
    default: return 'info'
  }
}

// 获取状态文本
const getStatusText = (status) => {
  switch (status) {
    case 1: return '连载中'
    case 2: return '已完结'
    case 0: return '审核中'
    case -1: return '已下架'
    default: return '未知'
  }
}

// 新增小说
const handleAdd = () => {
  dialogType.value = 'add'
  formData.value = {
    title: '',
    authorId: '',
    categoryId: '',
    coverUrl: '',
    description: '',
    status: 1
  }
  dialogVisible.value = true
}

// 编辑小说
const handleEdit = (row) => {
  dialogType.value = 'edit'
  formData.value = { ...row }
  dialogVisible.value = true
}

// 删除小说
const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这本小说吗？', '提示', {
      type: 'warning'
    })
    const res = await deleteNovel(id)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      loadNovelList()
    }
  } catch (error) {
    console.error('删除失败:', error)
  }
}

// 章节管理
const handleChapterManage = (row) => {
  router.push(`/admin/novel/chapter/${row.id}`)
}

// 评论管理
const handleCommentManage = (row) => {
  router.push(`/admin/novel/comment/${row.id}`)
}

// 更新状态
const handleStatusChange = async (row) => {
  try {
    const res = await updateNovelStatus(row.id, row.status)
    if (res.code === 200) {
      ElMessage.success('状态更新成功')
      loadNovelList()
    }
  } catch (error) {
    console.error('状态更新失败:', error)
  }
}

// 封面上传成功
const handleCoverSuccess = (res) => {
  if (res.code === 200) {
    formData.value.coverUrl = res.data
  }
}

// 封面上传前验证
const beforeCoverUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('封面必须是图片格式!')
  }
  if (!isLt2M) {
    ElMessage.error('封面大小不能超过 2MB!')
  }

  return isImage && isLt2M
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const api = dialogType.value === 'add' ? addNovel : updateNovel
        const res = await api(formData.value)
        if (res.code === 200) {
          ElMessage.success(dialogType.value === 'add' ? '添加成功' : '更新成功')
          dialogVisible.value = false
          loadNovelList()
        }
      } catch (error) {
        console.error(dialogType.value === 'add' ? '添加失败:' : '更新失败:', error)
      }
    }
  })
}

// 分页变化
const handlePageChange = (page) => {
  currentPage.value = page
  loadNovelList()
}

// 每页条数变化
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  loadNovelList()
}

onMounted(() => {
  loadNovelList()
  loadCategoryList()
  loadUserList()
})
</script>

<style lang="scss" scoped>
.novel-manage {
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

  .stats {
    display: flex;
    gap: 10px;
    
    span {
      color: #666;
    }
  }

  .cover-uploader {
    :deep(.el-upload) {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);

      &:hover {
        border-color: var(--el-color-primary);
      }
    }
  }

  .cover-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 160px;
    text-align: center;
    line-height: 160px;
  }

  .cover {
    width: 120px;
    height: 160px;
    display: block;
  }
}
</style>