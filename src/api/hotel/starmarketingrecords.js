import request from '@/utils/request'

// 查询星级酒店营销管理列表
export function listStarmarketingrecords(query) {
  return request({
    url: '/hotel/starmarketingrecords/list',
    method: 'get',
    params: query
  })
}

// 查询星级酒店营销管理详细
export function getStarmarketingrecords(id) {
  return request({
    url: '/hotel/starmarketingrecords/' + id,
    method: 'get'
  })
}

// 新增星级酒店营销管理
export function addStarmarketingrecords(data) {
  return request({
    url: '/hotel/starmarketingrecords',
    method: 'post',
    data: data
  })
}

// 修改星级酒店营销管理
export function updateStarmarketingrecords(data) {
  return request({
    url: '/hotel/starmarketingrecords',
    method: 'put',
    data: data
  })
}

// 删除星级酒店营销管理
export function delStarmarketingrecords(id) {
  return request({
    url: '/hotel/starmarketingrecords/' + id,
    method: 'delete'
  })
}
