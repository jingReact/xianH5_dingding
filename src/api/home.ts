import reuest from "@/utils/request";
export const apiGetBlogDetail = (params?: object) => {
    return reuest.get(`/newApi/dingDing/api/auth/info?url=${params}`, params);
  };

  export const siteCont = (params?: object) => {
    return reuest.get(`/newApi//dingDing/site/count`, params);
  };

  export const siteList = (params?: string) => {
    return reuest.get(`/newApi/dingDing/site/by/type/list`, params);
  };

  export const siteSelect = (params?: string) => {
    return reuest.get(`/newApi/dingDing/site/select/${params}`);
  };

  export const siteSelectechat = (params?: object) => {
    return reuest.get(`/newApi/dingDing/site/data/echat/codeAscii`,params);
  };

  
  export const siteInfo = (params?: string) => {
    return reuest.get(`/newApi/dingDing/site/info/${params}`);
  };