

import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Tabbar from "../components/tabbar";
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
    console.log( to,999);
    document.title = to.meta.title as string
  }
});

export default router;
