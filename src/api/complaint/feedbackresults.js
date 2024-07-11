import request from '@/utils/request'

// 查询投诉处理反馈信息列表
export function listFeedbackresults(query) {
  return request({
    url: '/complaint/feedbackresults/list',
    method: 'get',
    params: query
  })
}

// 查询投诉处理反馈信息详细
export function getFeedbackresults(id) {
  return request({
    url: '/complaint/feedbackresults/' + id,
    method: 'get'
  })
}

// 新增投诉处理反馈信息
export function addFeedbackresults(data) {
  return request({
    url: '/complaint/feedbackresults',
    method: 'post',
    data: data
  })
}

// 修改投诉处理反馈信息
export function updateFeedbackresults(data) {
  return request({
    url: '/complaint/feedbackresults',
    method: 'put',
    data: data
  })
}

// 删除投诉处理反馈信息
export function delFeedbackresults(id) {
  return request({
    url: '/complaint/feedbackresults/' + id,
    method: 'delete'
  })
}
