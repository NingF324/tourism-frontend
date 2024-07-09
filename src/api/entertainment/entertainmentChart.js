import request from '@/utils/request'

// 查询娱乐汇总列表
export function listEntertainmentChart(query) {
  return request({
    url: '/entertainment/entertainmentChart/list',
    method: 'get',
    params: query
  })
}

// 查询娱乐汇总详细
export function getEntertainmentChart(id) {
  return request({
    url: '/entertainment/entertainmentChart/' + id,
    method: 'get'
  })
}

// 新增娱乐汇总
export function addEntertainmentChart(data) {
  return request({
    url: '/entertainment/entertainmentChart',
    method: 'post',
    data: data
  })
}

// 修改娱乐汇总
export function updateEntertainmentChart(data) {
  return request({
    url: '/entertainment/entertainmentChart',
    method: 'put',
    data: data
  })
}

// 删除娱乐汇总
export function delEntertainmentChart(id) {
  return request({
    url: '/entertainment/entertainmentChart/' + id,
    method: 'delete'
  })
}
