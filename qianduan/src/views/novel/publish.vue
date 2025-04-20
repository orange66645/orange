<template>
  <div class="publish-container">
    <el-card class="publish-card" v-loading="loading">
      <template #header>
        <div class="card-header">
          <span>{{ novelId ? '编辑小说' : '发布小说' }}</span>
        </div>
      </template>
      
      <!-- 小说基本信息表单 -->
      <el-form 
        ref="novelFormRef"
        :model="novelForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="小说名称" prop="title">
          <el-input v-model="novelForm.title" placeholder="请输入小说名称"/>
        </el-form-item>

        <el-form-item label="小说分类" prop="categoryId">
          <el-select v-model="novelForm.categoryId" placeholder="请选择分类">
            <el-option
              v-for="item in categories"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="封面图片" prop="coverUrl">
          <el-upload
            class="cover-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleCoverSuccess"
            :before-upload="beforeCoverUpload"
          >
            <img v-if="novelForm.coverUrl" :src="novelForm.coverUrl" class="cover" />
            <el-icon v-else class="cover-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>

        <el-form-item label="小说简介" prop="description">
          <el-input
            v-model="novelForm.description"
            type="textarea"
            :rows="4"
            placeholder="请输入小说简介"
          />
        </el-form-item>
      </el-form>

      <!-- 章节列表 -->
      <div class="chapters-section">
        <div class="section-header">
          <h3>章节列表</h3>
          <el-button type="primary" @click="addChapter">添加章节</el-button>
        </div>

        <el-table :data="chapters" style="width: 100%">
          <el-table-column label="章节序号" width="100">
            <template #default="{ $index }">
              {{ $index + 1 }}
            </template>
          </el-table-column>
          
          <el-table-column label="章节标题" width="200">
            <template #default="{ row }">
              <el-input v-model="row.title" placeholder="请输入章节标题"/>
            </template>
          </el-table-column>
          
          <el-table-column label="章节内容">
            <template #default="{ row }">
              <el-input
                v-model="row.content"
                type="textarea"
                :rows="3"
                placeholder="请输入章节内容"
              />
            </template>
          </el-table-column>
          
          <el-table-column label="操作" width="120">
            <template #default="{ $index }">
              <el-button 
                type="danger" 
                link
                @click="deleteChapter($index)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 提交按钮 -->
      <div class="submit-section">
        <el-button type="primary" @click="handleSubmit">
          {{ novelId ? '保存修改' : '发布小说' }}
        </el-button>
        <el-button @click="$router.back()">返回</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { getCategories, publishBook, getNovelDetail, updateNovel } from '@/api/book'

const router = useRouter()
const route = useRoute()
const novelId = route.query.id
const loading = ref(false)
const categories = ref([])
const novelFormRef = ref()

// 小说表单数据
const novelForm = reactive({
  title: '',
  categoryId: '',
  coverUrl: '',
  description: ''
})

// 章节列表
const chapters = ref([])

// 表单验证规则
const rules = {
  title: [
    { required: true, message: '请输入小说名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  categoryId: [
    { required: true, message: '请选择小说分类', trigger: 'change' }
  ],
  description: [
    { required: true, message: '请输入小说简介', trigger: 'blur' },
    { min: 10, max: 500, message: '长度在 10 到 500 个字符', trigger: 'blur' }
  ]
}

// 初始化数据
onMounted(async () => {
  loading.value = true
  try {
    // 获取分类列表
    const categoriesRes = await getCategories()
    categories.value = categoriesRes.data

    // 如果是编辑模式，获取小说详情
    if (novelId) {
      const detailRes = await getNovelDetail(novelId)
      if (detailRes.code === 200) {
        const { title, categoryId, coverUrl, description, chapters: novelChapters } = detailRes.data
        // 填充表单数据
        Object.assign(novelForm, { title, categoryId, coverUrl, description })
        // 填充章节数据
        chapters.value = novelChapters || []
      }
    }
  } catch (error) {
    console.error('初始化数据失败:', error)
    ElMessage.error('初始化数据失败')
  } finally {
    loading.value = false
  }
})

// 处理封面上传
const uploadUrl = import.meta.env.VITE_API_URL + '/upload'
const handleCoverSuccess = (res) => {
  novelForm.coverUrl = res.data
  ElMessage.success('封面上传成功')
}

const beforeCoverUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('封面图片只能是图片格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('封面图片大小不能超过 2MB!')
    return false
  }
  return true
}

// 添加章节
const addChapter = () => {
  chapters.value.push({
    title: '',
    content: '',
    chapterOrder: chapters.value.length + 1
  })
}

// 删除章节
const deleteChapter = (index) => {
  chapters.value.splice(index, 1)
  // 重新排序
  chapters.value.forEach((chapter, idx) => {
    chapter.chapterOrder = idx + 1
  })
}

// 提交表单
const handleSubmit = async () => {
  if (!chapters.value.length) {
    ElMessage.warning('请至少添加一个章节')
    return
  }

  try {
    await novelFormRef.value.validate()
    
    // 验证章节数据
    const invalidChapter = chapters.value.find(
      chapter => !chapter.title || !chapter.content
    )
    if (invalidChapter) {
      ElMessage.warning('请完善所有章节的标题和内容')
      return
    }

    // 构建提交数据
    const novelData = {
      ...novelForm,
      id: novelId,
      chapters: chapters.value.map(chapter => ({
        title: chapter.title,
        content: chapter.content,
        chapterOrder: chapter.chapterOrder
      }))
    }

    if (novelId) {
      // 编辑模式
      await updateNovel(novelData)
      ElMessage.success('更新成功')
    } else {
      // 新增模式
      await publishBook(novelData)
      ElMessage.success('发布成功')
    }
    
    router.push('/user/works')
  } catch (error) {
    console.error('操作失败:', error)
    ElMessage.error('操作失败，请重试')
  }
}
</script>

<style scoped>
.publish-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.publish-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cover-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 178px;
  height: 178px;
}

.cover-uploader:hover {
  border-color: #409eff;
}

.cover-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  line-height: 178px;
}

.cover {
  width: 178px;
  height: 178px;
  display: block;
  object-fit: cover;
}

.chapters-section {
  margin-top: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.submit-section {
  margin-top: 30px;
  text-align: center;
}
</style>