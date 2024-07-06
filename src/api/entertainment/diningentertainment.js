import request from '@/utils/request'

// 查询餐饮娱乐信息列表
export function listDiningentertainment(query) {
  return request({
    url: '/entertainment/diningentertainment/list',
    method: 'get',
    params: query
  })
}

// 查询餐饮娱乐信息详细
export function getDiningentertainment(id) {
  return request({
    url: '/entertainment/diningentertainment/' + id,
    method: 'get'
  })
}

// 新增餐饮娱乐信息
export function addDiningentertainment(data) {
  return request({
    url: '/entertainment/diningentertainment',
    method: 'post',
    data: data
  })
}

// 修改餐饮娱乐信息
export function updateDiningentertainment(data) {
  return request({
    url: '/entertainment/diningentertainment',
    method: 'put',
    data: data
  })
}

// 删除餐饮娱乐信息
export function delDiningentertainment(id) {
  return request({
    url: '/entertainment/diningentertainment/' + id,
    method: 'delete'
  })
}
