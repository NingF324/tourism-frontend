import request from '@/utils/request'

// 查询餐饮信息列表
export function listDining(query) {
  return request({
    url: '/entertainment/dining/list',
    method: 'get',
    params: query
  })
}

// 查询餐饮信息详细
export function getDining(id) {
  return request({
    url: '/entertainment/dining/' + id,
    method: 'get'
  })
}

// 新增餐饮信息
export function addDining(data) {
  return request({
    url: '/entertainment/dining',
    method: 'post',
    data: data
  })
}

// 修改餐饮信息
export function updateDining(data) {
  return request({
    url: '/entertainment/dining',
    method: 'put',
    data: data
  })
}

// 删除餐饮信息
export function delDining(id) {
  return request({
    url: '/entertainment/dining/' + id,
    method: 'delete'
  })
}
