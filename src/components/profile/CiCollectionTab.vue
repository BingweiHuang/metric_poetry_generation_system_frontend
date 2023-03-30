<template>
  <!-- 词作收藏列表 -->
  <el-space size="" wrap style="width: 100%; justify-content: center;">
    <template v-for="(item, idx) in ci_collection_list.slice((ci_currentPage - 1) * ci_pageSize, ci_currentPage * ci_pageSize)" :key="idx">
      <CiCard :poetry="item.ci" :pos="(ci_currentPage - 1) * ci_pageSize + idx"
              @cancle_collection="cancle_collection" @collection="collection"/>
    </template>
    <template v-if="(!is_me) && (!the_account.display_collections)">
      <el-empty description="该用户设置了隐私~"/>
    </template>
    <template v-else-if="ci_collection_list.length === 0">
      <el-empty description="没有收藏任何词作~"/>
    </template>
    <template v-else>
      <el-button type="primary" text size="large"
                 v-if="(ci_currentPage >= (ci_collection_list.length / ci_pageSize)) && ci_have_more"
                 @click="ci_load" style="font-size: 20px; font-weight: bold">
        加载更多...
      </el-button>
    </template>
  </el-space>

  <!-- web端分页码 -->
  <el-pagination
      class="my-el-pagination hidden-xs-only"
      background
      :small="false"
      :hide-on-single-page="true"
      @size-change="ci_handleSizeChange"
      @current-change="ci_handleCurrentChange"
      :current-page="ci_currentPage"
      :page-size="ci_pageSize"
      :pager-count="6"
      layout=" prev, pager, next"
      :total="ci_collection_list.length">
  </el-pagination>

  <!-- 移动端分页码 -->
  <el-pagination
      class="my-el-pagination hidden-sm-and-up"
      background
      :small="true"
      :hide-on-single-page="true"
      @size-change="ci_handleSizeChange"
      @current-change="ci_handleCurrentChange"
      :current-page="ci_currentPage"
      :page-size="ci_pageSize"
      :pager-count="6"
      layout=" prev, pager, next"
      :total="ci_collection_list.length">
  </el-pagination>
</template>

<script lang="ts">
import CiCard from "@/components/CiCard.vue";
import {ref} from "vue";

export default {
  name: "CiCollectionTab",
  components: {
    CiCard,
  },
  props: {
    the_account: {
      type: Object,
      required: true,
    },
    ci_collection_list: {
      type: Array,
      required: true,
    },
    is_me: {
      type: Boolean,
      required: true,
    },
    ci_have_more: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, context) {

    const ci_currentPage = ref(1);
    const ci_pageSize = ref(9);

    const ci_handleSizeChange = (val: number) => {
      // 更新每页展示数据size
      ci_pageSize.value = val
    };
    const ci_handleCurrentChange = (val: number) => {
      // 更新当前页数是第几页
      ci_currentPage.value = val
    };

    const cancle_collection = (obj, callBack) => {
      context.emit('cancle_ci_collection', obj, status => {
        callBack(status)
      })
    }

    const collection = (obj, callBack) => {
      context.emit('ci_collection', obj, status => {
        callBack(status)
      })
    }

    const ci_load = () => {
      context.emit('ci_load');
    }

    return {
      ci_currentPage,
      ci_pageSize,
      ci_handleSizeChange,
      ci_handleCurrentChange,
      ci_load,
      cancle_collection,
      collection,
    }
  }
}
</script>

<style lang="scss" scoped>
.my-el-pagination {
  align-items: center; /*竖直居中*/
  justify-content: center; /*水平居中*/
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>