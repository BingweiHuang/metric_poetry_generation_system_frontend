<template>

  <el-row style="margin-bottom: 0; background-color: #2775B6">
    <el-col :span="24">
      <NavBar/>
    </el-col>
  </el-row>

  <el-row style="min-height: 800px">
    <el-col :xl="4" :lg="4" :md="3" :sm="2" :xs="0">
    </el-col>
    <el-col :xl="16" :lg="16" :md="18" :sm="20" :xs="24">
      <router-view :key="$route.fullPath"/>
    </el-col>
    <el-col :xl="4" :lg="4" :md="3" :sm="2" :xs="0">
    </el-col>
  </el-row>
<!---->
  <el-footer class="my-el-footer">
    <div>
      Copyright © 2023 by 踏云
      <div class="beian" @click="href_to('https://beian.miit.gov.cn/#/Integrated/recordQuery')">
        赣ICP备2023002566号-1
      </div>
    </div>

    <div class="about" @click="to_about_view">关于</div>
  </el-footer>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import NavBar from '@/components/NavBar.vue';
import {useRouter} from "vue-router"; // @ is an alias to /src



export default({
  name: "App",
  components: {NavBar},
  setup() {
    const href_to = (uri:string) => {
      window.open(uri) // 打开新页面跳转
    }

    const router = useRouter();

    const to_about_view = () => {
      router.push('/About')
    }

    return {
      href_to,
      to_about_view,
    }
  }
})
// export default class App extends Vue {}
</script>

<style lang="scss" scoped>

.my-el-header {
  --el-header-padding: 0 !important;
  --el-header-height: 58px;
}
.my-el-main {
  //--el-main-padding: 0px 300px 20px 300px !important;
  //background-color: #2D2D30;
  //background: linear-gradient(180deg, #158BB8, #2775B6);
  //text-align: center;

  align-items: center;
}
.my-el-footer {
  background-color: #2775B6;
  color: #E8E8E8;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.beian {
  cursor: pointer;
}

.beian:hover {
  color: #A28A40;
}

.about {
  cursor: pointer;
  margin-left: 10px;
}

.about:hover {
  color: #A28A40;
}
</style>
