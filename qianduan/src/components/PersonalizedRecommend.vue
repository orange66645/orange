<template>
  <div class="personalized-recommend">
    <div class="recommend-header">
      <h3>为您推荐</h3>
      <el-button 
        type="primary" 
        :icon="Refresh" 
        circle 
        @click="loadRecommendations"
        :loading="loading"
      ></el-button>
    </div>
    <el-row :gutter="20">
      <el-col :span="4" v-for="novel in recommendations" :key="novel.id">
        <el-card :body-style="{ padding: '0px' }" shadow="hover">
          <img :src="novel.coverUrl" class="novel-cover">
          <div class="novel-info">
            <h4>{{ novel.title }}</h4>
            <p>{{ novel.description }}</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getPersonalizedRecommendations } from '@/api/recommend'
import { useUserStore } from '@/stores/user'
import { Refresh } from '@element-plus/icons-vue'  // 添加图标

const userStore = useUserStore()
const recommendations = ref([])
const loading = ref(false)  // 添加loading状态

const loadRecommendations = async () => {
  if (!userStore.userId) {
    console.log('未登录，无法获取推荐')
    ElMessage.warning('请先登录')
    return
  }

  try {
    loading.value = true  // 开始加载
    console.log('开始获取推荐，userId:', userStore.userId)
    const res = await getPersonalizedRecommendations(userStore.userId)
    console.log('推荐响应:', res)
    if (res.code === 200) {
      recommendations.value = res.data
      console.log('设置推荐数据:', recommendations.value)
    }
  } catch (error) {
    console.error('获取推荐失败:', error)
    ElMessage.error('获取推荐失败')
  } finally {
    loading.value = false  // 结束加载
  }
}

onMounted(() => {
  console.log('组件挂载，userId:', userStore.userId)
  if (userStore.userId) {
    loadRecommendations()
  } else {
    console.log('没有用户ID，不获取推荐')
  }
})
</script>

<style scoped>
.personalized-recommend {
  margin: 20px 0;
}

.recommend-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.novel-cover {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.novel-info {
  padding: 14px;
}

.novel-info h4 {
  margin: 0;
  font-size: 16px;
}

.novel-info p {
  font-size: 13px;
  color: #666;
  margin: 8px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>