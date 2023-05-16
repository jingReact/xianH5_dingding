import axios from "@/utils/request";
export const apiGetBlogDetail = (params?: object) => {
    return axios.get(`/newApi/dingDing/api/auth/info?url=${params}`, params);
  };