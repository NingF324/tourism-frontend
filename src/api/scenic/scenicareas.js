import request from '@/utils/request'

// 查询景区信息列表
export function listScenicareas(query) {
  return request({
    url: '/scenic/scenicareas/list',
    method: 'get',
    params: query
  })
}

// 查询景区信息详细
export function getScenicareas(id) {
  return request({
    url: '/scenic/scenicareas/' + id,
    method: 'get'
  })
}

// 新增景区信息
export function addScenicareas(data) {
  return request({
    url: '/scenic/scenicareas',
    method: 'post',
    data: data
  })
}

// 修改景区信息
export function updateScenicareas(data) {
  return request({
    url: '/scenic/scenicareas',
    method: 'put',
    data: data
  })
}

// 删除景区信息
export function delScenicareas(id) {
  return request({
    url: '/scenic/scenicareas/' + id,
    method: 'delete'
  })
}
