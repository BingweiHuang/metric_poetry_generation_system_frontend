<template>
  <!-- 词作收藏列表 -->
    <el-space size="" wrap style="width: 100%; justify-content: center;">
        <template
                v-for="(item, idx) in ci_collection_list.slice((ci_currentPage - 1) * ci_pageSize, ci_currentPage * ci_pageSize)"
                :key="'ci_' + item.ci.id + idx">
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
import {ref, watch} from "vue";
import {authDelete, authGet, authPost, system_base_url} from "@/utils/request";
import {ElMessage} from "element-plus";
import store from "@/store";

export default {
    name: "CiCollectionTab",
    components: {
        CiCard,
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
            () => (props.activeName),
            (val, preVal) => {
                if (val === '词作收藏') {
                    if ((props.the_account.display_collections || props.is_me || store.getters.get_account.is_superuser)
                        && ci_collection_list.value.length === 0) {
                        get_ci_collection_list()
                    }
                }
            },
            {
                immediate: true,
                deep: false,
            }
        )

        const default_limit = 9;

        let ci_next_url = '';
        const ci_collection_list = ref([])
        const get_ci_collection_list = async () => {
            await authGet(system_base_url + 'account/ci_collections/',
                {author: props.the_account.id, limit: default_limit})
                .then((resp) => {
                    const result = resp.data.results
                    ci_collection_list.value = result;
                    ci_next_url = resp.data.next
                    if (result.length < default_limit) ci_have_more.value = false;
                    else ci_have_more.value = true;
                })
                .catch((err) => {
                    console.log(err)
                })
        }
        const ci_load = () => {
            if (ci_next_url === null || ci_next_url === '') {
                ci_have_more.value = false
                ElMessage({
                    showClose: true,
                    message: '已经没有数据咯~',
                    type: 'warning',
                    duration: 3000,
                })
                return false
            }

            authGet(ci_next_url, {author: props.the_account.id, limit: default_limit})
                .then((resp) => {
                    let result = resp.data.results
                    ci_next_url = resp.data.next
                    if (result.length < default_limit) ci_have_more.value = false;
                    else ci_have_more.value = true;
                    ci_collection_list.value = ci_collection_list.value.concat(result)

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
        const ci_have_more = ref(true);

        const cancle_collection = (obj, callBack) => {
            authDelete(system_base_url + 'account/ci_collections/' + obj.collection_id, {})
                .then((resp) => {
                    if (resp.status === 204) { // 删除成功返回204
                        ci_collection_list.value[obj.pos].ci.collection_id = 0;
                    }
                    callBack(resp.status)
                })
                .catch((error) => {
                    console.log(error)
                })
        }
        const collection = (obj, callBack) => {
            authPost(system_base_url + 'account/ci_collections/', {ci_id: obj.ci_id})
                .then((resp) => {
                    if (resp.status === 201) { // 成功收藏 创建成功返回201
                        ci_collection_list.value[obj.pos].ci.collection_id = resp.data.id;
                    }
                    callBack(resp.status)
                })
                .catch((error) => {
                    console.log(error)
                })
        }

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

        return {

            ci_load,
            ci_collection_list,
            get_ci_collection_list,
            ci_have_more,


            ci_currentPage,
            ci_pageSize,
            ci_handleSizeChange,
            ci_handleCurrentChange,
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

.my .el-card {
  border: none;
  background: none;
}
</style>