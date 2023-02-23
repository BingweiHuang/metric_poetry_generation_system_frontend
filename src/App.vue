<template>
  <div class="common-layout">
    <el-container>
      <el-header class="my-el-header">
        <NavBar/>
      </el-header>
      <el-main class="my-el-main">
        <PageHeader class="my-PageHeader" />
        <router-view :key="$route.fullPath"/>
      </el-main>
      <el-footer class="my-el-footer">Footer</el-footer>
    </el-container>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import NavBar from '@/components/NavBar.vue'; // @ is an alias to /src
import PageHeader from '@/components/PageHeader.vue'; // @ is an alias to /src

@Options({
  components: {
    NavBar,
    PageHeader,
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
  --el-main-padding: 0px 300px 20px 300px !important;
  //background-color: #2D2D30;
  //background: linear-gradient(180deg, #158BB8, #2775B6);
  //text-align: center;

  align-items: center;
}
.my-el-footer {
  --el-footer-padding: 0 250px !important;
  background-color: #2775B6;
}
.my-PageHeader {
 margin-top: 10px;
}
</style>
