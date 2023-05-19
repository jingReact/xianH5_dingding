<script setup lang="ts">
import { getCurrentInstance, ComponentInternalInstance } from 'vue'
import { reactive, ref, onMounted } from 'vue'
import * as echarts from 'echarts';
import { useRouter, useRoute } from 'vue-router'
import { siterealdetial, siteSelect, sitehistory, sitehistoryecharts } from '@/api/home'
import { threeDats, nowDats } from "@/utils/time";
const { appContext: { config: { globalProperties: { $dd } } } } = getCurrentInstance() as ComponentInternalInstance
const router = useRouter()
const { query } = useRoute()
const lists = ref([
]);
const listDate = ref(
  [
    { tittle: '站点名称', data: 'siteName' },
    { tittle: '站点编号', data: 'siteNo' },
    { tittle: '当前状态', data: 'siteStatus' },
    { tittle: '监测时间', data: 'monitorTime' },
  ]
);
const listDate1 = ref(
  [
    { tittle: '站点名称', data: 'siteName' },
    { tittle: '站点编号', data: 'siteNo' },
    { tittle: '监测时间', data: 'monitorTime' },
    { tittle: '', data: 'currentValue' },
  ]
);
let tabslist = ref(
  [
    { tittle: '实时数据', data: 1 },
    { tittle: '历史数据', data: 2 },
  ]
);
let active = ref(0)
//点击设备详情
const sbxq = (i: any) => {
  console.log(i);
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
       loading.value = true
        sitehistoryM(false)
      },
      onFail: (err) => { }
    })
  });
}
//获取设备列表
const siteListMt = async () => {
  let { data } = await siterealdetial(query.siteId)
  lists.value = data
}
let ListParams = ref({ siteId: '', pageNum: 1, pageSize: 10, type: 1, loading: true, finished: false, isLoading: false })
// 上拉加载
function onLoad() {
  ListParams.value.pageNum++
  sitehistoryM(true)
}
// 下拉刷新
function onRefresh() {
  ListParams.value.pageNum++
  sitehistoryM(true)
}
//切换 下方位置
const fieldValue = ref();
const columns = ref([]);
const showPicker = ref(false);
const onConfirm = ({ text, value }) => {
  showPicker.value = false;
  fieldValue.value = text
  loading.value = true
  queryParams.value.codeAscii = value
  sitehistoryM(false)
  // sitehistoryechartsM(queryParams.value)
};
//获取下拉因子列表
const siteSelectM = async (p: any) => {
  let { data } = await siteSelect(p)
  console.log(data);
  data.forEach(i => {
    columns.value.push({ text: i.name, value: i.codeAscll })
  });
  let ar = data[0]
  fieldValue.value = ar.name
  queryParams.value.codeAscii = ar.codeAscll
  sitehistoryM(false)
  // sitehistoryechartsM(queryParams.value)

}
//echarts
let loading= ref(true)
const initMths = (p, m) => {
  loading.value = false
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
//监测数据-分页查询站点单个因子的历史监测信息列表
let historyList = ref([])
let isHistory = ref(false)
// startTime: nowDats()
let queryParams = ref({ pageSize: 10, pageNum: 1, siteId: query.siteId, codeAscii: '', startTime: '2012-02-12', endTime: threeDats() })
const sitehistoryM = async (isRefresh) => {
  let { data,total } = await sitehistory(queryParams.value)
  historyList.value = data
  isHistory.value = true
  loading.value = false
  if (isRefresh) {//下拉刷新
    isHistory.value = [...data, ...isHistory.value]
    ListParams.value.isLoading = false
  } else {//上拉加载
    if (total < isHistory.value.length) {
      isHistory.value = [...isHistory.value, ...data]
      ListParams.value.loading = false
    } else {
      ListParams.value.finished = true
    }
  }
  if (data.length === 0) {// 证明没有下一页数据了
    ListParams.value.finished = true
  }

}

const sitehistoryechartsM = async (p: object) => {
  let { data: { timeList, dataList }, code } = await sitehistoryecharts(p)
  if (code == 200) {
    initMths(timeList, dataList)
  }
}
function tabsClick ({name}) {
console.log(name,22);
if(name==1){ 
  loading.value = true
  sitehistoryechartsM(queryParams.value)
}

}
onMounted(() => {
  siteListMt(true)
  siteSelectM(query.siteId)
})
</script>
<template>
  <div class="app-container">
    <van-tabs v-model:active="active" animated >
      <van-tab v-for="i in tabslist" :title="i.tittle">
        <div v-if="active == 0">
          <van-card>
            <template #thumb>
              <van-cell-group v-for="i in listDate" span="24" style="margin: 10px 0;">
                <van-cell>
                  <template #title>
                    <div style="display: flex;justify-content: space-between;padding: 0 20px;">
                      <span class="bold-t">{{ i.tittle }}</span>
                      <span class="zxlx" v-if="i.data == 'siteStatus' && lists['siteStatus'] == 1">在线</span>
                      <span class="zxlx lx" v-if="i.data == 'siteStatus' && lists['siteStatus'] == 2">离线</span>
                      <span v-else> {{ lists[i.data] }}
                      </span>
                    </div>
                  </template>
                </van-cell>
              </van-cell-group>
              <van-cell-group v-for="k in lists['dataList']" span="24" style="margin: 10px 0;">
                <van-cell>
                  <template #title>
                    <div style="display: flex;justify-content: space-between;padding: 0 20px;">
                      <span class="bold-t">{{ k.codeProperty }}</span>
                      <span>{{ k.currentValue }}{{ k.unit }}</span>
                    </div>
                  </template>
                </van-cell>
              </van-cell-group>
            </template>
          </van-card>
        </div>

      </van-tab>
    </van-tabs>
    <div v-if="active == 1" class="two">
      <van-card>
        <template #thumb>
          <van-field v-model="fieldValue" is-link readonly label="因子" placeholder="选择站点类型" @click="showPicker = true" />
          <van-popup v-model:show="showPicker" round position="bottom">
            <van-picker :columns="columns" @cancel="showPicker = false" @confirm="onConfirm" />
          </van-popup>
          <van-cell-group class="time">
            <van-cell title="开始时间" is-link :label="queryParams.startTime" @click="sbxq(1)" />
          </van-cell-group>
          <van-cell-group class="time">
            <van-cell title="结束时间" is-link :label="queryParams.endTime" @click="sbxq(2)" />
          </van-cell-group>
        </template>
      </van-card>
      <van-tabs v-model:active="active1" @click-tab="tabsClick">
        <van-tab title="列表" style="border: red;height: 300px;width: 100%;overflow-y: scroll;overflow-x: hidden;">
          <van-pull-refresh v-model="ListParams.isLoading" :disabled="ListParams.finished" @refresh="onRefresh">
            <van-list  v-show="!loading" v-model="loading" :finished="ListParams.finished" finished-text="没有更多了" @load="onLoad">
              <van-card v-for="k in historyList" >
                <template #thumb>
                  <van-cell-group v-for="i in listDate1" span="24" style="margin: 10px 0;" v-if="isHistory">
                    <van-cell>
                      <template #title>
                        <div style="display: flex;justify-content: space-between;padding: 0 20px;">
                          <span v-if="i.tittle" class="bold-t">{{ i.tittle }}</span>
                          <span v-else class="bold-t">{{ k.codeProperty }}</span>
                          <span> {{ k[i.data] }}
                          </span>
                          <span v-if="i.tittle == ''"> {{ k.currentValue }}
                          </span>
                        </div>
                      </template>
                    </van-cell>
                  </van-cell-group>
                </template>
              </van-card>
            </van-list>
          </van-pull-refresh>
          <van-loading style="text-align: center;line-height: 150px;" size="24px" v-show="loading">加载中...</van-loading>
        </van-tab>
        <van-tab title="图表">
          <van-loading style="text-align: center;line-height: 150px;" size="24px" v-show="loading">加载中...</van-loading>
          <div v-show="!loading" id="main" style="width: 400px ;height: 240px;"></div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>
<style lang="scss" scoped>
:deep .van-cell {
  background: #fff;
  line-height: 50px;
}
.van-card {
  border-radius: 10px;
  margin: 20px 0px;
  width: 100%;
  height: 100%;

  :deep .van-card__thumb {
    height: auto;
    width: 100% !important;
    overflow: hidden;
    // background-color: red;
    line-height: 50px;
    box-shadow: 0px 2px 10px 0px rgba(18, 18, 18, 0.1);
  }
}

:deep .van-cell__right-icon {
  margin-top: 10px;
}

.app-container {
  padding: 0 10px;
  height: 100%;
  // overflow: hidden;

  .search {
    height: 50px;
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
}

.van-card {
  min-height: 98px;
  border-radius: 10px;

  :deep .van-card__thumb {
    width: 100% !important;
    padding: 10px;
  }
}

.status {
  text-align: right;
  position: absolute;
  bottom: 10px;
  width: 80px;
  margin-left: 80px;
}

.zxlx {
  margin: 5px 5px 0 0;
  display: inline-block;
  width: 60px;
  height: 25px;
  background: #D8F8CCFF;
  border-radius: 25px;
  line-height: 25px;
  text-align: center;
  color: #6BBE4EFF;
}

.lx {
  background: #F1F1F1;
  color: #666666FF;
}

.bold-t {
  font-weight: bold;
  font-size: 12px;
  padding-bottom: 2px;
}

:deep(.van-tabs) {
  .van-tab--active {
    color: #278DFFFF;
    font-weight: bold;
  }

  .van-tabs__line {
    background-color: #278DFFFF;
  }
}
:deep .two{ 
  .van-tab {
    background: linear-gradient(0deg, rgba(210,225,255,0) 0%, #D2E1FF 100%);
  }
  .van-tab--active {
    background:#fff;
    font-weight: bold;
  }
}
.zxlx {
  margin: 5px -5px 0 0;
  display: inline-block;
  width: 60px;
  height: 25px;
  background: #D8F8CCFF;
  border-radius: 25px;
  line-height: 25px;
  text-align: center;
  color: #6BBE4EFF;
}

.lx {
  background: #F1F1F1;
  color: #666666FF;
}</style>