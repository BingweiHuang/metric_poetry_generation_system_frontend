<template>

  <!-- 主体页面 -->
    <el-row>
        <el-col :xl="0" :lg="0" :md="0" :sm="0" :xs="0"></el-col>

        <el-col :xl="24" :lg="24" :md="24" :sm="24" :xs="24" class="my">

            <!-- 个人资料展示页面 -->
            <el-card style="margin: 10px 0">

                <!-- 退出登录 -->
                <div style="display: flex; justify-content: right" v-if="$store.getters.get_is_login && is_me">
                    <!-- 退出登录按钮 -->
                    <el-popconfirm
                            title="确定要退出登录吗？"
                            confirm-button-text="确定"
                            cancel-button-text="取消"
                            @confirm="log_out">
                        <template #reference>
                            <el-button link type="danger">退出登录</el-button>
                        </template>
                    </el-popconfirm>
                </div>

                <!-- 个人资料 -->
                <el-row justify="start" align="middle">
                    <!-- 头像 昵称 -->
                    <el-col :span="8">
                        <div style="text-align: center">
                            <el-avatar :size="100" :src="the_account.avatar_url"/>
                            <div>{{ the_account.nickname }}</div>
                        </div>
                    </el-col>

                    <!-- 其他资料 -->
                    <el-col :span="16">
                        <div style="display: flex; align-items: center; ">
                            <el-link :underline="false" style="font-size: 16px" @click="activeName = '关注'">
                                关注：{{ the_account.follow_count }}
                            </el-link>
                            &nbsp;&nbsp;
                            <el-link :underline="false" style="font-size: 16px" @click="activeName = '粉丝'">
                                粉丝：{{ the_account.fan_count }}
                            </el-link>
                            &nbsp;&nbsp;&nbsp;
                            <el-button type="success" plain circle :icon="Plus" size="small"
                                       v-if="follow_id === 0 && (!is_me)" @click="add_follow"/>
                            <el-button type="success" circle :icon="Check" size="small"
                                       @click="delete_follow(follow_id)"
                                       v-if="follow_id"/>
                        </div>
                        <div>邮箱：{{ the_account.email }}</div>
                        <div>账号：{{ the_account.username }}
                            <el-tag type="" size="small" class="mx-1" effect="plain" v-if="the_account.is_superuser">
                                管理员
                            </el-tag>
                        </div>
                        <div>个人简介：{{ the_account.introduction }}</div>
                    </el-col>
                </el-row>

            </el-card>

            <!-- 标签页切换 -->
            <el-card>
                <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">

                    <el-tab-pane label="帖子" name="帖子">
                        <!-- 帖子展示无限滑动栏 -->
                        <el-empty v-if="posts.post_list && posts.post_list.length === 0" description="没有发表帖子哦~"/>
                        <div v-else style="overflow-y:hidden">
                            <ul v-infinite-scroll="post_load" infinite-scroll-distance="1" class="infinite-list"
                                style="overflow: auto" infinite-scroll-immediate="false">
                                <template v-if="posts.post_list">
                                    <li v-for="(post, idx1) in posts.post_list" :key="post.id" style="margin: 10px">
                                        <PostComponent :post="post" :idx1="idx1" @open_profile="open_profile"
                                                       @delete_post="delete_post"
                                                       @like="like" @cancle_like="cancle_like"/>
                                    </li>
                                </template>
                            </ul>
                        </div>

                    </el-tab-pane>
                    <el-tab-pane label="作品" name="作品">

                        <WorkTab :the_account="the_account" :is_me="is_me" :activeName="activeName"/>

                    </el-tab-pane>
                    <el-tab-pane label="诗作收藏" name="诗作收藏">

                        <ShiCollectionTab :the_account="the_account" :is_me="is_me" :active-name="activeName"/>

                    </el-tab-pane>
                    <el-tab-pane label="词作收藏" name="词作收藏">

                        <CiCollectionTab :the_account="the_account" :is_me="is_me" :active-name="activeName"/>

                    </el-tab-pane>
                    <el-tab-pane label="编辑个人资料" name="编辑个人资料" v-if="is_me">

                        <PersonalDataTab :the_account="the_account" @update_account="update_account"
                                         @update_account_avatar_url="update_account_avatar_url"/>

                    </el-tab-pane>
                    <el-tab-pane label="修改密码" name="修改密码" v-if="is_me">

                        <UpdatePasswordTab/>

                    </el-tab-pane>
                    <el-tab-pane label="关注" name="关注">

                        <FollowListTab :is_me="is_me" :account_id="Number($route.params.account_id)"
                                       @open_profile="open_profile"/>

                    </el-tab-pane>
                    <el-tab-pane label="粉丝" name="粉丝">

                        <FanListTab :account_id="Number($route.params.account_id)" :active-name="activeName"
                                    @open_profile="open_profile"/>

                    </el-tab-pane>
                </el-tabs>
            </el-card>

        </el-col>

        <el-col :xl="0" :lg="0" :md="0" :sm="0" :xs="0"></el-col>
    </el-row>

