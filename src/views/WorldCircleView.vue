<template>


  <el-row justify="center" align="middle">
    <el-col :xl="2" :lg="2" :md="2" :sm="1" :xs="0">

    </el-col>
    <!-- 主体页面 -->
    <el-col :xl="20" :lg="20" :md="20" :sm="22" :xs="24">
      <!-- 发帖输入框 -->
      <div style="display: flex; justify-content: start; margin: 10px">
        <el-input size="" v-model="post_input" placeholder="互联网并非逍遥法外之地，请注意言辞，一旦发言违规直接自动封号~"
                  type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" maxlength="255" show-word-limit/>
        <el-button size="" :icon="Promotion" @click="add_post"/>
      </div>

      <!-- 帖子展示无限滑动栏 -->
      <div style="overflow-y:hidden">
        <ul v-infinite-scroll="load" infinite-scroll-distance="50" class="infinite-list" style="overflow: auto" infinite-scroll-immediate="false">
          <li v-for="(post, idx1) in post_list" :key="post.id" style="margin: 10px">
            <!-- 帖子 -->
            <el-card style="width: 100%">
              <!-- 头像、昵称和时间 -->
              <el-row justify="start" align="middle">
                <!-- 头像 -->
                <el-avatar :size="50" :src="post.account_avatarUrl" style="margin-right: 10px"/>
                <!-- 昵称 和 时间-->
                <div>
                  <div style="margin-bottom: 6px">{{post.account_nickname}}</div>
                  <!--                <div>{{post.dateTime.year}}-{{post.dateTime.month}}-{{post.dateTime.day}}</div>-->
                  <div>{{post.dateTime}}</div>
                </div>
              </el-row>

              <!-- 帖子内容 -->
              <div style="margin-top: 10px">
                {{post.content}}
              </div>

              <!-- 删帖、点赞和评论 -->
              <div style="margin: 5px 8px 5px 0; display: flex; align-items: center; justify-content: end">
                <!-- 删帖 -->
                <el-popconfirm v-if="post.account === $store.getters.get_account.id"
                               title="确定要删除该帖吗？"
                               confirm-button-text="确定"
                               cancel-button-text="取消"
                               @confirm="delete_post(post.id)">
                  <template #reference>
                    <el-link style="font-size: 10px; margin-right: 10px">删除帖子</el-link>
                  </template>
                </el-popconfirm>

                <!-- 点赞 -->
                <div style="margin-right: 10px; display: flex; align-items: center">
                  <el-icon v-if="!post.is_liked" size="20" style="cursor: pointer" @click="like(idx1)"><Star /></el-icon>
                  <el-icon v-else size="20" style="cursor: pointer; color: #EA3323" @click="cancle_like(idx1)"><StarFilled /></el-icon>
                  &nbsp;{{post.likeCount}}
                </div>

                <!-- 评论 -->
                <div style="display: flex; align-items: center" @click="open_plq(post.id, idx1)">
                  <el-icon size="20" style="cursor: pointer"><ChatDotRound /></el-icon>
                  &nbsp;{{post.commentCount}}
                </div>
              </div>

              <!-- 评论区 -->
              <div :id="idx1 + '_plq'" style="display: none">
                <!-- 评论区主体 -->
                <div style="background-color: #F8F8F8; border-radius: 10px">

                  <!-- 输入框 -->
                  <div style="display: flex; justify-content: start">
                    <el-input size="" v-model="comment_input" placeholder="善语结善缘，恶语伤人心~"
                              type="textarea" :autosize="{ minRows: 1, maxRows: 3 }" maxlength="255" show-word-limit/>
                    <el-button size="" :icon="Promotion" @click="add_comment(post.id)"/>
                  </div>

                  <!-- 评论展示 -->
                  <ul v-infinite-scroll="load2" infinite-scroll-distance="30" class="infinite-list" style="overflow: auto; max-height: 300px;">
                    <template v-if="post.comment_list.length > 0">
                      <li v-for="(comment, idx2) in post.comment_list" :key="comment.id" class="infinite-list-item">
                        <div>
                          <!-- 主体 -->
                          <el-row justify="start" align="top">
                            <!-- 头像 -->
                            <el-avatar :size="21" :src="(post.account_list)[idx2].account_avatarUrl" style="margin-right: 5px"/>
                            <!-- 昵称 内容 时间-->
                            <div>
                              <!-- 昵称 -->
                              <div style="">{{(post.account_list)[idx2].account_nickname}}</div>
                              <!-- 评论内容 -->
                              <div style="margin: 5px 0">
                                {{comment.content}}
                              </div>
                              <!-- 评论时间 和 删除评论按钮-->
                              <div style="display: flex; align-items: center; font-size: 10px;">
                                <div>{{comment.dateTime}}</div>
                                <div style="margin-right: 10px;"></div>

                                <el-popconfirm v-if="post.account_list[idx2].id === $store.getters.get_account.id"
                                               title="确定要删除该评论吗？"
                                               confirm-button-text="确定"
                                               cancel-button-text="取消"
                                               @confirm="delete_comment(comment.id, post.id)">
                                  <template #reference>
                                    <el-link style="font-size: 10px;">删除评论</el-link>
                                  </template>
                                </el-popconfirm>


                              </div>
                            </div>
                          </el-row>
                        </div>

                      </li>
                    </template>
                    <li v-else style="text-align: center; color: #6b778c; margin-top: 10px">还没有评论，快来抢沙发~</li>
                  </ul>
                </div>

                <!-- 收起评论区 -->
                <div style="text-align: center; font-size: 16px">
                  <el-link @click="hide_plq(idx1)">收起评论区</el-link>
                </div>
              </div>
            </el-card>
          </li>
        </ul>
      </div>
    </el-col>
    <el-col :xl="2" :lg="2" :md="2" :sm="1" :xs="0">

    </el-col>
  </el-row>


