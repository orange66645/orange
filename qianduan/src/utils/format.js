// 格式化日期时间
export function formatDateTime(date) {
    if (!date) return ''
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const hour = String(d.getHours()).padStart(2, '0')
    const minute = String(d.getMinutes()).padStart(2, '0')
    const second = String(d.getSeconds()).padStart(2, '0')
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`
  }
  
  // 格式化日期
  export function formatDate(date) {
    if (!date) return ''
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  
  // 格式化数字（添加千分位）
  export function formatNumber(num) {
    if (!num && num !== 0) return '0'
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
  
  // 格式化字数
  export function formatWordCount(count) {
    if (!count && count !== 0) return '0字'
    if (count < 10000) {
      return count + '字'
    } else if (count < 100000000) {
      return (count / 10000).toFixed(1) + '万字'
    } else {
      return (count / 100000000).toFixed(1) + '亿字'
    }
  }
  
  // 格式化文件大小
  export function formatFileSize(size) {
    if (!size && size !== 0) return '0 B'
    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    let index = 0
    while (size >= 1024 && index < units.length - 1) {
      size /= 1024
      index++
    }
    return size.toFixed(2) + ' ' + units[index]
  }
  
  // 格式化时长（秒转换为时分秒）
  export function formatDuration(seconds) {
    if (!seconds && seconds !== 0) return '0秒'
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    
    let result = ''
    if (hours > 0) {
      result += `${hours}小时`
    }
    if (minutes > 0) {
      result += `${minutes}分`
    }
    if (remainingSeconds > 0 || result === '') {
      result += `${remainingSeconds}秒`
    }
    return result
  }
  
  // 格式化小说状态
  export function formatNovelStatus(status) {
    switch (status) {
      case 0:
        return { type: 'info', text: '审核中' }
      case 1:
        return { type: 'success', text: '连载中' }
      case 2:
        return { type: 'warning', text: '已完结' }
      case -1:
        return { type: 'danger', text: '已拒绝' }
      default:
        return { type: 'info', text: '未知' }
    }
  }
  
  // 格式化评论状态
  export function formatCommentStatus(status) {
    switch (status) {
      case 0:
        return { type: 'info', text: '待审核' }
      case 1:
        return { type: 'success', text: '已通过' }
      case -1:
        return { type: 'danger', text: '已拒绝' }
      default:
        return { type: 'info', text: '未知' }
    }
  }
  
  // 格式化用户状态
  export function formatUserStatus(status) {
    switch (status) {
      case 0:
        return { type: 'danger', text: '禁用' }
      case 1:
        return { type: 'success', text: '正常' }
      default:
        return { type: 'info', text: '未知' }
    }
  }
  
  // 格式化用户角色
  export function formatUserRole(roleType) {
    switch (roleType) {
      case 1:
        return { type: 'success', text: '普通用户' }
      case 2:
        return { type: 'danger', text: '管理员' }
      default:
        return { type: 'info', text: '未知' }
    }
  }
  
  // 格式化金额（分转元）
  export function formatAmount(amount) {
    if (!amount && amount !== 0) return '¥0.00'
    return `¥${(amount / 100).toFixed(2)}`
  }
  
  // 格式化百分比
  export function formatPercent(value) {
    if (!value && value !== 0) return '0%'
    return `${(value * 100).toFixed(2)}%`
  }