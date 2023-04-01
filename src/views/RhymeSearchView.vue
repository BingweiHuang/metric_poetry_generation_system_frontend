<template>

  <el-row>
    <el-col :xl="2" :lg="2" :md="2" :sm="1" :xs="0"></el-col>

    <el-col :xl="20" :lg="20" :md="20" :sm="22" :xs="24">
      <!-- 标签页 -->
      <el-tabs type="border-card" v-model="activeName">
        <!-- 平水韵 -->
        <el-tab-pane label="平水韵" name="平水韵">

          <PingshuiTab :activeName="activeName"/>

        </el-tab-pane>

        <!-- 中华新韵 -->
        <el-tab-pane label="中华新韵" name="中华新韵">

          <XinyunTab :activeName="activeName"/>

        </el-tab-pane>

        <!-- 搜索 -->
        <el-tab-pane label="搜索" name="搜索">

          <SearchTab :activeName="activeName"/>

        </el-tab-pane>

      </el-tabs>
    </el-col>

    <el-col :xl="2" :lg="2" :md="2" :sm="1" :xs="0"></el-col>
  </el-row>

</template>

<script lang="ts">
import {onMounted, reactive, ref} from "vue";

import PingshuiTab from "@/components/rhyme_search/PingshuiTab.vue";
import XinyunTab from "@/components/rhyme_search/XinyunTab.vue";
import SearchTab from "@/components/rhyme_search/SearchTab.vue";

export default {
  name: "RhymeSearchView",
  components: {
    PingshuiTab,
    XinyunTab,
    SearchTab,
  },
  setup() {

    const activeName = ref('平水韵')

    return {
      activeName,
    }
  }
}
</script>

<style lang="scss">
.yun .el-radio__input {
  display: none !important;
}
.yun .el-radio__label {
  font-size: 16px !important;
}
.yun .el-radio {
  margin-right: 10px !important;
}
.yun .el-space__item {
  padding-bottom: 3px !important;
  margin-right: 2px !important;
}

.detail {
  font-size: 10px !important;
  color: #A4265F !important;
  margin-right: 2px;
}
</style>