</template>

<script lang="ts">

import {ref, reactive, onMounted, toRaw, watch} from 'vue'
import type {TabsPaneContext} from 'element-plus'
import {ElMessage} from 'element-plus'
import {authDelete, authGet, authPost, authPut, Get, system_base_url} from "@/utils/request";
import {useRoute, useRouter} from "vue-router";
import store from "@/store";
import WorkTab from "@/components/profile/WorkTab.vue";
import ShiCollectionTab from "@/components/profile/ShiCollectionTab.vue";
import CiCollectionTab from "@/components/profile/CiCollectionTab.vue";
import PersonalDataTab from "@/components/profile/PersonalDataTab.vue";
import UpdatePasswordTab from "@/components/profile/UpdatePasswordTab.vue";
import FollowListTab from "@/components/profile/FollowListTab.vue";
import FanListTab from "@/components/profile/FanListTab.vue";
import PostComponent from "@/components/world_circle/PostComponent.vue";
import {
    Plus,
    Check,
} from '@element-plus/icons-vue'

export default {
    name: "ProfileView",
    components: {
        WorkTab,
        ShiCollectionTab,
        CiCollectionTab,
        PersonalDataTab,
        UpdatePasswordTab,
        FollowListTab,
        FanListTab,

        PostComponent,
    },
    setup() {

        const activeName = ref('帖子')
        const is_me = ref(false)
        const route = useRoute();
        const the_account = reactive({
            id: 0,
            avatar_url: '',
            nickname: '',
            follow_count: 0,
            fan_count: 0,
            email: '',
            username: '',
            introduction: '',
            display_works: true,
            display_collections: true,
            is_superuser: false,
        });
        const follow_id = ref(0);

        watch(
            () => (route.params.account_id),
            (val, preVal) => {
                is_me.value = (Number(val) === store.getters.get_account.id)
                the_account.id = Number(val);
            },
            {
                immediate: true,
                deep: false,
            }
        )

        const handleClick = (tab: TabsPaneContext, event: Event) => {
            if (tab.props.name === '关注') {
                // console.log('关注')
            }
        }

        const posts = reactive({
            post_list: null,
            len: 0,
            next_url: '',
            limit: 6,
        });

        const get_post_list = () => {

            posts.len = 0;
            let params = {
                limit: posts.limit,
                author: the_account.id,
            }

            authGet(system_base_url + 'account/posts/', params)
                .then((resp) => {
                    if (resp.status === 200) {
                        posts.post_list = resp.data.results
                        posts.next_url = resp.data.next
                        posts.len = resp.data.count
                    } else {
                        ElMessage({
                            showClose: true,
                            message: '帖子获取失败！',
                            type: 'error',
                            duration: 3000,
                        })
                    }

                })
                .catch((error) => {
                    console.log(error.response)
                })
        }
        const post_load = async () => {

            if (posts.next_url === null || posts.next_url === '') {
                ElMessage({
                    showClose: true,
                    message: '已经没有数据咯~',
                    type: 'warning',
                    duration: 3000,
                })
                return false
            }

            await authGet(posts.next_url, {})
                .then((resp) => {

                    posts.next_url = resp.data.next
                    const ofs = resp.data.count - posts.len; // 浏览过程中保护缓存，防止顶贴
                    posts.len = resp.data.count;
                    posts.post_list.push(...(resp.data.results.splice(ofs > 0 ? ofs : 0))) // 保护缓存，防止删帖
                })
                .catch((error) => {
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

        const like = (obj) => {

            authPost(system_base_url + 'account/likes/', {
                // account_id: store.getters.get_account.id,
                post_id: obj.post_id
            })
                .then((resp) => {
                    posts.post_list[obj.pos].like_id = resp.data.id;
                    posts.post_list[obj.pos].like_count += 1;
                })

        }

        const cancle_like = (obj) => {
            authDelete(system_base_url + 'account/likes/' + obj.like_id, {})
                .then((resp) => {
                    posts.post_list[obj.pos].like_id = 0;
                    posts.post_list[obj.pos].like_count -= 1;
                })
        }

        const delete_post = (post_id) => {
            authDelete(system_base_url + 'account/posts/' + post_id, {})
                .then((resp) => {
                    if (resp.status === 204) {
                        // posts.post_list.splice(obj.pos, 1)
                        posts.post_list = posts.post_list.filter(post => post.id !== post_id)
                        ElMessage({
                            showClose: true,
                            message: '删帖成功！',
                            type: 'success',
                            duration: 3000,
                        })
                    } else {
                        ElMessage({
                            showClose: true,
                            message: '删帖失败！',
                            type: 'error',
                            duration: 3000,
                        })
                    }
                })
        }

        watch(
            () => (activeName.value),
            (val, preVal) => {
                if (val === '帖子' && posts.post_list === null) {
                    get_post_list()
                }
            },
            {
                immediate: true,
                deep: false,
            }
        )

        onMounted(() => {
            authGet(system_base_url + 'account/accounts/' + the_account.id, {})
                .then((resp) => {
                    the_account.avatar_url = resp.data.avatar_url
                    the_account.nickname = resp.data.nickname
                    the_account.follow_count = resp.data.follow_count
                    the_account.fan_count = resp.data.fan_count
                    the_account.email = resp.data.email
                    the_account.username = resp.data.username
                    the_account.introduction = resp.data.introduction
                    the_account.display_works = resp.data.display_works
                    the_account.display_collections = resp.data.display_collections
                    the_account.is_superuser = resp.data.is_superuser
                    follow_id.value = resp.data.follow_id

                })
                .catch((error) => {
                    console.log(error);
                })

        })

        const update_account = (form, callBack) => {
            authPut(system_base_url + 'account/accounts/' + store.getters.get_account.id, form)
                .then((resp) => {
                    if (resp.status === 200) {
                        the_account.nickname = resp.data.nickname
                        the_account.follow_count = resp.data.follow_count
                        the_account.fan_count = resp.data.fan_count
                        // the_account.email = resp.data.email
                        the_account.username = resp.data.username
                        the_account.introduction = resp.data.introduction
                        the_account.display_works = resp.data.display_works
                        the_account.display_collections = resp.data.display_collections
                        // the_account.is_superuser = resp.data.is_superuser

                        follow_id.value = resp.data.follow_id
                    }
                    callBack(resp.status)
                })
                .catch((error) => {
                    console.log(error);
                })
        }

        const update_account_avatar_url = (url) => {
            the_account.avatar_url = url
        }


        const router = useRouter();
        const open_profile = (id) => {
            router.push('/Profile/' + id)
        }

        const delete_follow = (id) => {
            authDelete(system_base_url + 'account/follows/' + id, {})
                .then((resp) => {
                    if (resp.status === 204) {
                        follow_id.value = 0;
                        the_account.fan_count -= 1;
                        ElMessage({
                            showClose: true,
                            message: '取消关注成功！',
                            type: 'success',
                            duration: 3000,
                        })
                    } else {
                        ElMessage({
                            showClose: true,
                            message: '取消关注失败！',
                            type: 'error',
                            duration: 3000,
                        })
                    }
                })
        }

        const add_follow = () => {
            authPost(system_base_url + 'account/follows/', {follow_id: the_account.id})
                .then((resp) => {
                    if (resp.status === 201) {
                        follow_id.value = resp.data.id;
                        the_account.fan_count += 1;
                        ElMessage({
                            showClose: true,
                            message: '关注成功！',
                            type: 'success',
                            duration: 3000,
                        })
                    } else {
                        ElMessage({
                            showClose: true,
                            message: '关注失败！',
                            type: 'error',
                            duration: 3000,
                        })
                    }
                })
        }

        const log_out = () => {
            router.push('/')
            store.dispatch('logout');
        }


        return {
            update_account_avatar_url,
            update_account,
            open_profile,
            delete_follow,
            add_follow,

            the_account,
            follow_id,

            posts,
            get_post_list,
            post_load,
            like,
            cancle_like,
            delete_post,
            log_out,

            activeName,
            is_me,
            handleClick,
            Plus,
            Check,
        }
    }
}
</script>

<style lang="scss" scoped>

.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

.my-el-pagination {
  align-items: center; /*竖直居中*/
  justify-content: center; /*水平居中*/
  margin-top: 20px;
  margin-bottom: 20px;
}

.infinite-list {
  height: 600px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.infinite-list .infinite-list-item {
  //width: 100%;
  display: flex;
  align-items: center;
  justify-content: start;
  min-height: 50px;
  //background: var(--el-color-primary-light-9);
  margin: 10px;
  //color: var(--el-color-primary);
}

.infinite-list .infinite-list-item + .list-item {
  margin-top: 10px;
}

.my .el-card {
  border: none;
  background: none;
}
</style>