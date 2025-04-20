import request from './request'

// 获取个性化推荐
export function getPersonalizedRecommendations(userId) {
  return request({
    url: '/recommend/personalized',
    method: 'get',
    params: { userId }
  })
}