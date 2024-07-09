import request from '@/utils/request'

// 查询娱乐信息列表
export function listEntertainment(query) {
  return request({
    url: '/entertainment/entertainment/list',
    method: 'get',
    params: query
  })
}

// 查询娱乐信息详细
export function getEntertainment(id) {
  return request({
    url: '/entertainment/entertainment/' + id,
    method: 'get'
  })
}

// 新增娱乐信息
export function addEntertainment(data) {
  return request({
    url: '/entertainment/entertainment',
    method: 'post',
    data: data
  })
}

// 修改娱乐信息
export function updateEntertainment(data) {
  return request({
    url: '/entertainment/entertainment',
    method: 'put',
    data: data
  })
}

// 删除娱乐信息
export function delEntertainment(id) {
  return request({
    url: '/entertainment/entertainment/' + id,
    method: 'delete'
  })
}
