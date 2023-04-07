<template>
  <!-- 诗作收藏列表 -->
  <el-space size="" wrap style="width: 100%; justify-content: center;">
    <template v-for="(item, idx) in shi_collection_list.slice((shi_currentPage - 1) * shi_pageSize, shi_currentPage * shi_pageSize)" :key="'shi_' + item.shi.id + idx">
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
import {onMounted, ref, watch} from "vue";
import {authDelete, authGet, authPost, system_base_url} from "@/utils/request";
import {ElMessage} from "element-plus";
import store from "@/store";

export default {
  name: "ShiCollectionTab",
  components: {
    ShiCard,
  },
  props: {
    activeName: {
      type: String,
      required: true,
    },
    the_account: {
      type: Object,
      required: true,
    },
    is_me: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, context) {

    watch(
        ()=>(props.activeName),
        (val,preVal)=>{
          if (val === '诗作收藏') {
            if ((props.the_account.display_collections || props.is_me || store.getters.get_account.is_superuser)
                && shi_collection_list.value.length === 0) {
              get_shi_collection_list()
            }
          }
        },
        {
          immediate:true,
          deep:false,
        }
    )

    const default_limit = 9;

    let shi_next_url = '';
    const shi_collection_list = ref([])
    const get_shi_collection_list = async () => {
      await authGet(system_base_url + 'account/shi_collections/',
          {author: props.the_account.id, limit: default_limit})
          .then((resp) => {
            const result = resp.data.results
            shi_collection_list.value = result;
            shi_next_url = resp.data.next

            shi_have_more.value = (result.length >= default_limit)
          })
          .catch((err) => {
            console.log(err)
          })
    }

    const shi_load = () => {
      if (shi_next_url === null || shi_next_url === '') {
        shi_have_more.value = false
        ElMessage({
          showClose: true,
          message: '已经没有数据咯~',
          type: 'warning',
          duration: 3000,
        })
        return false
      }

      authGet(shi_next_url, {author: props.the_account.id, limit: default_limit})
          .then((resp) => {
            let result = resp.data.results
            shi_next_url = resp.data.next
            shi_have_more.value = (result.length >= default_limit)
            shi_collection_list.value = shi_collection_list.value.concat(result)

          })
          .catch((error) => {
            console.log(error);
            if (error.response.status !== 429) {
              ElMessage({
                showClose: true,
                message: '刷新出错！',
                type: 'error',
                duration: 5000,
              })
            }
          })

    }
    const shi_have_more = ref(true);

    const cancle_collection = (obj, callBack) => {
      authDelete(system_base_url + 'account/shi_collections/' + obj.collection_id, {})
          .then((resp) => {
            if (resp.status === 204) { // 删除成功返回204
              shi_collection_list.value[obj.pos].shi.collection_id = 0;
            }
            callBack(resp.status)
          })
          .catch((error) => {
            console.log(error)
          })
    }
    const collection = (obj, callBack) => {
      authPost(system_base_url + 'account/shi_collections/', {shi_id:obj.shi_id})
          .then((resp) => {
            if (resp.status === 201) { // 成功收藏 创建成功返回201
              shi_collection_list.value[obj.pos].shi.collection_id = resp.data.id;
            }
            callBack(resp.status)
          })
          .catch((error) => {
            console.log(error)
          })
    }

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

    return {

      shi_load,
      shi_collection_list,
      get_shi_collection_list,
      shi_have_more,
      cancle_collection,
      collection,

      shi_currentPage,
      shi_pageSize,
      shi_handleSizeChange,
      shi_handleCurrentChange,
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
.my .el-card {
  border: none;
  background: none;
}
</style>