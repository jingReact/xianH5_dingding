<script setup lang="ts">
// import list from './components/list.vue'
import { reactive, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getCurrentInstance } from 'vue'
import * as echarts from 'echarts';
import getAssetsFile from '../../utils/pub-use'
import { sitelistselect, siteSelectechat, siteInfo } from '@/api/home'
import { threeDats, nowDats } from "@/utils/time";
const { appContext: { config: { globalProperties: { $dd } } } } = getCurrentInstance()
const { query } = useRoute()
const lists = ref([
  { 'projectName': '报警', color: '#FFFFFFFF', bgc: `linear-gradient(90deg, #FF6363 0%, #FFACAD 100%)`, zt: 11, tow: '报警中', three: '已失效' },
  { 'projectName': '预警', color: '#FFFFFFFF', zxzt: '在线', bgc: `linear-gradient(90deg, #FFA071 0%, #FFC3A5 100%)`, zt: 22, tow: '预警中', three: '已失效' },
]);
let loading = ref(true)
const columns = ref([]);
const fieldValue = ref();
const showPicker = ref(false);
let isShow = ref([])
let projectInfo = ref({})
let queryParams = ref({ siteId: query.siteId, codeAscii: '', startTime: nowDats(), endTime: threeDats() })
const initMths = (p, m) => {
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
// const sbxq = (i) => {
//   $dd.ready(function () {
//     $dd.biz.util.datepicker({
//       format: 'yyyy-MM-dd',
//       value: new Date(),
//       onSuccess: ({ value }) => {
//         if (i == 1) {
//           queryParams.value.startTime = value
//         } else {
//           queryParams.value.endTime = value
//         }
//         siteSelectechatM(queryParams.value)
//       },
//       onFail: (err) => { }
//     })
//   });
// }
//切换 下方位置
const onConfirm = ({ text, value }) => {
  showPicker.value = false;
  fieldValue.value = text
  queryParams.value.codeAscii = value
  siteSelectechatM(queryParams.value)
};
//获取下拉因子列表
const siteSelectM = async (p: string) => {
  let { data } = await sitelistselect(p)
  console.log(data);
  data.forEach(i => {
    columns.value.push({ text: i.name, value: i.id })
  });
  let ar = data[0]
  fieldValue.value = ar.name
  queryParams.value.codeAscii = ar.id
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
const siteInfoM = async (p: string) => {
  loading.value = true
  let { data, code } = await siteInfo(p)
  if (code == 200) {
    projectInfo.value = data
    console.log(projectInfo, 888);
  }
}
let liShow = ref()
function liClick(c) {
  liShow.value = c
  console.log(c, 666);
}
onMounted(() => {
  siteSelectM(query.siteId)
  siteInfoM(query.siteId)

  $dd.ready(function () {
    $dd.device.geolocation.get({
      targetAccuracy: 200,
      coordinate: 1,
      withReGeocode: true,
      useCache: true, //默认是true，如果需要频繁获取地理位置，请设置false
      onSuccess: function (result) {
        /* 高德坐标 result 结构
        {
            longitude : Number,
            latitude : Number,
            accuracy : Number,
            address : String,
            province : String,
            city : String,
            district : String,
            road : String,
            netType : String,
            operatorType : String,
            locationType：1,
            errorMessage : String,
            errorCode : Number,
            isWifiEnabled : Boolean,
            isGpsEnabled : Boolean,
            isFromMock : Boolean,
            provider : wifi|lbs|gps,
            isMobileEnabled : Boolean
        }
        */
      },
      onFail: function (err) { }
    });
  });
})

</script>
<template>
  <div class="app-container">
    <van-row gutter="20">
      <van-col v-for="i in lists" span="24">
        <van-card :style="{ 'background': i.bgc, 'color': i.color }">
          <template #thumb>
            <div class="card">
              <div style="margin-left: 10px;" class="one">
                <div>{{ i.zt }} </div>
                <div>{{ i.projectName }}</div>
              </div>
              <div class="one">
                <div>{{ i.zt }} </div>
                <div>{{ i.tow }}</div>
              </div>

              <div class="one">
                <div>{{ i.zt }} </div>
                <div>{{ i.three }}</div>
              </div>
            </div>
          </template>
        </van-card>
      </van-col>
    </van-row>
    <ul class="ulcalss">
      <li @click="liClick(1)" :class="{ 'activeClss': liShow == 1 }">报警</li>
      <li @click="liClick(2)" :class="{ 'activeClss': liShow == 2 }">预警</li>
    </ul>
    <van-field v-model="fieldValue" is-link readonly label="站点列表" placeholder="选择站点下拉列表" @click="showPicker = true" />
    <van-popup v-model:show="showPicker" round position="bottom">
      <van-picker :columns="columns" @cancel="showPicker = false" @confirm="onConfirm" />
    </van-popup>
  <van-cell-group>
    <van-cell value="报警中">
  <template #title>
    <van-tag type="primary">标签</van-tag>
    <span class="custom-title">单元格</span>
  </template>
</van-cell>
</van-cell-group>

    
    <!-- <van-loading style="text-align: center;line-height: 150px;" size="24px" v-show="loading">加载中...</van-loading>
    <div v-show="!loading && isShow.length > 0" id="main" style="width: 400px ;height: 240px;"></div>
    <div v-show="loading || isShow.length == 0"
      style="width: 400px;color: #dfdedf ;height: 240px;text-align: center;font-size: 14px;line-height: 200px;">暂无数据</div> -->
  </div>
</template>

<style lang="scss" scoped>
.app-container {
  padding: 0 10px;

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
  margin: 5px 0px;
}

.card {
  display: flex;
  align-items: center;
  font-weight: bold;
  margin: 20px -10px;
  width: 100vw;
  justify-content: space-around;
  text-align: center;
  font-size: 16px;

  .one {
    div:nth-child(1) {
      font-size: 18px;
      font-weight: bold;
    }
  }
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

.van-tabs:deep .van-tabs__wrap {
  position: relative;
  /* top: 2.4rem; */
  width: 100vw;
  height: 1.17333rem;
  z-index: 99;
  background-color: #fff;
}

.ulcalss {
  display: flex;

  li {
    width: 60px;
    // text-align: left;
    font-size: 22px;
    font-weight: bold;
    color: #9F9F9FFF;
    text-align: center;

  }

  // border-bottom: 3px solid red;
  .activeClss {
    color: #121212FF;
    border-bottom: 2.5px solid #121212FF;
  }
}</style>