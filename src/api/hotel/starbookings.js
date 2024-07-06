import request from '@/utils/request'

// 查询星级酒店预定列表
export function listStarbookings(query) {
  return request({
    url: '/hotel/starbookings/list',
    method: 'get',
    params: query
  })
}

// 查询星级酒店预定详细
export function getStarbookings(id) {
  return request({
    url: '/hotel/starbookings/' + id,
    method: 'get'
  })
}

// 新增星级酒店预定
export function addStarbookings(data) {
  return request({
    url: '/hotel/starbookings',
    method: 'post',
    data: data
  })
}

// 修改星级酒店预定
export function updateStarbookings(data) {
  return request({
    url: '/hotel/starbookings',
    method: 'put',
    data: data
  })
}

// 删除星级酒店预定
export function delStarbookings(id) {
  return request({
    url: '/hotel/starbookings/' + id,
    method: 'delete'
  })
}
