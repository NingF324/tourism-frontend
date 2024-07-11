import request from '@/utils/request'

// 查询非星级酒店列表
export function listNonstarhotels(query) {
  return request({
    url: '/hotel/nonstarhotels/list',
    method: 'get',
    params: query
  })
}

// 查询非星级酒店详细
export function getNonstarhotels(id) {
  return request({
    url: '/hotel/nonstarhotels/' + id,
    method: 'get'
  })
}

// 新增非星级酒店
export function addNonstarhotels(data) {
  return request({
    url: '/hotel/nonstarhotels',
    method: 'post',
    data: data
  })
}

// 修改非星级酒店
export function updateNonstarhotels(data) {
  return request({
    url: '/hotel/nonstarhotels',
    method: 'put',
    data: data
  })
}

// 删除非星级酒店
export function delNonstarhotels(id) {
  return request({
    url: '/hotel/nonstarhotels/' + id,
    method: 'delete'
  })
}
