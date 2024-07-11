import request from '@/utils/request'

// 查询星级酒店房型列表
export function listStarroomtypes(query) {
  return request({
    url: '/hotel/starroomtypes/list',
    method: 'get',
    params: query
  })
}

// 查询星级酒店房型详细
export function getStarroomtypes(id) {
  return request({
    url: '/hotel/starroomtypes/' + id,
    method: 'get'
  })
}

// 新增星级酒店房型
export function addStarroomtypes(data) {
  return request({
    url: '/hotel/starroomtypes',
    method: 'post',
    data: data
  })
}

// 修改星级酒店房型
export function updateStarroomtypes(data) {
  return request({
    url: '/hotel/starroomtypes',
    method: 'put',
    data: data
  })
}

// 删除星级酒店房型
export function delStarroomtypes(id) {
  return request({
    url: '/hotel/starroomtypes/' + id,
    method: 'delete'
  })
}
