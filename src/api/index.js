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

export function downloadCert(params){
  return axios({
    url: '/download',
    method: 'get',
    responseType: "blob",
    params
  })
}




export function getProcess(params){
  return axios({
    url: '/process',
    method: 'get',
    params: params
  })
}


export function addProcess(data){
  return axios({
    url: '/process',
    method: 'post',
    data
  })
}

export function deleteProcess(params){
  return axios({
    url: '/process',
    method: 'delete',
    params
  })
}

export function getTagList(params){
  return axios({
    url: '/taglist',
    method: 'get',
    params
  })
}



export function svcCheck(params){
  return axios({
    url: '/svc_check',
    method: 'get',
    params: params
  })
}

export function dockerCheck(data){
  return axios({
    url: '/docker_check',
    method: 'post',
    data
  })
}

export function commitTag(data){
  return axios({
    url: '/deploy',
    method: 'patch',
    data
  })
}

export function getLog(params){
  return axios({
    url: '/deploy',
    method: 'get',
    params
  })
}


export function commitDeployTask(data){
  return axios({
    url: '/deploy',
    method: 'post',
    data
  })
}


export function serviceOption(data){
  return axios({
    url: '/option',
    method: 'post',
    data
  })
}


export function lineChange(data){
  return axios({
    url: '/option',
    method: 'patch',
    data
  })
}
