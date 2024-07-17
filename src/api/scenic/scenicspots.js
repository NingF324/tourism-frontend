import request from '@/utils/request'

// 查询景点信息管理列表
export function listScenicspots(query) {
  return request({
    url: '/scenic/scenicspots/list',
    method: 'get',
    params: query
  })
}

// 查询景点信息管理详细
export function getScenicspots(id) {
  return request({
    url: '/scenic/scenicspots/' + id,
    method: 'get'
  })
}

// 新增景点信息管理
export function addScenicspots(data) {
  return request({
    url: '/scenic/scenicspots',
    method: 'post',
    data: data
  })
}

// 修改景点信息管理
export function updateScenicspots(data) {
  return request({
    url: '/scenic/scenicspots',
    method: 'put',
    data: data
  })
}

// 删除景点信息管理
export function delScenicspots(id) {
  return request({
    url: '/scenic/scenicspots/' + id,
    method: 'delete'
  })
}
