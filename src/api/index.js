import axios from "@/utils/index";


// 后端API请求


// 登录请求
export function getProject(params){
  return axios({
    url: '/project',
    method: 'get',
    params
  })
}

export function addProject(data){
  return axios({
    url: '/project',
    method: 'post',
    data
  })
}

export function editProject(params){
  return axios({
    url: '/project',
    method: 'put',
    params
  })
}


export function deleteProject(params){
  return axios({
    url: '/project',
    method: 'delete',
    params
  })
}


export function getPlatform(params){
  return axios({
    url: '/platform',
    method: 'get',
    params
  })
}



export function addPlatform(data){
  return axios({
    url: '/platform',
    method: 'post',
    data
  })
}



export function editPlatform(data){
  return axios({
    url: '/platform/',
    method: 'patch',
    data
  })
}


export function deletePlatform(params){
  return axios({
    url: '/platform',
    method: 'delete',
    params
  })
}


export function getDepartment(params){
  return axios({
    url: '/department',
    method: 'get',
    params
  })
}

export function addDepartment(data){
  return axios({
    url: '/department',
    method: 'post',
    data
  })
}


export function getRoles(params){
  return axios({
    url: '/roles',
    method: 'get',
    params
  })
}


export function addRoles(data){
  return axios({
    url: '/roles',
    method: 'post',
    data
  })
}

export function editRoles(data){
  return axios({
    url: '/roles',
    method: 'patch',
    data
  })
}

export function deleteRoles(params){
  return axios({
    url: '/roles',
    method: 'delete',
    params
  })
}


export function getGroups(params){
  return axios({
    url: '/groups',
    method: 'get',
    params
  })
}


export function addGroups(data){
  return axios({
    url: '/groups',
    method: 'post',
    data
  })
}

export function editGroups(data){
  return axios({
    url: '/groups',
    method: 'patch',
    data
  })
}

export function deleteGroups(params){
  return axios({
    url: '/groups',
    method: 'delete',
    params
  })
}



export function getMenus(params){
  return axios({
    url: '/menus',
    method: 'get',
    params: params
  })
}


export function addMenus(data){
  return axios({
    url: '/menus',
    method: 'post',
    data
  })
}

export function editMenus(params){
  return axios({
    url: '/menus',
    method: 'put',
    params
  })
}

export function deleteMenus(params){
  return axios({
    url: '/menus',
    method: 'delete',
    params
  })
}


export function getMenusGroup(params){
  return axios({
    url: '/menu_group',
    method: 'get',
    params: params
  })
}

export function addMenusGroup(data){
  return axios({
    url: '/menu_group',
    method: 'post',
    data
  })
}




export function getApis(params){
  return axios({
    url: '/apis',
    method: 'get',
    params: params
  })
}


export function addApis(data){
  return axios({
    url: '/apis',
    method: 'post',
    data
  })
}

export function editApis(params){
  return axios({
    url: '/apis',
    method: 'put',
    params
  })
}

export function deleteApis(params){
  return axios({
    url: '/apis',
    method: 'delete',
    params
  })
}


export function getApiGroup(params){
  return axios({
    url: '/api_group',
    method: 'get',
    params: params
  })
}

export function addApiGroup(data){
  return axios({
    url: '/api_group',
    method: 'post',
    data
  })
}

export function getLogs(params){
  return axios({
    url: '/logs',
    method: 'get',
    params: params
  })
}

