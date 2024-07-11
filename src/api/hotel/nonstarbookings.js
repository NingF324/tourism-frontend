import request from '@/utils/request'

// 查询非星级酒店预定信息列表
export function listNonstarbookings(query) {
  return request({
    url: '/hotel/nonstarbookings/list',
    method: 'get',
    params: query
  })
}

// 查询非星级酒店预定信息详细
export function getNonstarbookings(id) {
  return request({
    url: '/hotel/nonstarbookings/' + id,
    method: 'get'
  })
}

// 新增非星级酒店预定信息
export function addNonstarbookings(data) {
  return request({
    url: '/hotel/nonstarbookings',
    method: 'post',
    data: data
  })
}

// 修改非星级酒店预定信息
export function updateNonstarbookings(data) {
  return request({
    url: '/hotel/nonstarbookings',
    method: 'put',
    data: data
  })
}

// 删除非星级酒店预定信息
export function delNonstarbookings(id) {
  return request({
    url: '/hotel/nonstarbookings/' + id,
    method: 'delete'
  })
}

export function ConfirmStarbookings(id) {
  return request({
    url: '/hotel/nonstarbookings/confirm/' + id,
    method: 'delete'
  })
}
