import request from '@/utils/request'

// 查询非星级酒店评价列表
export function listNonstarhotelreviews(query) {
  return request({
    url: '/hotel/nonstarhotelreviews/list',
    method: 'get',
    params: query
  })
}

// 查询非星级酒店评价详细
export function getNonstarhotelreviews(id) {
  return request({
    url: '/hotel/nonstarhotelreviews/' + id,
    method: 'get'
  })
}

// 新增非星级酒店评价
export function addNonstarhotelreviews(data) {
  return request({
    url: '/hotel/nonstarhotelreviews',
    method: 'post',
    data: data
  })
}

// 修改非星级酒店评价
export function updateNonstarhotelreviews(data) {
  return request({
    url: '/hotel/nonstarhotelreviews',
    method: 'put',
    data: data
  })
}

// 删除非星级酒店评价
export function delNonstarhotelreviews(id) {
  return request({
    url: '/hotel/nonstarhotelreviews/' + id,
    method: 'delete'
  })
}
