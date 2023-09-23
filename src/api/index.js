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


export function getHosts(params){
  return axios({
    url: '/hosts',
    method: 'get',
    params
  })
}

export function addHost(data){
  return axios({
    url: '/hosts',
    method: 'post',
    data
  })
}


export function editHost(data){
  return axios({
    url: '/hosts',
    method: 'patch',
    data
  })
}

export function deleteHost(params){
  return axios({
    url: '/hosts',
    method: 'delete',
    params
  })
}


export function getCommonParamTemplate(params){
  return axios({
    url: '/pt',
    method: 'get',
    params
  })
}

export function addCommonParamTemplate(data){
  return axios({
    url: '/pt',
    method: 'post',
    data
  })
}

export function editCommonParamTemplate(data){
  return axios({
    url: '/pt',
    method: 'patch',
    data
  })
}

export function deleteCommonParamTemplate(params){
  return axios({
    url: '/pt',
    method: 'delete',
    params
  })
}


export function getDomain(params){
  return axios({
    url: '/domain',
    method: 'get',
    params
  })
}


export function addDomain(data){
  return axios({
    url: '/domain',
    method: 'post',
    data
  })
}

export function editDomain(data){
  return axios({
    url: '/domain',
    method: 'patch',
    data
  })
}

export function deleteDomain(params){
  return axios({
    url: '/domain',
    method: 'delete',
    params
  })
}



export function getService(params){
  return axios({
    url: '/service',
    method: 'get',
    params: params
  })
}


export function addService(data){
  return axios({
    url: '/service',
    method: 'post',
    data
  })
}

export function editService(data){
  return axios({
    url: '/service',
    method: 'patch',
    data
  })
}

export function deleteService(params){
  return axios({
    url: '/service',
    method: 'delete',
    params
  })
}


export function getServiceTemplate(params){
  return axios({
    url: '/svc_temp',
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

