import request from '@/utils/request'

// 查询餐饮娱乐评价列表
export function listReviews(query) {
  return request({
    url: '/entertainment/reviews/list',
    method: 'get',
    params: query
  })
}

// 查询餐饮娱乐评价详细
export function getReviews(id) {
  return request({
    url: '/entertainment/reviews/' + id,
    method: 'get'
  })
}

// 新增餐饮娱乐评价
export function addReviews(data) {
  return request({
    url: '/entertainment/reviews',
    method: 'post',
    data: data
  })
}

// 修改餐饮娱乐评价
export function updateReviews(data) {
  return request({
    url: '/entertainment/reviews',
    method: 'put',
    data: data
  })
}

// 删除餐饮娱乐评价
export function delReviews(id) {
  return request({
    url: '/entertainment/reviews/' + id,
    method: 'delete'
  })
}
