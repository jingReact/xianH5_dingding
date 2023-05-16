<script setup lang="ts">
// import list from './components/list.vue'
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCurrentInstance } from 'vue'
import * as echarts from 'echarts';
import SvgIcon from '@/components/svgIcon'
import getAssetsFile from '../../utils/pub-use'
const {
  appContext: {
    config: { globalProperties: { $dd } }
  }
} = getCurrentInstance()
const router = useRouter()
let params = reactive({
  keyword: '',
  sortBy: '',
  type: '',
  isMobile: true,
})
const lists = ref([
  { 'projectName': '氨氮', color: '#4A9FFFFF', img: '/dy.png', bgc: `linear-gradient(0deg, #DEEEFF 0%, #E4F0FF 100%)`, zt: 11, ut: 'mg/L' },
  { 'projectName': '浊度', color: '#F55662FF', img: '/zd.png', zxzt: '在线', bgc: `linear-gradient(0deg, #FFD6D9 0%, #FFF3F4 100%)`, zt: 22, ut: '度' },
  { 'projectName': '流速', color: '#28C37CFF', img: '/sl.png', zxzt: '在线', bgc: `linear-gradient(0deg, #D1FFED 0%, #E8F7F1 100%)`, zt: 12, ut: 'm/s' },
  { 'projectName': '水位', color: '#A591E9FF', img: '/sw.png', zxzt: '在线', bgc: `linear-gradient(0deg, #C8BCF6 0%, #E6E3F4 100%)`, zt: 20, ut: 'm' },
]);
const initMths = () => {
  var myChart = echarts.init(document.getElementById('main'));
  // 绘制图表
  myChart.setOption({
    title: {
      // text: 'ECharts 入门示例'
    },
    tooltip: {},
    xAxis: {
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', , '12月']
    },
    yAxis: {},
    series: [
      {
        name: '单位',
        type: 'line',
        data: [5, 20, 36, 10, 10, 20, 5, 20, 36, 10, 10, 20, 10, 10, 20]
      }
    ]
  });
}
//点击设备详情
const sbxq = (i) => {
  console.log(i, 21122);

  $dd.ready(function () {
    $dd.biz.util.datepicker({
      format: 'yyyy-MM-dd',//注意：format只支持android系统规范，即2015-03-31格式为yyyy-MM-dd
      value: '2015-04-17', //默认显示日期
      onSuccess: function (result) {
      },
      onFail: function (err) { }
    })

    //     $dd.biz.map.view({
    // 	latitude: 39.903578,
    // 	longitude: 116.473565,
    // 	title: '北京国家广告产业园',
    // 	onSuccess : function(res) {
    // 		// 调用成功时回调
    // 		console.log(res)
    // 	},
    // 	onFail : function(err) {
    // 		// 调用失败时回调
    // 		console.log(err)
    // 	}
    // });
  });
}
// const onClickLeft = () => {
//   router.go(-1)
// }
// dd.ready(function() {
// });
//切换 下方位置
let selectedValues = ref(['ad'])
const columns = [
  { text: '氨氮', value: 'ad' },
  { text: '浊度', value: 'zd' },
  { text: '流速', value: 'ls' },
  { text: '水位', value: 'sw' },
];
const fieldValue = ref('氨氮');
const showPicker = ref(false);

const onConfirm = ({ selectedOptions }) => {
  showPicker.value = false;
  fieldValue.value = selectedOptions[0].text;
};
onMounted(() => {
  initMths()
})
</script>
<template>
  <div class="app-container">
    <!-- <van-nav-bar
      title="站点名称"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    /> -->

    <van-cell-group>
      <van-cell title="站点地址" value="我是站点地址我是站点地址" />
    </van-cell-group>
    <van-cell-group>
      <van-cell title="站点状态">
        <template #right-icon>
          <div style="color: #28C37CFF;">在线</div>
        </template>
      </van-cell>
    </van-cell-group>
    <van-row gutter="20">
      <van-col v-for="i in lists" span="12" @click="sbxq(i)">
        <van-card :style="{ 'background': i.bgc, 'color': i.color }">
          <template #thumb>
            <div class="card">
              <img :src="getAssetsFile(i.img)" />
              <div style="margin-left: 10px;">
                <div>{{ i.projectName }}</div>
                <div>{{ i.zt }} <span style="font-size: 11px;">{{ i.ut }}</span></div>

              </div>
            </div>
          </template>
        </van-card>
      </van-col>
    </van-row>
    <!-- 搜索列 -->
    <van-field v-model="fieldValue" is-link readonly label="类型" placeholder="选择站点类型" @click="showPicker = true" />
    <van-popup v-model:show="showPicker" round position="bottom">
      <van-picker :columns="columns" @cancel="showPicker = false" @confirm="onConfirm" />
    </van-popup>
    <van-cell-group class="time">
      <van-cell title="开始时间" is-link label="2020-04-14 00:00:00" @click="sbxq" />
    </van-cell-group>
    <van-cell-group class="time">
      <van-cell title="结束时间" is-link label="2020-04-14 00:00:00" @click="sbxq" />
    </van-cell-group>

    <div id="main" style="width: 400px ;height: 240px;"></div>
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
}</style>