/*
 * @Author: liyingjing ll47991367@qq.com
 * @Date: 2023-05-11 19:03:37
 * @LastEditors: liyingjing ll47991367@qq.com
 * @LastEditTime: 2023-05-17 19:31:10
 * @FilePath: \vue3-vite2-ts-blog-h5\src\router\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Tabbar from "../components/tabbar";
// 先识别所有的views/文件夹name/*.vue文件
// 这里限制性很高，只有路径为/views/文件夹name/*.vue，的文件才能背识别
const modules = import.meta.glob("../views/*/*.vue");
const loadComponent = (component: string) =>
  modules[`../views/${component}.vue`];

const routes: Array<RouteRecordRaw> = [
  {
    path: "/home",
    component: Tabbar,
    children: [
      {
        path: "/home",
        component: loadComponent("home/index"),
        meta: {
          title: "首页",
        },
      },
      {
        path: "/sbxx",
        component: loadComponent("sbxx/index"),
        meta: {
          title: "设备信息",
        },
      },
      {
        path: "/sbxxList",
        component: loadComponent("sbxxList/index"),
        meta: {
          title: "设备信息",
        },
      },

      {
        path: "/sbxxInfo",
        component: loadComponent("sbxxInfo/index"),
        meta: {
          title: "设备信息详情",
        },
      },
      {
        path: "/bjxx",
        component: loadComponent("bjxx/index"),
        meta: {
          title: "报警预警信息",
        },
      },
      {
        path: "/bjxxInfo",
        component: loadComponent("bjxxInfo/index"),
        meta: {
          title: "报警预警信息详情",
        },
      },
      {
        path: "/jcshcx",
        component: loadComponent("jcshcx/index"),
        meta: {
          title: "监测数据查询",
        },
      },
      {
        path: "/jcshsjcx",
        component: loadComponent("jcshsjcx/index"),
        meta: {
          title: "检测数据查询",
        },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/home",
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to) => {
  if (to.meta && to.meta.title) {
    document.title = to.meta.title as string;
  }
});

export default router;
