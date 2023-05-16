import { defineComponent } from "vue";
import "./tabbar.scss";

export default defineComponent({
  name: "Tabbar",
  setup() {
    return () => (
      <>
        <router-view />
        {/* <van-tabbar active-color="#009688" inactive-color="#595959" route>
          <van-tabbar-item replace to="/home" >
          </van-tabbar-item>
       
        </van-tabbar> */}
      </>
    );
  },
});
