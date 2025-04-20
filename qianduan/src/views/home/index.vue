<template>
  <div class="home-container">
    <!-- 顶部导航 -->
    <el-header>
      <div class="header-content">
        <div class="left">
          <div class="logo">小说平台</div>
          <el-menu 
            mode="horizontal" 
            :router="true" 
            class="nav-menu"
            :default-active="activeMenu"
          >
            <el-menu-item index="/">首页</el-menu-item>
            <el-menu-item index="/books">书库</el-menu-item>
            <el-menu-item index="/ranking">排行榜</el-menu-item>
            <el-menu-item index="/forum">论坛</el-menu-item>
            <el-menu-item index="/user/bookshelf">我的书架</el-menu-item>
          </el-menu>
        </div>
        <div class="right">
          <el-input
            v-model="searchKey"
            placeholder="搜索小说名称、作者"
            class="search-input"
            clearable
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
            <template #suffix>
              <el-button type="primary" link @click="handleSearch">
                <el-icon><Search /></el-icon>
              </el-button>
            </template>
          </el-input>
          
          <el-dropdown @command="handleCommand">
            <div class="user-info">
              <el-avatar :size="32" :src="userInfo.avatarUrl" />
              <span class="username">{{ userInfo.nickname || userInfo.username }}</span>
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon>个人中心
                </el-dropdown-item>
                <el-dropdown-item command="publishNovel">
                  <el-icon><Edit /></el-icon>发布小说
                </el-dropdown-item>
                <el-dropdown-item command="myWorks">
                  <el-icon><Collection /></el-icon>我的作品
                </el-dropdown-item>



                 <el-dropdown-item command="likeHistory">
          <el-icon><Star /></el-icon>点赞历史
        </el-dropdown-item>




                <el-dropdown-item divided command="logout">
                  <el-icon><SwitchButton /></el-icon>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </el-header>

    <!-- 主要内容区 -->
    <el-main>
      <!-- 公告栏 -->
      <el-card class="notice-card">
        <template #header>
          <div class="card-header">
            <span>平台公告</span>
            <el-link type="primary">更多</el-link>
          </div>
        </template>
        <div class="notice-list">
          <div v-for="notice in notices" :key="notice.id" class="notice-item">
            <el-tag size="small" type="warning" v-if="notice.isNew">新</el-tag>
            <span class="notice-title">{{ notice.title }}</span>
            <span class="notice-time">{{ notice.time }}</span>
          </div>
        </div>
      </el-card>








<el-card class="recommend-card">
  <template #header>
    <div class="card-header">
      <span>
        <el-icon><Star /></el-icon>
        个性化推荐
      </span>

    <div class="header-actions">
          <el-button 
            type="primary" 
            :icon="Refresh" 
            circle 
            @click="loadRecommendBooks"
            :loading="loading"
            size="small"
          ></el-button>

      <el-link type="primary" @click="goToBooks">更多</el-link>
    </div>
    </div>
  </template>
  <div class="recommend-list">
    <el-row :gutter="20">
      <el-col :span="4" v-for="book in recommendBooks" :key="book.id">
        <div class="book-item" @click="goToBook(book.id)">
          <el-image 
            :src="book.coverUrl || '/default-cover.jpg'"
            fit="cover"
            class="book-cover"
          >
            <template #error>
              <div class="image-placeholder">
                <el-icon><Picture /></el-icon>
              </div>
            </template>
          </el-image>
          <h4 class="book-title">{{ book.title }}</h4>
          <p class="book-author">{{ book.authorName }}</p>
        </div>
      </el-col>
    </el-row>
  </div>
</el-card>








     
<!-- 添加推荐阅读组件 -->
  
      <!-- 排行榜 -->
      <el-row :gutter="20" class="ranking-section">
        <el-col :span="8" v-for="(ranking, index) in rankings" :key="index">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>{{ ranking.title }}</span>
                <el-link type="primary" @click="goToBooks">更多</el-link>
              </div>
            </template>
            <div class="ranking-list">
              <div v-for="(book, idx) in ranking.books" :key="book.id" class="ranking-item">
                <span class="rank-num" :class="{'top-three': idx < 3}">{{ idx + 1 }}</span>
                <span class="book-title" @click="goToBook(book.id)">{{ book.title }}</span>
                <span class="book-author">{{ book.author }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search, User, Edit, Collection, Star, SwitchButton, ArrowDown, Picture ,Refresh} from '@element-plus/icons-vue'
import { getPersonalizedRecommendations } from '@/api/recommend'  // 添加这行导入
const router = useRouter()
const route = useRoute()
const searchKey = ref('')
const userInfo = ref({})
const activeMenu = computed(() => route.path)


// 添加loading状态
const loading = ref(false)
// 推荐相关的数据
const recommendBooks = ref([])
const recommendCategory = ref(null)






// 添加获取推荐的方法
const loadRecommendBooks = async () => {
if (!userInfo.value || !userInfo.value.id) {
    console.log('用户未登录，无法获取推荐')
    ElMessage.warning('请先登录')
    return
  }

  try {
     loading.value = true
    console.log('开始获取推荐，用户ID:', userInfo.value.id)
    // 添加请求日志
    console.log('发送请求到:', '/recommend/personalized', '参数:', { userId: userInfo.value.id })
    const res = await getPersonalizedRecommendations(userInfo.value.id)
    console.log('收到推荐响应:', res)
    
  // 替换为使用后端返回的数据
    if (res.code === 200) {
      recommendBooks.value = res.data
    } else {
      ElMessage.error(res.message || '获取推荐失败')
    }
  } catch (error) {
    console.error('获取推荐失败:', error)
    ElMessage.error('获取推荐失败')
  } finally {
    loading.value = false
  }
}
// 在 onMounted 中添加调用
onMounted(() => {
  const storedUserInfo = localStorage.getItem('userInfo')
  if (storedUserInfo) {
    userInfo.value = JSON.parse(storedUserInfo)
    // 添加这一行来加载推荐
    loadRecommendBooks()
  } else {
    router.push('/login')
  }
})










