<script setup lang="ts">
import { reactive, ref, onMounted, getCurrentInstance, ComponentInternalInstance } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import SvgIcon from '@/components/svgIcon'
import { siterealdata } from '@/api/home'
const router = useRouter()
const { query } = useRoute()
let keyword = ref()
const lists = ref([
]);
const { appContext: { config: { globalProperties: { $dd } } } } = getCurrentInstance() as ComponentInternalInstance
//点击设备详情
const sbxq = (i: any) => {
  console.log(i);
  router.push({ path: '/jcshsjcx', query: i })
}
//获取设备列表
const siteListMt = async (isRefresh: boolean) => {
  let { data, total } = await siterealdata(ListParams.value)
  if (isRefresh) {//下拉刷新
    lists.value = [...data, ...lists.value]
    ListParams.value.isLoading = false
  } else {//上拉加载
    if (total > lists.value.length) {
      lists.value = [...lists.value, ...data]
      ListParams.value.loading = false
      ListParams.value.finished = true

    } else {
      ListParams.value.finished = true
    }
  }
  if (data.length === 0) {// 证明没有下一页数据了
    ListParams.value.finished = true
  }
}
//搜索
function onSearch() {
  siteListMt()
}
let ListParams = ref({ pageNum: 1, pageSize: 10, loading: true, finished: false, isLoading: false })
// 上拉加载
function onLoad() {
  ListParams.value.pageNum++
  siteListMt()
}
// 下拉刷新
function onRefresh() {
  ListParams.value.loading = true
  ListParams.value.pageNum = 1
  siteListMt(true)
}
onMounted(() => {
  siteListMt(true)
  $dd.ready(function () {
    $dd.biz.navigation.setTitle({
      title: '检测数据列表',//控制标题文本，空字符串表示显示默认文本
      onSuccess: function (result) {
      },
      onFail: function (err) { }
    });
  })
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
      <van-list v-model="ListParams.loading" :finished="ListParams.finished" :immediate-check="false"
        finished-text="没有更多了" @load="onLoad" :offset="10">
        <van-card v-for="i in lists" @click="sbxq(i)">
          <template #thumb>
            <van-cell-group span="24" style="margin: 10px 0;background: red;">
              <van-cell :title-class="{ 'zdimg': true }">
                <template #title>
                  <div style="display: flex;align-items: center;margin-left: 12px;">
                    <img style="height: 20px;padding: 10px 5px" src="../../assets/images/站点.png" alt="">
                    <span style="font-weight: bold;font-size: 18px;" class="custom-title">{{ i['siteName'] }}</span>
                  </div>
                </template>
                <template #right-icon>
                  <span v-if="i['siteStatus'] == 1" class="zxlx" style="">在线</span>
                  <span v-else class="zxlx lx" style="display: inline-block;">离线</span>
                </template>
              </van-cell>
              <van-cell title="站点编号">
                <template #title>
                  <div style="display: flex;justify-content: space-between;padding: 0 20px;">
                    <span class="bold-t">站点编号</span>
                    <span>{{ i['siteNo'] }}</span>
                  </div>

                </template>
              </van-cell>
              <van-cell title="检测时间">
                <template #title>
                  <div style="display: flex;justify-content: space-between;padding: 0 20px;">
                    <span class="bold-t">检测时间</span>
                    <span>{{ i['monitorTime'] }}</span>
                  </div>

                </template>
              </van-cell>
              <van-cell v-for="k in i['dataList']">
                <template #title>
                  <div style="display: flex;justify-content: space-between;padding: 0 20px;">
                    <span class="bold-t">{{ k['codeProperty'] }}</span>
                    <span>{{ k['currentValue'] }}{{ k['unit'] }}</span>
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
    padding: 12px 0px 0 0;
    position: fixed;
    top: 0;
    width: 95%;
    height: 46px;
    z-index: 99;

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
  border-radius: 10px;
  margin: 20px 0px;
  width: 100%;

  :deep .van-card__thumb {
    height: auto;
    width: 100% !important;
    overflow: hidden;
    background-color: #fff;
    box-shadow: 0px 2px 10px 0px rgba(18, 18, 18, 0.1);
  }
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
}</style>