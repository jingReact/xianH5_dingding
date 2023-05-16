import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vant from "./plugins/vant";
import "amfe-flexible";
import * as dd from 'dingtalk-jsapi'; // 此方式为整体加载，也可按需进行加载
import { apiGetBlogDetail } from '@/api/home'
import { initDingH5RemoteDebug } from "dingtalk-h5-remote-debug";
initDingH5RemoteDebug();
const apiGetBlogDetailM = async (p) => {
      let { code, data } = await apiGetBlogDetail(p)
      dd.config({
        agentId: '', // 必填，微应用ID
        corpId: '',//必填，企业ID
        timeStamp: '', // 必填，生成签名的时间戳
        nonceStr: '', // 必填，自定义固定字符串。
        signature: '', // 必填，签名
        type: 0 / 1,   //选填。0表示微应用的jsapi,1表示服务窗的jsapi；不填默认为0。该参数从dingtalk.js的0.8.3版本开始支持
        jsApiList: [
          'runtime.info',
          'biz.contact.choose',
          'device.notification.confirm',
          'device.notification.alert',
          'device.notification.prompt',
          'biz.ding.post',
          'biz.util.openLink',
          'runtime.permission.requestOperateAuthCode'
        ], // 必填，需要使用的jsapi列表，注意：不要带dd。
        ...data
      });
     
    }
    console.log(apiGetBlogDetailM('http://192.168.16.72:8099'), 999);
    apiGetBlogDetailM('http://192.168.16.72:8099')
const app = createApp(App);
 app.config.warnHandler = () => null
app.config.globalProperties.$dd = dd
// 按需注入vant组件
// console.log(initDingH5RemoteDebug(),882222228);
Object.values(vant).forEach((key) => app.use(key));

app.use(store).use(router).mount("#app");
