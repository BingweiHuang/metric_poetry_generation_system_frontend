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

  <el-footer style="background-color: #2775B6;">Footer</el-footer>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import NavBar from '@/components/NavBar.vue'; // @ is an alias to /src

@Options({
  components: {
    NavBar,
  },
})
export default class App extends Vue {}
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

}
</style>
