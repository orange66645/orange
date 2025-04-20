// src/api/book.js
//555
import request from './request'

// 获取书籍列表
export function getBookList(params) {
  return request({
    url: '/book/list',
    method: 'get',
    params
  })
}

// 获取书籍详情
export function getBookDetail(id) {
  return request({
    url: `/book/${id}`,
    method: 'get'
  })
}

// 获取章节列表
export function getChapterList(params) {
  return request({
    url: '/chapter/list',
    method: 'get',
    params
  })
}

// 获取章节详情
export function getChapterDetail(id) {
  return request({
    url: `/chapter/detail/${id}`,
    method: 'get'
  })
}

// 更新阅读量
export function updateChapterView(id) {
  return request({
    url: `/chapter/view/${id}`,
    method: 'post'
  })
}

// 点赞章节
export function likeChapter(id, userId) {
  return request({
    url: `/chapter/like/${id}`,
    method: 'post',
    params: { userId }
  })
}
// 收藏/取消收藏小说
export function collectBook(novelId) {
  return request({
    url: '/book/collect',
    method: 'post',
    data: { novelId }
  })
}

// 检查是否已收藏
export function checkCollect(novelId) {
  return request({
    url: `/book/collect/check/${novelId}`,
    method: 'get'
  })
}

// 获取我的书架
export function getMyBooks(params) {
  return request({
    url: '/book/collect/list',
    method: 'get',
    params
  })
}
// src/api/book.js
// 移出书架
// 移出书架
export function removeCollection(collectionId) {
  return request({
    url: `/book/collect/${collectionId}`,
    method: 'delete'
  })
}

// 添加阅读历史记录
export function addReadingHistory(data) {
  return request({
    url: '/book/reading/history/add',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
// 获取阅读历史
export function getReadingHistory(params) {
  return request({
    url: '/book/reading/history',
    method: 'get',
    params
  })
}
// // 添加阅读历史记录  重复了
// export function addReadingHistory(data) {
//   return request({
//     url: '/book/history/add',  // 修改为与其他API风格一致的路径
//     method: 'post',
//     data  // 使用data而不是params，因为是POST请求
//   })
// }
// 删除阅读历史
export function deleteReadingHistory(id) {
  return request({
    url: `/book/reading/history/${id}`,
    method: 'delete'
  })
}
// 获取排行榜数据
export function fetchRankListAPI(type='total') {
  return request({
    url: '/book/rank',
    method: 'get',
    params: { type } 
  })
}
// 搜索小说
export function searchNovels(keyword) {
  return request({
    url: '/book/search',
    method: 'get',
    params: { keyword }
  })
}
// 发布小说
export function publishBook(data) {
  return request({
    url: '/book/publish',
    method: 'post',
    data
  })
}





// 新增获取小说详情的 API
export function getNovelDetail(id) {
  return request({
    url: `/book/${id}`,
    method: 'get'
  })
}

// 新增更新小说的 API
export function updateNovel(data) {
  return request({
    url: `/book/update/${data.id}`,  // 改回这个路径
    method: 'put',
    data
  })
}






// 获取分类列表
export function getCategories() {
  return request({
    url: '/category/list',
    method: 'get'
  })
}
// 获取我的作品列表
export function getMyPublishedBooks(params) {
  return request({
    url: '/book/published/list',
    method: 'get',
    params
  })
}

// 删除我的作品
export function deletePublishedBook(id) {
  return request({
    url: `/book/published/${id}`,
    method: 'delete'
  })
}
//点赞/取消点赞
export function toggleLike(bookId) {
  return request({
    url: `/userlike/${bookId}`,
    method: 'post'
  })
}

// 检查是否已点赞
export function checkLike(bookId) {
  return request({
    url: `/userlike/check/${bookId}`,
    method: 'get'
  })
}
