<!--
 * @Author: liyingjing ll47991367@qq.com
 * @Date: 2023-05-13 10:16:10
 * @LastEditors: liyingjing ll47991367@qq.com
 * @LastEditTime: 2023-05-18 11:24:43
 * @FilePath: \vue3-vite2-ts-blog-h5\src\App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

<template>
  <router-view #="{ Component }">
    <component :is="Component" />
  </router-view>
</template>
<script lang="ts">
import { useStore } from 'vuex'
import { defineComponent, onMounted, getCurrentInstance ,ComponentInternalInstance} from 'vue'
export default defineComponent({
  name: 'App',
  setup() {
    const store = useStore()
    const getLabelList = () => store.dispatch('label/getLabelList')
    getLabelList()
    onMounted(() => {
      let {
        appContext: {
          config: { globalProperties: { $dd } }
        }
      } = getCurrentInstance() as ComponentInternalInstance
      // $dd.ready(function () {
      //   $dd.runtime.permission.requestAuthCode({
      //     corpId: "ding94b03782d8570bd6f2c783f7214b6d69",
      //     onSuccess: function (result) {
      //       console.log(result, 77777);
      //     },
      //     onFail: function (err) { }

      //   })
      // })
      console.log($dd, 444);
    })
  }

})
</script>

<style lang="scss" scoped></style>