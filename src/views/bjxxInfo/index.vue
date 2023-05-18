<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getCurrentInstance } from 'vue'
import * as echarts from 'echarts';
import { siteSelect, sitemonitor, alarmWarningInfo } from '@/api/home'
import Gmap from '@/components/Gmap.vue'
const { appContext: { config: { globalProperties: { $dd } } } } = getCurrentInstance()
const { query } = useRoute()
const lists = ref([
  { tittle: '站点名称', data: 'siteName' },
  { tittle: '监测因子', data: 'codeProperty' },
  { tittle: '因子当前数值', data: 'currentValue' },
  { tittle: '报警阈值', data: 'warningValue' },
  { tittle: '运算符', data: 'compareWayDesc' },
  { tittle: '开始时间', data: 'tt' },
  { tittle: '结束时间', data: 'endTime' },
]);
let loading = ref(true)
let isShow = ref([])
let projectInfo = ref({})
const initMths = (p, m) => {
  loading.value = false
  isShow.value = p
  let xDate = p
  let yDate = m
  var myChart = echarts.init(document.getElementById('main'));
  // 绘制图表
  myChart.setOption({
    title: {
    },
    tooltip: {},
    xAxis: {
      data: xDate
    },
    yAxis: {},
    dataZoom: [
      {
        "height": 14,
        type: "slider",//slider表示有滑动块的，
        show: true,
        xAxisIndex: [0],//表示x轴折叠
        start: 1,//数据窗口范围的起始百分比,表示1%
        end: 35,//数据窗口范围的结束百分比,表示35%坐标
        bottom: "20",
      },
    ],
    series: [
      {
        name: yDate.unit,
        type: 'line',
        data: yDate.valList
      }
    ]
  });
}
//获取下拉因子列表echarts
const siteSelectechatM = async (p: string) => {
  loading.value = true
  let { data: { timeList, dataList }, code } = await sitemonitor(p)
  if (code == 200) {
    initMths(timeList, dataList)
  }
}
//获取站点信息
let mapShow = ref(false)
const siteInfoM = async (p: string) => {
  loading.value = true
  let { data, code } = await alarmWarningInfo(p)
  if (code == 200) {
    projectInfo.value = data
    console.log(projectInfo.value, 8888000);
    mapShow.value = true
    siteSelectechatM(query.logId)
  }
}
onMounted(() => {
  siteInfoM(query.logId)
})
</script>
<template>
  <Gmap :data="projectInfo" v-if="mapShow"></Gmap>
  <div class="app-container">
    <van-cell-group v-for="i in lists">
      <van-cell :title="i.tittle">
        <div bindtap="open">{{ projectInfo[i.data] }}
          <span :class="{ 'pclass': true, 'nopclass': projectInfo.warningState == 2 }"
            v-if="i.data == 'siteName'">{{ projectInfo.warningState == 1 ? '报警中' : '预警中' }}</span>
        </div>

      </van-cell>
    </van-cell-group>
    <van-loading style="text-align: center;line-height: 150px;" size="24px" v-show="loading">加载中...</van-loading>
    <div v-show="!loading && isShow.length > 0" id="main" style="width: 400px ;height: 240px;"></div>
    <div v-show="loading || isShow.length == 0"
      style="width: 400px;color: #dfdedf ;height: 240px;text-align: center;font-size: 14px;line-height: 200px;">暂无数据</div>
  </div>
</template>

<style lang="scss" scoped>
.app-container {
  padding: 200px 10px;
}

.van-card {
  height: 80px;
  box-shadow: 0px 2px 30px 0px rgba(18, 18, 18, 0.1);
  border-radius: 10px;
  margin: 10px 0px;
}



.van-cell {
  height: 45px;
  line-height: 45px;
}

:deep .van-cell__right-icon {
  margin-top: 13px;
}

.pclass {
  display: inline-block;
  width: 63px;
  height: 30px;
  color: #FF6564;
  background: #FFDCDC;
  border-radius: 15px;
  line-height: 30px;
  text-align: center;
}

.nopclass {
  color: #000;
  background: #F6F6F6;

}
.custom-title{ 
  font-size: 22px;
  font-weight: bold;
}
.zdimg{
  color: red;

}

</style>