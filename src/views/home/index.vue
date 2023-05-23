<template>
  <div class="intro-class">
    <div class="header">
      <div class="tittle"> 西咸机场海绵系统</div>
      <van-divider />
    </div>
    <div class="intro-container" :class="{ 'mag_top': index == 0 }" v-for="i, index in ulList" :key="i.img">
      <div class="conrtent">
        <div class="tittle" :class="{ 'tittle_hm': !i.atittle }"> {{ i.tittle }} </div>
        <div class="atittle">{{ i.atittle }}</div>
        <div @click="routerClick(i.com)" class="bgc" v-if="i.atittle"><img src="../../assets/images/jiantou.png" alt="">
        </div>
      </div>
      <img :src="getAssetsFile(i.bgc)" />
    </div>
  </div>
</template>
<script setup>
import { reactive, onMounted, getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router'
import getAssetsFile from '../../utils/pub-use'

const router = useRouter()
const ulList = reactive([
  { tittle: '设备信息', com: '/sbxxList', bgc: '/sbxx_img.png', atittle: 'Equipment' },
  { tittle: '报警预警信息', com: '/bjxx', bgc: '/bjyjxx_img.png', atittle: 'Alarm warning' },
  { tittle: '监测数据查询', com: '/jcshcx', bgc: '/jcsjcx_img.png', atittle: 'Monitor data' }])
let {
  appContext: {
    config: { globalProperties: { $dd, $corpId } }
  }
} = getCurrentInstance()

const routerClick = (i) => {
  router.push(i)
}
onMounted(() => {
  $dd.ready(function () {
    $dd.biz.navigation.setTitle({
      title: '首页',//控制标题文本，空字符串表示显示默认文本
      onSuccess: function (result) {
      },
      onFail: function (err) { }
    });
  })
})
</script>
<style lang="scss" scoped>
.intro-class {
    width: 100vw;
    height: 80vh;
    overflow: hidden;
    text-align: center;
  
    .header {
      height: 200px;
      width: 100%;
      position: absolute;
      background: url('../../assets/images/dbbj_img.png');
      background-size: 100% 100%;
      z-index: -100;
  
      .tittle {
        color: #FFFFFFFF;
        font-size: 22px;
        padding: 20px 80px;
      }
    }
    .intro-container {
      width: 90%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-left: 4.8%;
      margin-top: 15px;
      padding: 3px 0;
  
      .conrtent {
        padding: 20px;
        border-radius: 10px;
        position: absolute;
        display: flex;
        flex-direction: column;
  
        div {
          flex: 1;
        }
      }
  
      .tittle,
      .atittle {
        color: #FFFFFFFF;
        font-size: 22px;
      }
  
      .bgc {
        width: 80px;
        border: 1px solid #FFFFFF;
        border-radius: 21px;
        text-align: center;
        margin-top: -2px;
      }
    }
    .mag_top {
      margin-top: 100px
    }
  }
</style>