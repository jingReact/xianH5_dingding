<script setup lang="ts">
import LabelSelect from './components/labelSelect.vue'
import { reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import SvgIcon from '@/components/svgIcon'
import { siterealdata } from '@/api/home'
const router = useRouter()
const { query } = useRoute()
let keyword = ref()
const lists = ref([
]);
const listDate = ref(
  [
    { tittle: '站点编号', data: 'siteNo' },
    { tittle: '监测时间', data: 'siteName' },
  ]
);
//点击设备详情
const sbxq = (i) => {
  console.log(i);
  router.push({ path: '/jcshsjcx', query: i })
}
//获取设备列表
const siteListMt = async (isRefresh) => {
  let { data, total } = await siterealdata({ typeId: query.typeId, keyword: keyword.value })
  lists.value = data
  if (isRefresh) {//下拉刷新
    lists.value = [...data, ...lists.value]
    ListParams.value.isLoading = false
  } else {//上拉加载
    if (total < lists.value.length) {
      lists.value = [...lists.value, ...data]
      ListParams.value.loading = false
    } else {
      ListParams.value.finished = true
    }
  }
  if (data.length === 0) {// 证明没有下一页数据了
    ListParams.value.finished = true
  }
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
function onRefresh() {
  ListParams.value.pageNum++
  siteListMt(true)
}
onMounted(() => {
  siteListMt(true)
})
</script>
<template>
  <div class="app-container">
    <div class="search">
      <form action="/">
        <van-search v-model="keyword" input-align="center" :clearable="false" :show-action="!!keyword"
          placeholder="请输入站点名称" @search="onSearch" @cancel="() => (params.keyword = '')" />
      </form>
    </div>
    <van-pull-refresh v-model="ListParams.isLoading" :disabled="ListParams.finished" @refresh="onRefresh">
      <van-list v-model="loading" :finished="ListParams.finished" finished-text="没有更多了" @load="onLoad">
        <van-card v-for="i in lists" @click="sbxq(i)" >
          <template #thumb>
            <van-cell-group span="24" style="margin: 10px 0;background: red;">
              <van-cell :title-class="{ 'zdimg': true }">
                <template #title>
                  <div style="display: flex;align-items: center;">
                    <img style="height: 20px;padding: 10px 10px;" src="../../assets/images/站点.png" alt="">
                    <span style="font-weight: bold;font-size: 18px;" class="custom-title">{{ i.siteName }}</span>
                  </div>
                </template>
                <template #right-icon>
                  <span v-if="i.siteStatus == 1" class="zxlx" style="">在线</span>
                  <span v-else class="zxlx lx" style="display: inline-block;">离线</span>
                </template>
              </van-cell>
              <van-cell title="站点编号">
                <template #title>
                  <div style="display: flex;justify-content: space-between;padding: 0 20px;">
                    <span class="bold-t">站点编号</span>
                    <span>{{ i.siteNo }}</span>
                  </div>

                </template>
              </van-cell>
              <van-cell title="检测时间">
                <template #title>
                  <div style="display: flex;justify-content: space-between;padding: 0 20px;">
                    <span class="bold-t">检测时间</span>
                    <span>{{ i.monitorTime }}</span>
                  </div>

                </template>
              </van-cell>
              <van-cell v-for="k in i.dataList">
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
      </van-list>
    </van-pull-refresh>
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
</style>