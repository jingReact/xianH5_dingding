<script setup lang="ts">
import LabelSelect from './components/labelSelect.vue'
import { reactive, ref,onMounted} from 'vue'
import {useRouter,useRoute} from 'vue-router'
import SvgIcon from '@/components/svgIcon'
import { siteList } from '@/api/home'

const router=useRouter()
const {query}=useRoute()
let params = reactive({
  keyword: '',
  sortBy: '',
  type: '',
  isMobile: true,
})
const lists = ref([
]);
//点击设备详情
const sbxq=(i)=>{ 
  console.log(i);
  // router.push('/sbxxList')
  router.push({path:'/sbxxInfo',query:i})
}
//获取设备列表
const siteListMt=async (p:string)=>{ 
  let {data}=await siteList(p)
  console.log(data);
  lists.value=data
}
onMounted(()=>{ 
  console.log(query,7788);
  siteListMt({typeId:query.typeId})
})
</script>

<template>
  <div class="app-container">
    <div class="search">
    <form action="/">
      <van-search v-model="keyword" input-align="center" :clearable="false" :show-action="!!keyword"
          placeholder="请输入站点名称" @search="() => (params.keyword = keyword)" @cancel="() => (params.keyword = '')" />
      </form>
      <LabelSelect @changeLabel="(val) => (params.type = val)" ref="label"></LabelSelect>
    </div>
    <van-row gutter="20">
      <van-col v-for="i in lists" span="12" @click="sbxq(i)">
        <van-card>
          <template #thumb>
            <div class="card">
              <img src="../../assets/images/zhandian.png" />
              <span>{{ i.siteName }}</span>
            </div>
            <div v-if="i.siteStatus == 1" class="status"><img style="width: 10px;" src="../../assets/images/sbzx.png" />正常</div>
            <div v-else class="status" style="color: #8a8a8a;"><img style="width: 10px;"
                src="../../assets/images/sblx.png" />离线</div>
          </template>
        </van-card>
      </van-col>
    </van-row>
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