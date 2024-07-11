import request from '@/utils/request'

// 查询应急信息列表
export function listEmergencyinfo(query) {
  return request({
    url: '/emergency/emergencyinfo/list',
    method: 'get',
    params: query
  })
}

// 查询应急信息详细
export function getEmergencyinfo(id) {
  return request({
    url: '/emergency/emergencyinfo/' + id,
    method: 'get'
  })
}

// 新增应急信息
export function addEmergencyinfo(data) {
  return request({
    url: '/emergency/emergencyinfo',
    method: 'post',
    data: data
  })
}

// 修改应急信息
export function updateEmergencyinfo(data) {
  return request({
    url: '/emergency/emergencyinfo',
    method: 'put',
    data: data
  })
}

// 删除应急信息
export function delEmergencyinfo(id) {
  return request({
    url: '/emergency/emergencyinfo/' + id,
    method: 'delete'
  })
}

export function confirmEmergencyinfo(id) {
  return request({
    url: '/emergency/emergencyinfo/confirm/' + id,
    method: 'delete'
  })
}
