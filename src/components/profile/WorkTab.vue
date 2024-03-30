<template>
  <!-- 添加作品按钮 -->
    <el-button type="primary" style="margin-bottom: 10px" @click="open_work_form('添加作品')" v-if="is_me">
        添加
    </el-button>

  <!-- 作品展示 -->
    <el-space wrap size="" style="display: flex; align-items: start; justify-content: center">
        <template
                v-for="(work, idx) in work_list.slice((work_currentPage - 1) * work_pageSize, work_currentPage * work_pageSize)"
                :key="'work_' + work.id">
            <el-card :body-style="{ padding: '10px' }" shadow="hover" style="width: 342px; text-align: center;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px">
                    <el-button type="success" text size="small"
                               @click="open_work_form('编辑作品', work.id, (work_currentPage - 1) * work_pageSize + idx)"
                               v-if="is_me">
                        编辑
                    </el-button>
                    <div>
                        <el-tag type="" class="mx-1" effect="plain" v-if="work.topping">
                            置顶
                        </el-tag>
                        <el-tag type="info" class="mx-1" effect="plain"
                                v-if="((is_me || $store.getters.get_account.is_superuser) && !work.display)">
                            私密
                        </el-tag>
                    </div>

                    <!-- 删除作品 -->
                    <el-popconfirm title="确定要删除该作品吗？"
                                   confirm-button-text="确定"
                                   cancel-button-text="取消"
                                   @confirm="delete_work(work.id, idx)">
                        <template #reference>
                            <el-button type="danger" text size="small" v-if="is_me">删除</el-button>
                        </template>
                    </el-popconfirm>
                </div>
                <div style="margin-bottom: 5px; font-size: 20px">《{{ work.title }}》</div>
                <div style="margin-bottom: 5px;">{{ the_account.nickname }}</div>
                <template v-for="(sen, idx2) in work.style_content" :key="idx2">
                    <div class="detail-div">{{ sen }}</div>
                </template>
                <div class="time-div" v-if="is_me">
                    <div>上次修改：{{ work.update_date }}</div>
                    <div>创建时间：{{ work.create_date }}</div>
                </div>
            </el-card>
        </template>
        <template v-if="(!is_me) && (!the_account.display_works)">
            <el-empty description="该用户设置了隐私~"/>
        </template>
        <template v-else-if="work_list.length === 0">
            <el-empty description="没有任何作品~"/>
        </template>
        <template v-else>
            <el-button type="primary" text size="large"
                       v-if="(work_currentPage >= (work_list.length / work_pageSize)) && work_have_more"
                       @click="work_load" style="font-size: 20px; font-weight: bold">
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
            @size-change="work_handleSizeChange"
            @current-change="work_handleCurrentChange"
            :current-page="work_currentPage"
            :page-size="work_pageSize"
            :pager-count="6"
            layout=" prev, pager, next"
            :total="work_list.length">
    </el-pagination>

  <!-- 移动端分页码 -->
    <el-pagination
            class="my-el-pagination hidden-sm-and-up"
            background
            :small="true"
            :hide-on-single-page="true"
            @size-change="work_handleSizeChange"
            @current-change="work_handleCurrentChange"
            :current-page="work_currentPage"
            :page-size="work_pageSize"
            :pager-count="6"
            layout=" prev, pager, next"
            :total="work_list.length">
    </el-pagination>

  <!-- 添加作品框 -->
    <div class="my-dialog">
        <el-dialog v-model="dialogFormVisible" :title="work_form_state">
            <el-form :model="work_form" :rules="work_rules" ref="update_password_dom" :label-width="formLabelWidth">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="work_form.title" placeholder="请输入标题" maxlength="10" show-word-limit/>
                </el-form-item>
                <el-form-item label="内容" prop="content">
                    <el-input v-model="work_form.content" type="textarea" :autosize="{ minRows: 5, maxRows: 5 }"
                              placeholder="请输入内容"/>
                </el-form-item>
                <el-form-item label="隐私">
                    <el-switch v-model="work_form.display" size="" inline-prompt active-text="公开"
                               inactive-text="私密"/>
                </el-form-item>
                <el-form-item label="置顶">
                    <el-switch v-model="work_form.topping" size="" inline-prompt active-text="是" inactive-text="否"/>
                </el-form-item>
            </el-form>

            <div style="display: flex; justify-content: space-around; align-items: center">
                <!--                  <div style="width: 80px"></div>-->
                <div style="display: flex; justify-content: space-around; align-items: center; margin-bottom: 20px;">
                    <el-button type="primary" class="my-button" @click="add_work" v-if="work_form_state === '添加作品'">
                        添 加
                    </el-button>
                    <el-button type="primary" class="my-button" @click="put_work"
                               v-else-if="work_form_state === '编辑作品'">修 改
                    </el-button>
                </div>
            </div>

        </el-dialog>
    </div>
</template>

<script lang="ts">
import {reactive, ref, watch} from "vue";
import {ElMessage} from "element-plus";
import {authDelete, authGet, authPost, authPut, system_base_url} from "@/utils/request";
import store from "@/store";

