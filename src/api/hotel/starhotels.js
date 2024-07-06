import request from '@/utils/request'

// 查询星级酒店信息列表
export function listStarhotels(query) {
  return request({
    url: '/hotel/starhotels/list',
    method: 'get',
    params: query
  })
}

// 查询星级酒店信息详细
export function getStarhotels(id) {
  return request({
    url: '/hotel/starhotels/' + id,
    method: 'get'
  })
}

// 新增星级酒店信息
export function addStarhotels(data) {
  return request({
    url: '/hotel/starhotels',
    method: 'post',
    data: data
  })
}

// 修改星级酒店信息
export function updateStarhotels(data) {
  return request({
    url: '/hotel/starhotels',
    method: 'put',
    data: data
  })
}

// 删除星级酒店信息
export function delStarhotels(id) {
  return request({
    url: '/hotel/starhotels/' + id,
    method: 'delete'
  })
}
