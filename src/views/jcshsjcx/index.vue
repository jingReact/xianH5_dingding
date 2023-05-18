<script setup lang="ts">
import LabelSelect from './components/labelSelect.vue'
import { reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import SvgIcon from '@/components/svgIcon'
import { siterealdetial } from '@/api/home'
const router = useRouter()
const { query } = useRoute()
let keyword = ref()
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
let tabslist = ref(
  [
    { tittle: '实时数据', data: 1},
    { tittle: '历史数据', data: 2 },
  ]
);
let active=ref(1)
//点击设备详情
const sbxq = (i:any) => {
  console.log(i);
  router.push({ path: '/sbxxInfo', query: i })
}
//获取设备列表
const siteListMt = async (isRefresh:any) => {
  let { data } = await siterealdetial(query.siteId)
  lists.value = data
  // if (isRefresh) {//下拉刷新
  //   lists.value = [...data, ...lists.value]
  //   ListParams.value.isLoading = false
  // } else {//上拉加载
  //   if (total < lists.value.length) {
  //     lists.value = [...lists.value, ...data]
  //     ListParams.value.loading = false
  //   } else {
  //     ListParams.value.finished = true
  //   }
  // }
  // if (data.length === 0) {// 证明没有下一页数据了
  //   ListParams.value.finished = true
  // }
}
function onSearch() {
  siteListMt(true)
}
let ListParams = ref({ siteId: '', pageNum: 1, pageSize: 10, type: 1, loading: true, finished: false, isLoading: false })
// 上拉加载
function onLoad() {
  ListParams.value.pageNum++
  siteListMt(true)
}
// 下拉刷新
// function onRefresh() {
//   ListParams.value.pageNum++
//   siteListMt(true)
// }
// function tabsClick(i) {
//   console.log(i, 111);
// }
onMounted(() => {
  siteListMt(true)
})
</script>
<template>
  <div class="app-container">
    <van-tabs v-model:active="active" animated @click-tab="tabsClick">
      <van-tab v-for="i in tabslist" :title="i.tittle">
        <!-- <van-pull-refresh v-model="ListParams.isLoading" :disabled="ListParams.finished" @refresh="onRefresh">
          <van-list v-model="loading" :finished="ListParams.finished" finished-text="没有更多了" @load="onLoad"> -->
            <van-cell-group v-for="i in listDate" span="24" @click="sbxq(i)" style="margin: 10px 0;">
              <van-cell>
                <template #title>
                  <div style="display: flex;justify-content: space-between;padding: 0 20px;">
                    <span v-if="i.data == 'siteName'" class="bold-t" style="display: flex;align-items: center;"> 
                      <img style="height: 18px;"
                      v-if="lists['siteStatus'] == 1"
                        src="../../assets/images/zhandian.png" alt=""> 
                        <img style="height: 18px;"
                        v-else
                        src="../../assets/images/sblx.png" alt=""> 

                        <span style="padding: 0 5px;"> {{ lists['siteName'] }}</span>
                       </span>
                    <span v-else class="bold-t">{{ i.tittle }}</span>
                    <span> <span v-if="i.data != 'siteName'"> {{ lists[i.data] }} </span>
                      <span class="zxlx" v-if="i.data == 'siteName' && lists['siteStatus'] == 1">在线</span>
                      <span class="zxlx lx" v-if="i.data == 'siteName' && lists['siteStatus'] == 2">离线</span>
                    </span>
                  </div>
                </template>
              </van-cell>
            </van-cell-group>
            <van-cell-group v-for="k in lists['dataList']" span="24" @click="sbxq(i)" style="margin: 10px 0;">
              <van-cell>
                <template #title>
                  <div style="display: flex;justify-content: space-between;padding: 0 20px;">
                    <span class="bold-t">{{ k.codeProperty }}</span>
                    <span>{{ k.currentValue }}{{ k.unit }}</span>
                  </div>
                </template>
              </van-cell>
            </van-cell-group>
          <!-- </van-list> -->
        <!-- </van-pull-refresh> -->
      </van-tab>
    </van-tabs>

  </div>
</template>
<style lang="scss" scoped>
.app-container {
  padding: 0 10px;
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
  margin: 20px 0px;

  :deep .van-card__thumb {
    width: 100% !important;
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