// 公告数据
const notices = ref([
  { id: 1, title: '平台升级公告', time: '2024-01-16', isNew: true },
  { id: 2, title: '关于加强内容审核的通知', time: '2024-01-15' },
  { id: 3, title: '新功能上线预告', time: '2024-01-14' }
])



// 跳转到小说详情
const goToBook = (id) => {
  router.push(`/book/detail/${id}`)
}
// 添加跳转到书库的方法
const goToBooks = () => {
  router.push('/books')
}
// 排行榜数据
const rankings = ref([
  {
    title: '点击榜',
    books: [
      { id: 1, title: '永恒国度', author: '梦入神机' },
      { id: 2, title: '武道巅峰', author: '唐家三少' },
      { id: 3, title: '都市之巅', author: '天蚕土豆' },
      { id: 4, title: '仙途求道', author: '辰东' },
      { id: 5, title: '星际征程', author: '梦入神机' }
    ]
  },
  {
    title: '收藏榜',
    books: [
      { id: 2, title: '武道巅峰', author: '唐家三少' },
      { id: 1, title: '永恒国度', author: '梦入神机' },
      { id: 4, title: '仙途求道', author: '辰东' },
      { id: 3, title: '都市之巅', author: '天蚕土豆' },
      { id: 6, title: '大唐传奇', author: '孑与2' }
    ]
  },
  {
    title: '新书榜',
    books: [
      { id: 6, title: '大唐传奇', author: '孑与2' },
      { id: 5, title: '星际探索', author: '江南' },
      { id: 4, title: '仙道求索', author: '辰东' },
      { id: 3, title: '都市之巅', author: '天蚕土豆' },
      { id: 2, title: '武道巅峰', author: '唐家三少' }
    ]
  }
])

// 处理搜索
const handleSearch = () => {
  if (!searchKey.value.trim()) {
    ElMessage.warning('请输入搜索关键词')
    return
  }
  router.push({
    path: '/search',
    query: { keyword: searchKey.value.trim() }
  })
}

// 处理下拉菜单命令
const handleCommand = (command) => {
  switch (command) {
    case 'profile':
      router.push('/user/profile')
      break
    case 'publishNovel':
      router.push('/novel/publish')
      break
    case 'myWorks':
      router.push('/user/works')
      break
    case 'likeHistory':
      router.push('/user/likes')  // 添加点赞历史路由
      break
    case 'logout':
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      ElMessage.success('已退出登录')
       router.push('/login')  // 添加跳转到登录页面的逻辑
      break
  }
}


</script>

<style scoped>
/* 保持原有样式 */
.home-container {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.el-header {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
  position: fixed;
  width: 100%;
  z-index: 100;
  top: 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
}

.left {
  display: flex;
  align-items: center;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
  margin-right: 40px;
}

.right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.search-input {
  width: 300px;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 0 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: #f5f7fa;
}

.username {
  color: #606266;
  font-size: 14px;
}

.el-main {
  margin-top: 60px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding: 20px;
}

.notice-card,
.recommend-card {
  margin-bottom: 20px;
}

.notice-list .notice-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.notice-list .notice-item:last-child {
  border-bottom: none;
}

.notice-title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notice-time {
  color: #909399;
  font-size: 14px;
}

/* 修改和新增的样式 */
.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.recommend-type {
  color: #909399;
  font-size: 14px;
}

.book-item {
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.book-item:hover {
  transform: translateY(-5px);
}

.book-item img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
}

.book-item h4 {
  margin: 8px 0 4px;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.book-item .author {
  margin: 0;
  font-size: 12px;
  color: #909399;
}

.book-item .recommend-reason {
  margin: 8px 0 0;
  padding: 4px 8px;
  font-size: 12px;
  color: #909399;
  background-color: #f5f7fa;
  border-radius: 4px;
  text-align: left;
  line-height: 1.4;
}

.ranking-section {
  margin-top: 20px;
}

.ranking-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.ranking-item:last-child {
  border-bottom: none;
}

.rank-num {
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  background-color: #f5f7fa;
  border-radius: 4px;
  margin-right: 10px;
  font-size: 14px;
  color: #909399;
}

.rank-num.top-three {
  background-color: #409eff;
  color: #fff;
}

.book-title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.book-author {
  color: #909399;
  font-size: 14px;
  margin-left: 10px;
}

@media (max-width: 768px) {
  .header-content {
    padding: 0 10px;
  }

  .logo {
    margin-right: 20px;
  }

  .search-input {
    width: 200px;
  }

  .username {
    display: none;
  }

  .el-main {
    padding: 10px;
  }

  .header-left {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
}

.recommend-card {
  margin-bottom: 20px;
}

.recommend-list {
  margin: 0 -10px;
}

.book-cover {
  width: 100%;
  height: 200px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.image-placeholder {
  width: 100%;
  height: 200px;
  background-color: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
  font-size: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px; /* 按钮和链接之间的间距 */
}
</style>