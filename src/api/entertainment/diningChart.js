import request from '@/utils/request'

// 查询餐饮信息列表
export function listDiningChart(query) {
  return request({
    url: '/entertainment/diningChart/list',
    method: 'get',
    params: query
  })
}

// 查询餐饮信息详细
export function getDiningChart(id) {
  return request({
    url: '/entertainment/diningChart/' + id,
    method: 'get'
  })
}

// 新增餐饮信息
export function addDiningChart(data) {
  return request({
    url: '/entertainment/diningChart',
    method: 'post',
    data: data
  })
}

// 修改餐饮信息
export function updateDiningChart(data) {
  return request({
    url: '/entertainment/diningChart',
    method: 'put',
    data: data
  })
}

// 删除餐饮信息
export function delDiningChart(id) {
  return request({
    url: '/entertainment/diningChart/' + id,
    method: 'delete'
  })
}
