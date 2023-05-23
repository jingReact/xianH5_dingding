<template>
    <div class="home_div">
        <div id="container"></div>
    </div>
</template>
<script>
import { defineComponent, reactive, ref, onMounted, defineProps } from 'vue'
import AMapLoader from "@amap/amap-jsapi-loader"
import { shallowRef } from '@vue/reactivity'
export default defineComponent({
    name: "mapcomtaint",
    setup() {
        const map = shallowRef(null);
        // const data=defineProps(['data'])
        return {
            map,
            // data
        }

    },
    props: ['data'],
    create() {

    },
    methods: {
        ininMap() {
            AMapLoader.load({
                key: '28fa8cbb568d7cf4ca3dea532b0fa833',  //设置您的key
                version: "2.0",
                plugins: ['AMap.ToolBar', 'AMap.Driving'],
                AMapUI: {
                    version: "1.1",
                    plugins: [],

                },
                Loca: {
                    version: "2.0.0"
                },
            }).then((AMap) => {
                console.log(AMap);
                this.map = new AMap.Map("container", {
                    viewMode: '3D',  // 默认使用 2D 模式
                    zoom: 14,  //初始化地图层级
                    center: [this.data.pointX, this.data.pointY]  //初始化地图中心点
                });
                console.log(this.map);
                const marker = new AMap.Marker({

                    position: new AMap.LngLat(this.data.pointX, this.data.pointY),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                    title: this.data.siteName
                });
                marker.setLabel({//label默认蓝框白底左上角显示，样式className为：amap-marker-label
                    offset: new AMap.Pixel(5, -10),//修改label相对于maker的位置
                    content: this.data.siteName,
                    color: 'red'
                });

                this.map.add(marker)
                // let positionArr = [
                //     [113.357224,34.977186]
                // ];
                // console.log("=========1323212321321")
                // for(let item of positionArr){

                //     console.log(item[0],"========131232332dfdfsfd",item[1])
                //     let marker = new AMap.Marker({
                //         position:[item[0],item[1]],
                //     });
                //     this.map.add(marker);
                // }


            }).catch(e => {
                console.log(e);
            })
        },
        addMarker() {

        }
    },
    mounted() {
        console.log(this.data, 'dtatdtat');

        //DOM初始化完成进行地图初始化
        this.ininMap();

    }
});
</script>
<style scope>
.home_div {
    height: 100%;
    width: 100%;
    padding: 0px;
    margin: 0px;
    position: relative;
}

#container {
    height: 200px;
    width: 100%;
    padding: 3px;
    margin: -10px;
}

.map-title {
    position: absolute;
    z-index: 1;
    width: 100%;
    height: 50px;
    background-color: rgba(27, 25, 27, 0.884);

}

h3,
#container {
    position: absolute;
    left: 10px;
    z-index: 2;
    /* color: white; */
}

.amap-marker-label {
    border: 1px solid #fff;
    padding: 0 5px;
}
</style>