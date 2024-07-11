import request from '@/utils/request'

// 查询用户信息列表
export function listUserSys(query) {
  return request({
    url: '/userSys/userSys/list',
    method: 'get',
    params: query
  })
}

// 查询用户信息详细
export function getUserSys(userId) {
  return request({
    url: '/userSys/userSys/' + userId,
    method: 'get'
  })
}

// 新增用户信息
export function addUserSys(data) {
  return request({
    url: '/userSys/userSys',
    method: 'post',
    data: data
  })
}

// 修改用户信息
export function updateUserSys(data) {
  return request({
    url: '/userSys/userSys',
    method: 'put',
    data: data
  })
}

// 删除用户信息
export function delUserSys(userId) {
  return request({
    url: '/userSys/userSys/' + userId,
    method: 'delete'
  })
}
