import request from '@/utils/request'

// 查询演出团体信息列表
export function listPerformancegroups(query) {
  return request({
    url: '/entertainment/performancegroups/list',
    method: 'get',
    params: query
  })
}

// 查询演出团体信息详细
export function getPerformancegroups(id) {
  return request({
    url: '/entertainment/performancegroups/' + id,
    method: 'get'
  })
}

// 新增演出团体信息
export function addPerformancegroups(data) {
  return request({
    url: '/entertainment/performancegroups',
    method: 'post',
    data: data
  })
}

// 修改演出团体信息
export function updatePerformancegroups(data) {
  return request({
    url: '/entertainment/performancegroups',
    method: 'put',
    data: data
  })
}

// 删除演出团体信息
export function delPerformancegroups(id) {
  return request({
    url: '/entertainment/performancegroups/' + id,
    method: 'delete'
  })
}
