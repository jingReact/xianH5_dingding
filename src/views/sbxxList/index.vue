<script setup lang="ts">
// import list from './components/list.vue'
import { reactive, ref ,onMounted} from 'vue'
import { useRouter } from 'vue-router'
import SvgIcon from '@/components/svgIcon'
import getAssetsFile from '../../utils/pub-use'
import { siteCont } from '@/api/home'

const router = useRouter()
let params = reactive({
  keyword: '',
  sortBy: '',
  type: '',
  isMobile: true,
})
const lists = ref([
{ 'projectName': '雨情监测', img: '/yqjc_icon.png', icon: '', zt: 1 },
  { 'projectName': '河道水质监测', img: '/hdsz_icon.png', zxzt: '在线', icon: '', zt: 0 },
  { 'projectName': '管网水质监测', img: '/gwsz_icon.png', zxzt: '在线', icon: '', zt: 1 },
  { 'projectName': '管网流量监测', img: '/gwll_icon.png', zxzt: '在线', icon: '', zt: 0 },
  { 'projectName': '内涝点监测', img: '/nld_icon.png', zxzt: '在线', icon: '', zt: 0 },
  { 'projectName': '溢流口监测', img: '/xxx.png', zxzt: '在线', icon: '', color: 1 },
  { 'projectName': '水环境', img: '/shj_icon.png', zxzt: '在线', icon: '', zt: 0 },
  { 'projectName': '污水泵站', img: '/sss.png', zxzt: '在线', icon: '', zt: 0 },
  { 'projectName': '雨水泵站', img: '/ysbz_icon.png', zxzt: '在线', icon: '', zt: 0 },
]);
//点击设备详情
const sbxq = (i:any) => {
  router.push({path:'/sbxx',query:i})
}
//设备信息接口
let listData=ref()
let  siteContMth=async (p:any)=>{ 
    let {code,data}=await siteCont(p)
    console.log(code,data);
    listData.value=data
}
onMounted(() => {
  siteContMth()
})
</script>
<template>
  <div class="app-container">
  <van-row gutter="20"> 
      <van-col v-for="i,index in listData" :span="12"  @click="sbxq(i)"> 
     <van-card> 
          <template #thumb> 
            <div class="card" >
              <img :src="getAssetsFile(lists[index].img)" />
            <div style="margin-left: 10px;">
              <div>{{ i.countNum }}</div>
              <div class="typeClass">{{ i.typeName }}</div>
              </div>
            </div>
         </template> 
       </van-card> 
     </van-col> 
   </van-row> 
  </div>
</template>

<style lang="scss" scoped>
.app-container {
  // background: red;
  // width: 100px;
  padding: 0 10px;

  .search {
    height: 100px;
  }
  .typeClass{ 
          width: 80px;
					font-family: PingFang SC;
					font-weight: 500;
					color: #7B7B7E;
					white-space: nowrap;
					overflow: auto;
					text-align: left;
          font-size: 15px;
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
  // width: 330px;
}

.status {
  text-align: right;
  position: absolute;
  bottom: 10px;
  width: 80px;
  margin-left: 80px;
}
</style>