export default {
    name: "WorkTab",
    components: {},
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

        const default_limit = 9;
        let work_next_url = '';
        const work_list = ref([])
        const work_have_more = ref(true);
        const get_work_list = async () => {
            await authGet(system_base_url + 'account/works/',
                {author: props.the_account.id, limit: default_limit})
                .then((resp) => {
                    const result = resp.data.results
                    work_list.value = result;
                    work_next_url = resp.data.next
                    if (result.length < default_limit) work_have_more.value = false;
                    else work_have_more.value = true;
                })
                .catch((err) => {
                    console.log(err)
                })
        }
        const work_load = () => {
            if (work_next_url === null || work_next_url === '') {
                work_have_more.value = false
                ElMessage({
                    showClose: true,
                    message: '已经没有数据咯~',
                    type: 'warning',
                    duration: 3000,
                })
                return false
            }

            authGet(work_next_url, {author: props.the_account.id, limit: default_limit})
                .then((resp) => {
                    let result = resp.data.results
                    work_next_url = resp.data.next
                    if (result.length < default_limit) work_have_more.value = false;
                    else work_have_more.value = true;
                    work_list.value = work_list.value.concat(result)

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

        watch(
            () => (props.activeName),
            (val, preVal) => {
                if (val === '作品') {
                    if ((props.the_account.display_works || props.is_me || store.getters.get_account.is_superuser) && work_list.value.length === 0) {
                        get_work_list()
                    }
                }
            },
            {
                immediate: true,
                deep: false,
            }
        )

        const work_form_state = ref('添加作品')
        const dialogFormVisible = ref(false)
        const formLabelWidth = '55px'
        const work_form = reactive({
            title: '',
            content: '',
            display: true,
            topping: false,
        })
        const work_dom = ref(null)
        const work_rules = ref({
            title: [ // 标题限制
                {required: true, message: "请输入标题", trigger: "blur"},
                {
                    validator: function (rule, value, callback) {
                        if (/^[\u4E00-\u9FA5\uF900-\uFA2D\u0020]+$/.test(value) == false) {
                            callback(new Error("只能输入中文和空格"));
                        } else if (value.length < 1 || value.length > 10) {
                            callback(new Error("标题长度必须为[1,10]"));
                        } else {
                            //校验通过
                            callback();
                        }
                    },
                    trigger: "blur"
                }
            ],
            content: [ // 内容限制
                {required: true, message: "请输入内容", trigger: "blur"},
                {
                    validator: function (rule, value, callback) {
                        if (value.length < 10) {
                            callback(new Error("内容长度不得小于10"));
                        } else {
                            //校验通过
                            callback();
                        }
                    },
                    trigger: "blur"
                }
            ],

        })
        let update_work_id = 0;

        const open_work_form = (state, id, pos) => {
            work_form_state.value = state;
            if (state === '编辑作品') {
                update_work_id = id;
                work_form.title = work_list.value[pos].title;
                work_form.content = work_list.value[pos].content;
                work_form.display = work_list.value[pos].display;
                work_form.topping = work_list.value[pos].topping;
            }
            dialogFormVisible.value = true;
        }
        const close_work_form = () => {
            dialogFormVisible.value = false;
            work_form.title = '';
            work_form.content = '';
            work_form.display = true;
            work_form.topping = false;
        }

        const delete_work = (work_id, pos) => {
            authDelete(system_base_url + 'account/works/' + work_id, {})
                .then((resp) => {
                    if (resp.status === 204) {
                        work_list.value.splice(pos, 1);
                        ElMessage({
                            showClose: true,
                            type: 'success',
                            message: '删除作品成功！',
                            duration: 3000,
                        })
                    } else {
                        ElMessage({
                            showClose: true,
                            type: 'error',
                            message: '删除作品失败！',
                            duration: 3000,
                        })
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        }
        const add_work = () => {
            authPost(system_base_url + 'account/works/', work_form)
                .then((resp) => {
                    if (resp.status === 201) {
                        ElMessage({
                            showClose: true,
                            type: 'success',
                            message: '添加作品成功！',
                            duration: 3000,
                        })
                        get_work_list()
                        close_work_form()
                    } else {
                        ElMessage({
                            showClose: true,
                            type: 'error',
                            message: '添加作品失败！',
                            duration: 3000,
                        })
                    }
                })
        }
        const put_work = () => {
            authPut(system_base_url + 'account/works/' + update_work_id, work_form)
                .then((resp) => {
                    if (resp.status === 200) {
                        ElMessage({
                            showClose: true,
                            type: 'success',
                            message: '修改作品成功！',
                            duration: 3000,
                        })
                        get_work_list()
                        close_work_form()
                    } else {
                        ElMessage({
                            showClose: true,
                            type: 'error',
                            message: '修改作品失败！',
                            duration: 3000,
                        })
                    }
                })
        }


        const work_currentPage = ref(1);
        const work_pageSize = ref(9);

        const work_handleSizeChange = (val: number) => {
            // 更新每页展示数据size
            work_pageSize.value = val
        };
        const work_handleCurrentChange = (val: number) => {
            // 更新当前页数是第几页
            work_currentPage.value = val
        };


        return {
            work_list,
            work_have_more,
            get_work_list,
            work_load,

            work_form_state,
            dialogFormVisible,
            formLabelWidth,
            work_form,
            work_dom,
            work_rules,
            open_work_form,
            close_work_form,

            add_work,
            put_work,
            delete_work,


            work_currentPage,
            work_pageSize,

            work_handleSizeChange,
            work_handleCurrentChange,

        }
    }
}
</script>

<style lang="scss" scoped>
.my-dialog .el-dialog {
  width: 360px !important;
}

.detail-div {
  font-family: 瘦金体简, 仿宋, 楷体;
  font-size: 20px;
  width: 100%;
  min-height: 26px;
}

.time-div {
  font-size: 14px;
  color: #6b778c;
  margin-top: 10px;
}

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