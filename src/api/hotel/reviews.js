import request from '@/utils/request'

// 查询非星级酒店评价管理列表
export function listReviews(query) {
  return request({
    url: '/hotel/reviews/list',
    method: 'get',
    params: query
  })
}

// 查询非星级酒店评价管理详细
export function getReviews(id) {
  return request({
    url: '/hotel/reviews/' + id,
    method: 'get'
  })
}

// 新增非星级酒店评价管理
export function addReviews(data) {
  return request({
    url: '/hotel/reviews',
    method: 'post',
    data: data
  })
}

// 修改非星级酒店评价管理
export function updateReviews(data) {
  return request({
    url: '/hotel/reviews',
    method: 'put',
    data: data
  })
}

// 删除非星级酒店评价管理
export function delReviews(id) {
  return request({
    url: '/hotel/reviews/' + id,
    method: 'delete'
  })
}
