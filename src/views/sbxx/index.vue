<script setup lang="ts">
import { reactive, ref, onMounted,getCurrentInstance, ComponentInternalInstance  } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import SvgIcon from '@/components/svgIcon'
import { siteList } from '@/api/home'
const { appContext: { config: { globalProperties: { $dd } } } } = getCurrentInstance() as ComponentInternalInstance

const router = useRouter()
const { query } = useRoute()
let keyword = ref()
const lists = ref([
]);
//点击设备详情
const sbxq = (i:any) => {
  console.log(i);
  router.push({ path: '/sbxxInfo', query: i })
}
//获取设备列表
const siteListMt = async (p: any) => {
  let { data } = await siteList(p)
  console.log(data);
  lists.value = data
}
function onSearch() {
  siteListMt({ typeId: query.typeId, keyword: keyword.value })
}

let ListParams = ref({typeId: query.typeId , pageNum: 1, pageSize: 10, loading: true, finished: false, isLoading: false })
// 上拉加载
function onLoad() {
  ListParams.value.pageNum++
  siteListMt(true)
}
// 下拉刷新
function onRefresh() {
  ListParams.value.loading = true
  ListParams.value.pageNum = 1
  siteListMt(true)
}
onMounted(() => {
  // console.log(query, 7788);
  // siteListMt({ typeId: query.typeId })
  siteListMt({ typeId: query.typeId })
  $dd.ready(function () {
    $dd.biz.navigation.setTitle({
    title : '站点列表',//控制标题文本，空字符串表示显示默认文本
    onSuccess : function(result) {
    },
    onFail : function(err) {}
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
    <!-- <van-pull-refresh v-model="ListParams.isLoading" :disabled="ListParams.finished" @refresh="onRefresh">
      <van-list v-model="ListParams.loading" :finished="ListParams.finished" :immediate-check="false"
        finished-text="没有更多了" @load="onLoad" :offset="10"> -->
    <van-row gutter="20">
      <van-col v-for="i in lists" span="12" @click="sbxq(i)">
        <van-card>
          <template #thumb>
            <div class="card">
              <img src="../../assets/images/zhandian.png" />
              <span>{{ i.siteName }}</span>
            </div>
            <div v-if="i.siteStatus == 1" class="status"><img style="width: 10px;" src="../../assets/images/sbzx.png" />正常
            </div>
            <div v-else class="status" style="color: #8a8a8a;"><img style="width: 10px;"
                src="../../assets/images/sblx.png" />离线</div>
          </template>
        </van-card>
      </van-col>
    </van-row>
    <!-- </van-list>
    </van-pull-refresh> -->
  </div>
</template>

<style lang="scss" scoped>
.app-container {
  padding: 0 10px;

  .search {
    height: 50px;
  }
  .van-search {
    padding: 12px 0px 0;
    position: fixed;
    top: 0;
    width: 95%;
    height: 46px;
    z-index: 99;
    background-color: #fff;
    :deep(.van-search__content) {
      border-radius: 16px;
    }
  }
}
.van-card {
  height: 80px;
  background: linear-gradient(0deg, #EBF4FF 0%, #FFFFFF 100%);
  box-shadow: 0px 2px 30px 0px rgba(18, 18, 18, 0.1);
  border-radius: 10px;
  margin: 10px 0px;
}

.card {
  display: flex;
  align-items: center;
  font-weight: bold;
  margin-top: 20px;
}

.status {
  text-align: right;
  position: absolute;
  bottom: 10px;
  width: 80px;
  margin-left: 80px;
}
</style>