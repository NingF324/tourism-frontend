import request from '@/utils/request'

// 查询景区信息列表
export function listScenicChart(query) {
  return request({
    url: '/scenic/scenicChart/list',
    method: 'get',
    params: query
  })
}

// 查询景区信息详细
export function getScenicChart(id) {
  return request({
    url: '/scenic/scenicChart/' + id,
    method: 'get'
  })
}

// 新增景区信息
export function addScenicChart(data) {
  return request({
    url: '/scenic/scenicChart',
    method: 'post',
    data: data
  })
}

// 修改景区信息
export function updateScenicChart(data) {
  return request({
    url: '/scenic/scenicChart',
    method: 'put',
    data: data
  })
}

// 删除景区信息
export function delScenicChart(id) {
  return request({
    url: '/scenic/scenicChart/' + id,
    method: 'delete'
  })
}
