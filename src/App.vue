
<template>
  <router-view #="{ Component }">
    <component :is="Component" />
  </router-view>
</template>
<script lang="ts">
import { useStore } from 'vuex'
import { defineComponent, onMounted, getCurrentInstance, ComponentInternalInstance } from 'vue'
import { login } from '@/api/home'
import { Setstorage } from '@/utils/token'
export default defineComponent({
  name: 'App',
  setup() {
    onMounted(() => {
      let {
        appContext: {
          config: { globalProperties: { $dd, $corpId } }
        }
      } = getCurrentInstance() as ComponentInternalInstance
      $dd.ready(function () {
        $dd.runtime.permission.requestAuthCode({
          corpId: $corpId,
          onSuccess: function ({ code }) {
            login(code).then(({ data }) => {
              console.log(data, 11999);
              Setstorage.set('token',data.token)
            })
          },
          onFail: function (err) { }
        })
      })

    })
  }

})
</script>

<style lang="scss" scoped></style>