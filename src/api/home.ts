import reuest from "@/utils/request";
export const apiGetBlogDetail = (params?: object) => {
    return reuest.get(`/newApi/dingDing/api/auth/info?url=${params}`, params);
  };

  export const siteCont = (params?: object) => {
    return reuest.get(`/newApi//dingDing/site/count`, params);
  };