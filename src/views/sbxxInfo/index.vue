<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import {useRoute } from 'vue-router'
import { getCurrentInstance ,ComponentInternalInstance} from 'vue'
import * as echarts from 'echarts';
import getAssetsFile from '../../utils/pub-use'
import { siteSelect, siteSelectechat, siteInfo } from '@/api/home'
import { threeDats, nowDats } from "@/utils/time";
import Gmap from '@/components/Gmap.vue'

const { appContext: { config: { globalProperties: { $dd } }}} = getCurrentInstance() as ComponentInternalInstance
const { query } = useRoute()
const lists = ref([
  {color: '#4A9FFFFF', img: '/dy.png', bgc: `linear-gradient(0deg, #DEEEFF 0%, #E4F0FF 100%)`, },
  { color: '#F55662FF', img: '/zd.png', zxzt: '在线', bgc: `linear-gradient(0deg, #FFD6D9 0%, #FFF3F4 100%)`,  },
  {  color: '#28C37CFF', img: '/sl.png', zxzt: '在线', bgc: `linear-gradient(0deg, #D1FFED 0%, #E8F7F1 100%)`,  },
  {color: '#4A9FFFFF', img: '/dy.png', bgc: `linear-gradient(0deg, #DEEEFF 0%, #E4F0FF 100%)`, },
  {  color: '#28C37CFF', img: '/sl.png', zxzt: '在线', bgc: `linear-gradient(0deg, #D1FFED 0%, #E8F7F1 100%)`,  },
  {  color: '#28C37CFF', img: '/sl.png', zxzt: '在线', bgc: `linear-gradient(0deg, #D1FFED 0%, #E8F7F1 100%)`,  },
  { color: '#F55662FF', img: '/zd.png', zxzt: '在线', bgc: `linear-gradient(0deg, #FFD6D9 0%, #FFF3F4 100%)`,  },
  {color: '#4A9FFFFF', img: '/dy.png', bgc: `linear-gradient(0deg, #DEEEFF 0%, #E4F0FF 100%)`, },
  {  color: '#A591E9FF', img: '/sw.png', zxzt: '在线', bgc: `linear-gradient(0deg, #C8BCF6 0%, #E6E3F4 100%)`, },
]);
let loading= ref(true)
const columns = ref([]);
const fieldValue = ref();
const showPicker = ref(false);
let isShow = ref([])
let projectInfo = ref({})
let queryParams= ref({ siteId: query.siteId, codeAscii: '', startTime: nowDats(), endTime: threeDats() })
const initMths = (p,m) => {
  loading.value = false
  isShow.value = p
  let xDate = p
  let yDate = m
  var myChart = echarts.init(document.getElementById('main'));
  // 绘制图表
  myChart.setOption({
    title: {
      // text: 'ECharts 入门示例'
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
//点击时间
const sbxq = (i:any) => {
  $dd.ready(function () {
    $dd.biz.util.datepicker({
      format: 'yyyy-MM-dd',
      value: new Date(),
      onSuccess: ({ value }) => {
        if (i == 1) {
          queryParams.value.startTime = value
        } else {
          queryParams.value.endTime = value
        }
        siteSelectechatM(queryParams.value)
      },
      onFail: (err) => { }
    })
  });
}
//切换 下方位置
const onConfirm = ({ text, value }) => {
  showPicker.value = false;
  fieldValue.value = text
  queryParams.value.codeAscii = value
  siteSelectechatM(queryParams.value)
};
//获取下拉因子列表
const siteSelectM = async (p: any) => {
  let { data } = await siteSelect(p)
  console.log(data);
  data.forEach( i => {
    columns.value.push({ text: i.name, value: i.codeAscll })
  });
  let ar = data[0]
  fieldValue.value = ar.name
  queryParams.value.codeAscii = ar.codeAscll
  siteSelectechatM(queryParams.value)
}
//获取下拉因子列表echarts
const siteSelectechatM = async (p: object) => {
  loading.value = true
  let { data: { timeList, dataList }, code } = await siteSelectechat(p)
  if (code == 200) {
    initMths(timeList, dataList)
  }
}
//获取站点信息
let mapShow=ref(false)

const siteInfoM = async (p: any) => {
  loading.value = true
  let { data, code } = await siteInfo(p)
  if (code == 200) {
    projectInfo.value = data
    console.log(projectInfo, 888);
    mapShow.value=true
  }
}
onMounted(() => {
  siteSelectM(query.siteId)
  siteInfoM(query.siteId)
})
</script>
<template>
  <Gmap :data="projectInfo" v-if="mapShow"></Gmap>
  <div class="app-container">
    <van-cell-group>
      <van-cell title="站点地址" :value="projectInfo['siteAddress']" />
    </van-cell-group>
    <van-cell-group>
      <van-cell title="站点状态">
        <template #right-icon>
          <div v-if="projectInfo['siteStatus'] == 1" style="color: #28C37CFF;">在线</div>
          <div v-else style="color: #dfdedf;">离线</div>
        </template>
      </van-cell>
    </van-cell-group>
    <van-row gutter="20">
      <van-col v-for="i,index in projectInfo['dataList']" span="12">
        <van-card :style="{ 'background': lists[index].bgc, 'color': lists[index].color }">
          <template #thumb>
            <div class="card">
              <img style="padding: 0 3px;" :src="getAssetsFile(lists[index].img)" />
              <div style="margin-left: 10px;">
                <div>{{ i.codeProperty }}</div>
                <div>{{ i.currentValue }} <span style="font-size: 11px;">{{ i.unit }}</span></div>
              </div>
            </div>
          </template>
        </van-card>
      </van-col>
    </van-row>
    <van-field v-model="fieldValue" is-link readonly label="类型" placeholder="选择站点类型" @click="showPicker = true" />
    <van-popup v-model:show="showPicker" round position="bottom">
      <van-picker :columns="columns" @cancel="showPicker = false" @confirm="onConfirm" />
    </van-popup>
    <van-cell-group class="time">
      <van-cell title="开始时间" is-link :label="queryParams.startTime" @click="sbxq(1)" />
    </van-cell-group>
    <van-cell-group class="time">
      <van-cell title="结束时间" is-link :label="queryParams.endTime" @click="sbxq(2)" />
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
  height: calc(100% - 200px);
  .search {
    height: 100px;
  }

  .van-search {
    padding: 12px 16px 0;
    position: fixed;
    top: 0;
    width: 100vw;
    height: 46px;
    z-index: 99;
    background-color: #fff;

    :deep(.van-search__content) {
      border-radius: 16px;

      input {
        color: $strongFontColor;

        &::placeholder {
          color: $disableFontColor;
        }
      }
    }
  }

  :deep(.van-tabs) {
    .van-tabs__wrap {
      position: fixed;
      top: 90px;
      width: 100vw;
      height: 44px;
      z-index: 99;
      background-color: #fff;

      &::after {
        @include borderZeroPointFive();
      }
    }
  }
}

.van-card {
  height: 80px;
  box-shadow: 0px 2px 30px 0px rgba(18, 18, 18, 0.1);
  border-radius: 10px;
  margin: 10px 0px;
}

.card {
  display: flex;
  align-items: center;
  font-weight: bold;
  margin-top: 20px;
  width: 330px;
}

.status {
  text-align: right;
  position: absolute;
  bottom: 10px;
  width: 80px;
  margin-left: 80px;
}

.van-cell {
  height: 45px;
  line-height: 45px;
}

:deep .van-cell__right-icon {
  margin-top: 13px;
}

.time {
  .van-cell {
    height: 65px;
  }

}
</style>