</template>

<script lang="ts">

import {onMounted, ref} from 'vue'
import {Delete, Get, Post} from "@/utils/request";
import {
  Promotion,
} from '@element-plus/icons-vue'
import store from "@/store";
import {ElMessage} from "element-plus";

export default {
  name: "WorldCircleView",
  components: {},
  setup() {
    let request_pos = 0
    let last_len = 0

    const post_input = ref('')
    const comment_input = ref('')

    const count = ref(10)
    const post_list = ref([])
    const post_id2idx = ref()
    const load = async () => {
      // count.value += 2
      console.log('load')
      if (request_pos > 0 && last_len > 0) {
        console.log('数组之前：', post_list.value)
        console.log('字典之前：', post_id2idx.value)
        await Get('post/post', {
          order: 'dateTime',
          mode: 0,
          my_id: store.getters.get_account.id,
          request_pos: request_pos,
          last_len: last_len,
        }, false)
        .then((resp) => {

          post_list.value.push(...(resp.data.post_list))
          console.log('数组之后：', post_list.value)


          post_id2idx.value = Object.assign({}, post_id2idx.value, resp.data.post_id2idx)
          console.log('字典之后：', post_id2idx.value)
          // post_id2idx.value = resp.data.post_id2idx

          request_pos = resp.data.request_pos
          last_len = resp.data.last_len
          console.log('request_pos:', request_pos)
        })
        .catch((error) => {
          console.log(error.response)
          ElMessage({
            showClose: true,
            message: '刷新出错！',
            type: 'error',
            duration: 5000,
          })
        })
      } else {
        ElMessage({
          showClose: true,
          message: '已经没有数据咯~',
          type: 'warning',
          duration: 5000,
        })
      }

    }

    const load2 = () => {
      // count.value += 2
      console.log('load2')
    }


    onMounted(() => {
      request_pos = 0
      last_len = 0
      Get('post/post', {
        order: 'dateTime',
        mode: 0,
        my_id: store.getters.get_account.id,
        request_pos: request_pos,
        last_len: last_len,
      }, false)
      .then((resp) => {
        post_list.value = resp.data.post_list
        post_id2idx.value = resp.data.post_id2idx
        request_pos = resp.data.request_pos
        last_len = resp.data.last_len
        console.log('resp.data.post_list:', resp.data.post_list)
        console.log('resp.data.post_id2idx:', resp.data.post_id2idx)
        console.log('request_pos:', request_pos)
        console.log('last_len:', last_len)
      })
      .catch((error) => {
        console.log(error.response)
      })

    })

    const like = (idx) => {
      post_list.value[idx].is_liked = true;
      post_list.value[idx].likeCount += 1;
      Post('post/like', {
        account_id: store.getters.get_account.id,
        post_id: post_list.value[idx].id,
      }, false)
    }

    const cancle_like = (idx) => {
      post_list.value[idx].is_liked = false;
      post_list.value[idx].likeCount -= 1;
      Delete('post/like', {
        account_id: store.getters.get_account.id,
        post_id: post_list.value[idx].id,
      }, false)
    }

    const hide_plq = (idx) => {
      comment_input.value = ''
      const the_plq = document.getElementById(idx + '_plq')
      the_plq.style.display = 'none';
    }

    const get_comment = async (post_id) => {
      await Get('post/comment', {
        post_id: post_id,
      }, false)
          .then((resp) => {
            post_list.value[post_id2idx.value[post_id]].comment_list = resp.data.comment_list; // 刷新帖子的评论
            post_list.value[post_id2idx.value[post_id]].commentCount = resp.data.comment_list.length // 刷新帖子的评论数量

            post_list.value[post_id2idx.value[post_id]].account_list = resp.data.account_list;

          })
          .catch((error) => {
            console.log('发生错误')
            console.log('error:', error)
            // console.log(error.response)
          })
    }

    const open_plq = async (post_id, idx) => {
      const the_plq = document.getElementById(idx + '_plq')
      if (the_plq.style.display === 'block') {
        console.log('打开的也来点，点你吗')
        return false
      }
      await get_comment(post_id)
      the_plq.style.display = 'block';
    }

    const add_comment = (post_id) => {
      if (comment_input.value === '') {
        ElMessage({
          showClose: true,
          type: 'error',
          message: '请输入内容！',
          duration: 5000,
        })
        return false
      }

      Post('post/comment', {
        account_id: store.getters.get_account.id,
        post_id: post_id,
        content: comment_input.value,
      }, false)
      .then((resp) => {
        comment_input.value = ''
        get_comment(post_id)
      })
      .catch((error) => {
        console.log('发生错误')
        console.log('error:', error)
        // console.log(error.response)
      })
    }
    const delete_comment = (comment_id, post_id) => {

      Delete('post/comment', {
        id: comment_id,
      }, false)
      .then((resp) => {
        get_comment(post_id)
      })
    }

    const add_post = () => {
      if (post_input.value.length < 10) {
        ElMessage({
          showClose: true,
          type: 'error',
          message: '请输入不少于十个字符内容！',
          duration: 5000,
        })
        return false
      }

      Post('post/post', {
        content: post_input.value,
        id: store.getters.get_account.id,
      }, false)
      .then((resp) => {
        post_input.value = ''
      })

    }

    const delete_post = (post_id) => {
      Delete('post/post', {
        id: post_id,
      }, false)
      .then((resp) => {
        console.log(resp)
        const index = post_id2idx.value[post_id]
        post_list.value.splice(index, 1)
      })
    }

    return {
      post_input,
      comment_input,
      count,
      post_list,
      load,
      load2,


      like,
      cancle_like,
      hide_plq,
      open_plq,
      add_comment,
      delete_comment,
      add_post,
      delete_post,

      Promotion,
    }
  }
}
</script>

<style lang="scss" scoped>
.infinite-list {
  height: 800px;
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
</style>