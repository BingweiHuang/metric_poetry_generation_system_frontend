<template>
  <!-- 诗作收藏列表 -->
  <el-space size="" wrap style="width: 100%; justify-content: center;">
    <template v-for="(item, idx) in shi_collection_list.slice((shi_currentPage - 1) * shi_pageSize, shi_currentPage * shi_pageSize)" :key="idx">
      <ShiCard :poetry="item.shi" :pos="(shi_currentPage - 1) * shi_pageSize + idx"
              @cancle_collection="cancle_collection" @collection="collection"/>
    </template>

    <template v-if="(!is_me) && (!the_account.display_collections)">
      <el-empty description="该用户设置了隐私~"/>
    </template>
    <template v-else-if="shi_collection_list.length === 0">
      <el-empty description="没有收藏任何诗作~"/>
    </template>
    <template v-else>
      <el-button type="primary" text size="large"
                 v-if="(shi_currentPage >= (shi_collection_list.length / shi_pageSize)) && shi_have_more"
                 @click="shi_load" style="font-size: 20px; font-weight: bold">
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
      @size-change="shi_handleSizeChange"
      @current-change="shi_handleCurrentChange"
      :current-page="shi_currentPage"
      :page-size="shi_pageSize"
      :pager-count="6"
      layout=" prev, pager, next"
      :total="shi_collection_list.length">
  </el-pagination>

  <!-- 移动端分页码 -->
  <el-pagination
      class="my-el-pagination hidden-sm-and-up"
      background
      :small="true"
      :hide-on-single-page="true"
      @size-change="shi_handleSizeChange"
      @current-change="shi_handleCurrentChange"
      :current-page="shi_currentPage"
      :page-size="shi_pageSize"
      :pager-count="6"
      layout=" prev, pager, next"
      :total="shi_collection_list.length">
  </el-pagination>
</template>

<script lang="ts">
import ShiCard from "@/components/ShiCard.vue";
import {ref} from "vue";
import {Delete, Post, system_base_url} from "@/utils/request";
import {ElMessage} from "element-plus";

export default {
  name: "ShiCollectionTab",
  components: {
    ShiCard,
  },
  props: {
    the_account: {
      type: Object,
      required: true,
    },
    shi_collection_list: {
      type: Array,
      required: true,
    },
    is_me: {
      type: Boolean,
      required: true,
    },
    shi_have_more: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, context) {

    const shi_currentPage = ref(1);
    const shi_pageSize = ref(9);
    const shi_handleSizeChange = (val: number) => {
      // 更新每页展示数据size
      shi_pageSize.value = val
    };
    const shi_handleCurrentChange = (val: number) => {
      // 更新当前页数是第几页
      shi_currentPage.value = val
    };

    const cancle_collection = (obj, callBack) => {
      context.emit('cancle_shi_collection', obj, status => {
        callBack(status)
      })
    }

    const collection = (obj, callBack) => {
      context.emit('shi_collection', obj, status => {
        callBack(status)
      })
    }

    const shi_load = () => {
      context.emit('shi_load');
    }

    return {
      shi_currentPage,
      shi_pageSize,
      shi_handleSizeChange,
      shi_handleCurrentChange,
      shi_load,
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