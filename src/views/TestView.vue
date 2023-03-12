<template>

  <div>

  </div>

</template>

<script lang="ts">
import { ref, onMounted } from 'vue'
import {instance} from "@/utils/utils";
import * as echarts from 'echarts';
import 'echarts-wordcloud';

export default {
  name: 'TestView',
  components: {
  },
  setup() {

    let a;

    return {
    }
  },

}


</script>

<style>
.input-with-select .el-input-group__prepend {
  background-color: var(--el-fill-color-blank);
}
</style>