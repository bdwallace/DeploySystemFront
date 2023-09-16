import axios from "@/utils/index";


// 后端API请求


// 登录请求
export function login(data){
  return axios({
    url: '/login',
    method: 'post',
    data
  })
}

export function logout(params){
  return axios({
    url: '/login',
    method: 'delete',
    params
  })
}

export function setPassword(data){
  return axios({
    url: '/login',
    method: 'patch',
    data
  })
}


export function getChartData(params){
  return axios({
    url: '/beindex',
    method: 'get',
    params
  })
}


export function getMenusByUser(params){
  return axios({
    url: '/dashboard',
    method: 'get',
    params
  })
}

export function getUsers(params){
  return axios({
    url: '/users',
    method: 'get',
    params
  })
}


export function addUsers(data){
  return axios({
    url: '/users',
    method: 'post',
    data
  })
}

export function editUsers(data){
  return axios({
    url: '/users',
    method: 'patch',
    data
  })
}

export function updateUser(params){
  return axios({
    url: '/users',
    method: 'put',
    params
  })
}


export function deleteUsers(params){
  return axios({
    url: '/users',
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

