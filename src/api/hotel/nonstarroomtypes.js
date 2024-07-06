import request from '@/utils/request'

// 查询非星级房型列表
export function listNonstarroomtypes(query) {
  return request({
    url: '/hotel/nonstarroomtypes/list',
    method: 'get',
    params: query
  })
}

// 查询非星级房型详细
export function getNonstarroomtypes(id) {
  return request({
    url: '/hotel/nonstarroomtypes/' + id,
    method: 'get'
  })
}

// 新增非星级房型
export function addNonstarroomtypes(data) {
  return request({
    url: '/hotel/nonstarroomtypes',
    method: 'post',
    data: data
  })
}

// 修改非星级房型
export function updateNonstarroomtypes(data) {
  return request({
    url: '/hotel/nonstarroomtypes',
    method: 'put',
    data: data
  })
}

// 删除非星级房型
export function delNonstarroomtypes(id) {
  return request({
    url: '/hotel/nonstarroomtypes/' + id,
    method: 'delete'
  })
}
