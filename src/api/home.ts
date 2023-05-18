import reuest from "@/utils/request";
export const apiGetBlogDetail = (params?: object) => {
  return reuest.get(`/newApi/dingDing/api/auth/info?url=${params}`, params);
};

export const siteCont = (params?: object) => {
  return reuest.get(`/newApi//dingDing/site/count`, params);
};

export const siteList = (params?: any) => {
  return reuest.get(`/newApi/dingDing/site/by/type/list`, params);
};

export const siteSelect = (params?: string) => {
  return reuest.get(`/newApi/dingDing/site/select/${params}`);
};

export const siteSelectechat = (params?: object) => {
  return reuest.get(`/newApi/dingDing/site/data/echat/codeAscii`, params);
};


export const siteInfo = (params?: string) => {
  return reuest.get(`/newApi/dingDing/site/info/${params}`);
};

export const sitelistselect = () => {
  return reuest.get(`/newApi/dingDing/site/list/select`);
};


export const alarmWarningCont = () => {
  return reuest.get(`/newApi/dingDing/alarmWarning/count`);
};

export const alarmWarningList = (params?: object) => {
  return reuest.get(`/newApi/dingDing/alarmWarning/list`,params);
};


export const alarmWarningInfo = (params?: string) => {
  return reuest.get(`/newApi/dingDing/alarmWarning/info/${params}`);
};

export const sitemonitor = (params?: string) => {
  return reuest.get(`/newApi/dingDing/site/monitor/data/${params}`);
};

export const siterealdata = () => {
  return reuest.get(`/newApi/dingDing/site/real/data/list`);
};


export const siterealdetial = (params?: string) => {
  return reuest.get(`/newApi/dingDing/site/real/data/${params}`);
};

export const sitehistory = (params?: object) => {
  return reuest.get(`/newApi/dingDing/site/history/data/list`,params);
};

export const sitehistoryecharts = (params?: object) => {
  return reuest.get(`/newApi/dingDing/site/history/data/echarts`,params);
};