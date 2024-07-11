import request from '@/utils/request'

// 查询星级酒店评价列表
export function listStarhotelreviews(query) {
  return request({
    url: '/hotel/starhotelreviews/list',
    method: 'get',
    params: query
  })
}

// 查询星级酒店评价详细
export function getStarhotelreviews(id) {
  return request({
    url: '/hotel/starhotelreviews/' + id,
    method: 'get'
  })
}

// 新增星级酒店评价
export function addStarhotelreviews(data) {
  return request({
    url: '/hotel/starhotelreviews',
    method: 'post',
    data: data
  })
}

// 修改星级酒店评价
export function updateStarhotelreviews(data) {
  return request({
    url: '/hotel/starhotelreviews',
    method: 'put',
    data: data
  })
}

// 删除星级酒店评价
export function delStarhotelreviews(id) {
  return request({
    url: '/hotel/starhotelreviews/' + id,
    method: 'delete'
  })
}
