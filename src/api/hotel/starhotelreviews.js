import request from '@/utils/request'

// 查询星级酒店评价管理列表
export function listStarhotelreviews(query) {
  return request({
    url: '/hotel/starhotelreviews/list',
    method: 'get',
    params: query
  })
}

// 查询星级酒店评价管理详细
export function getStarhotelreviews(id) {
  return request({
    url: '/hotel/starhotelreviews/' + id,
    method: 'get'
  })
}

// 新增星级酒店评价管理
export function addStarhotelreviews(data) {
  return request({
    url: '/hotel/starhotelreviews',
    method: 'post',
    data: data
  })
}

// 修改星级酒店评价管理
export function updateStarhotelreviews(data) {
  return request({
    url: '/hotel/starhotelreviews',
    method: 'put',
    data: data
  })
}

// 删除星级酒店评价管理
export function delStarhotelreviews(id) {
  return request({
    url: '/hotel/starhotelreviews/' + id,
    method: 'delete'
  })
}
