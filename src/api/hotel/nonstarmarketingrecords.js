import request from '@/utils/request'

// 查询非星级酒店营销记录列表
export function listNonstarmarketingrecords(query) {
  return request({
    url: '/hotel/nonstarmarketingrecords/list',
    method: 'get',
    params: query
  })
}

// 查询非星级酒店营销记录详细
export function getNonstarmarketingrecords(id) {
  return request({
    url: '/hotel/nonstarmarketingrecords/' + id,
    method: 'get'
  })
}

// 新增非星级酒店营销记录
export function addNonstarmarketingrecords(data) {
  return request({
    url: '/hotel/nonstarmarketingrecords',
    method: 'post',
    data: data
  })
}

// 修改非星级酒店营销记录
export function updateNonstarmarketingrecords(data) {
  return request({
    url: '/hotel/nonstarmarketingrecords',
    method: 'put',
    data: data
  })
}

// 删除非星级酒店营销记录
export function delNonstarmarketingrecords(id) {
  return request({
    url: '/hotel/nonstarmarketingrecords/' + id,
    method: 'delete'
  })
}
