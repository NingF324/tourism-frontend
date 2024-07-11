import request from '@/utils/request'

// 查询酒店营销记录列表
export function listStarmarketingrecords(query) {
  return request({
    url: '/hotel/starmarketingrecords/list',
    method: 'get',
    params: query
  })
}

// 查询酒店营销记录详细
export function getStarmarketingrecords(id) {
  return request({
    url: '/hotel/starmarketingrecords/' + id,
    method: 'get'
  })
}

// 新增酒店营销记录
export function addStarmarketingrecords(data) {
  return request({
    url: '/hotel/starmarketingrecords',
    method: 'post',
    data: data
  })
}

// 修改酒店营销记录
export function updateStarmarketingrecords(data) {
  return request({
    url: '/hotel/starmarketingrecords',
    method: 'put',
    data: data
  })
}

// 删除酒店营销记录
export function delStarmarketingrecords(id) {
  return request({
    url: '/hotel/starmarketingrecords/' + id,
    method: 'delete'
  })
}
