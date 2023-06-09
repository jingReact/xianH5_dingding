
export const   Setstorage = {
    //存储
    set(key: string, value: any) {
        localStorage.setItem(key, JSON.stringify(value))
    },
    //取出数据
    get<T>(key: string) {
        const value = localStorage.getItem(key)
        if (value && value != "undefined" && value != "null") {
            return <T>JSON.parse(value)
        }
    },
    // 删除数据
    remove(key: string) {
        localStorage.removeItem(key)
    }
};