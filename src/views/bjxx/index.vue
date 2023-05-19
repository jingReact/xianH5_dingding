<script setup lang="ts">
import { reactive, ref, onMounted,getCurrentInstance, ComponentInternalInstance  } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { sitelistselect, siteInfo, alarmWarningCont, alarmWarningList } from '@/api/home'
const lists = ref([
  { 'projectName': '报警', color: '#FFFFFFFF', bgc: `linear-gradient(90deg, #FF6363 0%, #FFACAD 100%)`, zt: 11, tow: '报警中', three: '已失效' },
]);
const lists1 = ref([
  { 'projectName': '预警', color: '#FFFFFFFF', zxzt: '在线', bgc: `linear-gradient(90deg, #FFA071 0%, #FFC3A5 100%)`, zt: 22, tow: '预警中', three: '已失效' },
]);
const { appContext: { config: { globalProperties: { $dd } } } } = getCurrentInstance() as ComponentInternalInstance

const router = useRouter()
let loading = ref(true)
const columns = ref([]);
const fieldValue = ref();
const showPicker = ref(false);
let tabslist = ref(
  [
    { tittle: '报警', name: 1},
    { tittle: '预警', name: 2 },
  ]
);
//切换 下方位置
const onConfirm = ({ text, value }) => {
  showPicker.value = false;
  fieldValue.value = text
  ListParams.value.siteId=value
  alarmWarningListM()
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
}
let liShow = ref(1)
function liClick({name}) {
  // console.log(c,44);
  liShow.value = name+1
  ListParams.value.type = name+1
  alarmWarningListM()
}
//查询统计报警预警数据总数信息
let WarningCont = ref({})
const alarmWarningContM = async (p: string) => {
  let { data, code } = await alarmWarningCont(p)
  if (code == 200) {
    WarningCont.value = data
    console.log(WarningCont, 'WarningCont');
  }
}
let WarningList = ref([])
let ListParams = ref({siteId:'', pageNum: 1, pageSize: 10, type: 1, loading: true, finished: false, isLoading: false })
const alarmWarningListM = async (isRefresh) => {
  let { data, code,total } = await alarmWarningList(ListParams.value)
  if (code == 200) {
    WarningList.value = data
    if (isRefresh) {//下拉刷新
      WarningList.value = [...data, ...WarningList.value]
      ListParams.value.isLoading = false
    } else {//上拉加载
      if(total<  WarningList.value.length){ 
        WarningList.value = [...WarningList.value, ...data]
        ListParams.value.loading = false
      }else{ 
        ListParams.value.finished = true
      }
    }
    if (data.length === 0) {// 证明没有下一页数据了
      ListParams.value.finished = true
    }
  }
}
// 上拉加载
function onLoad() {
  ListParams.value.pageNum++
  alarmWarningListM()
}
// 下拉刷新
function onRefresh() {
  ListParams.value.pageNum++
  alarmWarningListM()
}
function infoClick(i){ 
  console.log(i,444);
  router.push({ path: '/bjxxInfo', query: i })

}
onMounted(() => {
  siteSelectM()
  alarmWarningContM()
  $dd.ready(function () {
    $dd.biz.navigation.setTitle({
    title : '站点报警预警信息',//控制标题文本，空字符串表示显示默认文本
    onSuccess : function(result) {
    },
    onFail : function(err) {}
});
      })
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
                <div>{{ WarningCont?.alarmNum }} </div>
                <div>{{ i.projectName }}</div>
              </div>
              <div class="one">
                <div>{{ WarningCont?.alarmingNum }} </div>
                <div>{{ i.tow }}</div>
              </div>

              <div class="one">
                <div>{{ WarningCont?.alarmExpireNum }} </div>
                <div>{{ i.three }}</div>
              </div>
            </div>
          </template>
        </van-card>
      </van-col>
    </van-row>
    <van-row gutter="20">
      <van-col v-for="i in lists1" span="24">
        <van-card :style="{ 'background': i.bgc, 'color': i.color }">
          <template #thumb>
            <div class="card">
              <div style="margin-left: 10px;" class="one">
                <div>{{ WarningCont?.warnNum }} </div>
                <div>{{ i.projectName }}</div>
              </div>
              <div class="one">
                <div>{{ WarningCont?.warningNum }} </div>
                <div>{{ i.tow }}</div>
              </div>

              <div class="one">
                <div>{{ WarningCont?.warnExpireNum }} </div>
                <div>{{ i.three }}</div>
              </div>
            </div>
          </template>
        </van-card>
      </van-col>
    </van-row>
    <van-tabs v-model:active="active" animated @click-tab="liClick">
      <van-tab v-for="i in tabslist" :title="i.tittle">
        <van-field v-model="fieldValue" is-link readonly label="站点列表" placeholder="选择站点下拉列表" @click="showPicker = true" />
    <van-pull-refresh v-model="ListParams.isLoading" :disabled="ListParams.finished" @refresh="onRefresh">
      <van-list v-model="loading" :finished="ListParams.finished" finished-text="没有更多了" @load="onLoad">
        <div class="bjswxx" :class="{ 'bgc': i?.warningState == 1 }" v-for="i in WarningList" @click="infoClick(i)">
          <div class="one" :class="{ 'bgc1': i?.warningState == 1 }">
            <div class="zd">
              <img src="../../assets/home/bjyj2.png" alt="">
              <div class="bold">{{ i?.siteName }}</div>
              <div class="bold">{{ i?.tt }}</div>
            </div>
            <span class="bjz" :style="{ 'color': i.warningState == 1 ? '#FF6E6EFF' : '#666666FF' }">
              {{ i.warningState == 1 ? '报警中' : '已失效' }}
            </span>
          </div>
          <div class="two">
            <div class="zd">
              <div>报警因子</div>
              <div class="bold">{{ i.codeProperty }}</div>
              <div>{{ i.currentValue }}</div>
              <div class="bold">1.6m</div>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
        </van-tab>
        </van-tabs>
        <van-popup v-model:show="showPicker" round position="bottom">
      <van-picker :columns="columns" @cancel="showPicker = false" @confirm="onConfirm" />
    </van-popup>
  </div>
</template>
<style lang="scss" scoped>
:deep .van-field__label {
    margin-left: 8px;
}
.van-pull-refresh {
    overflow-y: scroll;
    height: 400px;
}
.app-container {
  padding: 0 10px;
  .search {
    height: 100px;
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
.van-cell {
  height: 45px;
  line-height: 45px;
}
:deep .van-cell__right-icon {
  margin-top: 13px;
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

  .activeClss {
    color: #121212FF;
    border-bottom: 4.5px solid #121212FF;
  }
}
.bjswxx {
  width: 100%;
  height: 168px;
  border-radius: 10px;
  display: flex;
  font-size: 14px;
  flex-direction: column;
  background: #F6F6F6;
  margin: 10px 0;

  .one {
    height: 76px;
    width: 100%;
  }

  .one,
  .two {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .bjz,
  .two {
    margin: 0 15px;
  }
  .two {
    line-height: 76px;
  }
  .zd {
    display: flex;
    align-items: center;
    div {
      color: #666666FF;
    }
    img {
      width: 20px;
      width: 0.53333rem;
      margin: -12px -5PX -5px 10px;
    }
    .bold {
      margin: 0px 8px;
      color: #121212FF;
      font-weight: bold;
    }
  }
}
.bgc {
  background: #FFF3F3;
}
.bgc1 {
  background: #FFE8E8;
}
:deep(.van-tabs) {
  .van-tab--active {
    color: #278DFFFF;
    font-weight: bold;
    font-size: 20px;
  }

  .van-tabs__line {
    background-color: #278DFFFF;
  }
}
</style>