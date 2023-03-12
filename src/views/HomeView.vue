<template>
  <div class="block text-center">
    <el-carousel height="350px" style="margin-bottom: 50px">
      <el-carousel-item v-for="item in 4" :key="item">
        <h3 class="small justify-center" text="2xl">{{ item }}</h3>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import NavBar from '@/components/NavBar.vue';
import {onMounted, ref} from "vue";
import {instance} from "@/utils/utils";
import * as echarts from "echarts"; // @ is an alias to /src


export default {
  name: 'HomeView',
  components: {
  },
  setup() {
    let a;
  },

}
</script>

<style lang="scss">

.home {
  height: 1000px;
}

.demonstration {
  color: var(--el-text-color-secondary);
}

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

</style>
