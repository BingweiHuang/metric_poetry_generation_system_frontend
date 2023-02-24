<template>
  <div>
    <el-page-header :icon="ArrowLeft" title="返回" @back="goBack">
      <template #content>
        <div class="flex items-center">
<!--          <el-avatar
              :size="32"
              class="mr-3"
              src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          />-->
          <span class="text-large font-600 mr-3"> 主标题 </span>

          <el-tag>Default</el-tag>
        </div>

      </template>
      <template #extra>

      </template>
    </el-page-header>
    <el-divider />
  </div>
</template>


<script lang="ts">
import { Search } from '@element-plus/icons-vue'
import {ref} from "vue";
import {useRoute, useRouter} from "vue-router";
const input3 = ref('')
const select = ref('')


export default {
  name: "PageHeader",
  components: {

  },
  setup() {

    const route = useRoute();
    const router = useRouter();

    const goBack = () => {
      console.log('go back');
      router.go(-1);
    };

    return {
      goBack,
      Search,
      input3,
      select,
    }
  }
}
</script>

<style lang="scss" scoped>
.el-divider--horizontal {
  margin: 10px 0;
}
</style>