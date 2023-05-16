
<template>
  <router-view #="{ Component }">
    <component :is="Component" />
  </router-view>
</template>
<script lang="ts">
import { useStore } from 'vuex'
import { defineComponent, onMounted, getCurrentInstance } from 'vue'
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
      } = getCurrentInstance()
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