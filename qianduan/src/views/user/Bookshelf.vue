<template>
  <div class="bookshelf-container">
    <el-row :gutter="20">
      <el-col v-for="book in bookList" :key="book.id" :span="6">
        <el-card class="book-card">
          <img :src="book.coverUrl" class="cover-image">
          <div class="book-info">
            <h3>{{ book.novelTitle }}</h3>
            <p class="author">作者：{{ book.authorName }}</p>
            <p class="category">分类：{{ book.categoryName }}</p>
            <div class="reading-progress">
              <span>阅读进度：</span>
              <template v-if="book.lastReadChapterId">
                <router-link :to="`/chapter/detail/${book.lastReadChapterId}`">
                  {{ book.lastReadChapterTitle }}
                </router-link>
              </template>
              <template v-else-if="book.firstChapterId">
                <span>未开始阅读</span>
              </template>
              <template v-else>
                <span>暂无章节</span>
              </template>
            </div>
            <div class="actions">
              <el-button 
                type="primary" 
                @click="continueReading(book)"
                :disabled="!book.firstChapterId"
              >
                {{ book.lastReadChapterId ? '继续阅读' : '开始阅读' }}
              </el-button>
              <el-button 
                type="danger" 
                @click="removeFromShelf(book.id)"
              >
                移出书架
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-pagination
      v-if="total > 0"
      class="pagination"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      layout="prev, pager, next"
      @current-change="handlePageChange"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getMyBooks, removeCollection } from '@/api/book'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const bookList = ref([])
const currentPage = ref(1)
const pageSize = ref(12)
const total = ref(0)

// 继续阅读
const continueReading = (book) => {
  // 优先使用最后阅读章节，如果没有则使用第一章
  const chapterId = book.lastReadChapterId || book.firstChapterId
  
  if (chapterId) {
    console.log('跳转到章节:', chapterId)
    router.push(`/chapter/detail/${chapterId}`)
  } else {
    ElMessage.warning('该小说暂无章节')
  }
}

// 获取书架列表
const fetchBookList = async () => {
  try {
    const res = await getMyBooks({
      page: currentPage.value,
      pageSize: pageSize.value
    })
    if (res.code === 200) {
      console.log('书架数据:', res.data.records)  // 查看返回的数据结构
      bookList.value = res.data.records
      total.value = res.data.total
    }
  } catch (error) {
    console.error('获取书架列表失败:', error)
    ElMessage.error('获取书架列表失败')
  }
}

// 移出书架
const removeFromShelf = async (collectionId) => {
  if (!collectionId) {
    ElMessage.error('参数错误')
    return
  }
  
  try {
    await ElMessageBox.confirm('确定将这本书移出书架吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    console.log('移出书架, collectionId:', collectionId)  // 添加日志
    
    const res = await removeCollection(collectionId)
    if (res.code === 200) {
      ElMessage.success('已移出书架')
      fetchBookList()  // 刷新列表
    } else {
      ElMessage.error(res.message || '操作失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('移出书架失败:', error)
      ElMessage.error('操作失败')
    }
  }
}

onMounted(() => {
  fetchBookList()
})
</script>
<style scoped>
.bookshelf-container {
  padding: 20px;
}

.book-card {
  margin-bottom: 20px;
  transition: all 0.3s;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.cover-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.book-info {
  padding: 14px;
}

.book-info h3 {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.author, .category {
  margin: 5px 0;
  font-size: 14px;
  color: #666;
}

.reading-progress {
  margin: 10px 0;
  font-size: 13px;
  color: #666;
}

.reading-progress a {
  color: #409EFF;
  text-decoration: none;
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>