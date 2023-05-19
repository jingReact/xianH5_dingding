import { ref } from 'vue'
import { defineStore } from 'pinia'
export const useCounterStore = defineStore('counter', () => {
    const count:any = ref(0)
    function doubleCount() {
        return count.value * 2
    }
    function increment() {
        count.value++
    }

    return { count, increment }
})

