// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import AdminLayout from '../layout/admin/index.vue' 
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/home/index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/index.vue')
  },
  // 书库相关路由
  {
    path: '/books',
    name: 'BookList',
    component: () => import('../views/book/BookList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/book/detail/:id',
    name: 'BookDetail',
    component: () => import('../views/book/BookDetail.vue'),
    meta: { requiresAuth: true }
  },
  // 章节相关路由
  {
    path: '/chapter/detail/:id',
    name: 'ChapterDetail',
    component: () => import('../views/chapter/ChapterDetail.vue'),
    meta: { requiresAuth: true }
  },
  // 搜索页面路由
  {
    path: '/search',
    name: 'Search',
    component: () => import('../views/search/index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/user/bookshelf',
    name: 'Bookshelf',
    component: () => import('../views/user/Bookshelf.vue'),
    meta: { 
      requiresAuth: true,
      title: '我的书架'
    }
  },
   // 个人中心路由
   {
    path: '/user/profile',
    name: 'UserProfile',
    component: () => import('../views/user/Profile.vue'),
    meta: {
      requiresAuth: true,
      title: '个人中心'
    }
  },
  {
    path: '/forum',
    name: 'Forum',
    component: () => import('../views/forum/ForumList.vue'),
    meta: {
      requiresAuth: true,
      title: '论坛'
    }
  },
  {
    path: '/forum/post/:id',
    name: 'PostDetail',
    component: () => import('../views/forum/PostDetail.vue'),
    meta: {
      requiresAuth: true,
      title: '帖子详情'
    }
  },


//点赞历史


{
  path: '/user/likes',
  name: 'UserLikes',
  component: () => import('@/views/user/likes.vue'),  // 使用懒加载方式导入
  meta: { requiresAuth: true }
},








  {
    path: '/ranking',
    name: 'Ranking',
    component: () => import('../views/rank/index.vue'),
    meta: {
      title: '排行榜'
    }
  },
  {
    path: '/novel/publish',
    name: 'PublishNovel',
    component: () => import('../views/novel/publish.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/user/works',  // 我的作品路由
    name: 'UserWorks',
    component: () => import('../views/user/work.vue'),
    meta: { title: '我的作品' }
  },



  {
    path: '/admin',
    component: AdminLayout,
    meta: { 
      requiresAuth: true,
      requiresAdmin: true
    },
    children: [
      {
        path: '',
        redirect: '/admin/dashboard'
      },
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('../views/admin/dashboard/index.vue'),
        meta: { title: '控制台' }
      },
      // 用户管理
      {
        path: 'user',
        name: 'AdminUser',
        meta: { 
          title: '用户管理',
          icon: 'User'
        },
        children: [
          {
            path: 'list',
            name: 'AdminUserList',
            component: () => import('../views/admin/user/list.vue'),
            meta: { 
              title: '用户列表',
              keepAlive: true  // 开启缓存
            }
          },
          {
            path: 'detail/:id',
            name: 'AdminUserDetail',
            component: () => import('../views/admin/user/detail.vue'),
            meta: { 
              title: '用户详情',
              activeMenu: '/admin/user/list'  // 高亮显示父级菜单
            },
            hidden: true  // 在菜单中隐藏
          }
        ]
      },
     // 小说管理
{
  path: 'novel',
  name: 'AdminNovel',
  meta: { 
    title: '小说管理',
    icon: 'Reading'  // 使用阅读相关的图标
  },
  children: [
    {
      path: 'list',
      name: 'AdminNovelList',
      component: () => import('../views/admin/novel/list.vue'),
      meta: { 
        title: '小说列表',
        keepAlive: true  // 开启缓存
      }
    },
  ]
},
      // ... 其他管理后台子路由


//论坛管理员
      {
        path: '/admin',
        
        children: [

          // ... 其他路由
          {
            path: 'forum',
            component: () => import('@/views/admin/forum/index.vue'),
            name: 'ForumManage',
            meta: { title: '论坛管理', icon: 'chat' }
          }
        ]
      },




     






     



    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router