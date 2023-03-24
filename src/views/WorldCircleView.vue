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
        <ul v-infinite-scroll="load" infinite-scroll-distance="0" class="infinite-list" style="overflow: auto" infinite-scroll-immediate="false">
          <li v-for="(post, idx1) in post_list" :key="post.id" style="margin: 10px">
            <!-- 帖子 -->
            <el-card style="width: 100%">
              <!-- 头像、昵称和时间 -->
              <el-row justify="start" align="middle">
                <!-- 头像 -->
                <el-avatar :size="50" :src="post.author.avatar_url" style="margin-right: 10px"/>
                <!-- 昵称 和 时间-->
                <div>
                  <div style="margin-bottom: 6px">{{post.author.nickname}}</div>
                  <!--                <div>{{post.dateTime.year}}-{{post.dateTime.month}}-{{post.dateTime.day}}</div>-->
                  <div>{{post.create_date}}</div>
                </div>
              </el-row>

              <!-- 帖子内容 -->
              <div style="margin-top: 10px">
                {{post.content}}
              </div>

              <!-- 删帖、点赞和评论 -->
              <div style="margin: 5px 8px 5px 0; display: flex; align-items: center; justify-content: end">
                <!-- 删帖 -->
                <el-popconfirm v-if="post.author.id === $store.getters.get_account.id"
                               title="确定要删除该帖吗？"
                               confirm-button-text="确定"
                               cancel-button-text="取消"
                               @confirm="delete_post(post.id, idx1)">
                  <template #reference>
                    <el-link style="font-size: 10px; margin-right: 10px">删除帖子</el-link>
                  </template>
                </el-popconfirm>

                <!-- 点赞 -->
                <div style="margin-right: 10px; display: flex; align-items: center">
                  <el-icon v-if="post.like_id === 0" size="20" style="cursor: pointer" @click="like(post.id, idx1)"><Star /></el-icon>
                  <el-icon v-else size="20" style="cursor: pointer; color: #EA3323" @click="cancle_like(post.like_id, idx1)"><StarFilled /></el-icon>
                  &nbsp;{{post.like_count}}
                </div>

                <!-- 评论 -->
                <div style="display: flex; align-items: center" @click="open_plq(post.id, idx1)">
                  <el-icon size="20" style="cursor: pointer"><ChatDotRound /></el-icon>
                  &nbsp;{{post.comment_count}}
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
                    <el-button size="" :icon="Promotion" @click="add_comment(post.id, idx1)"/>
                  </div>

                  <!-- 评论展示 -->
                  <ul v-infinite-scroll="load2" infinite-scroll-distance="0" infinite-scroll-immediate="false" class="infinite-list" style="overflow: auto; max-height: 300px;">
                    <template v-if="post.post_comments.length > 0">
                      <li v-for="(comment) in post.post_comments" :key="comment.id" class="infinite-list-item">
                        <div>
                          <!-- 主体 -->
                          <el-row justify="start" align="top">
                            <!-- 头像 -->
                            <el-avatar :size="21" :src="comment.author.avatar_url" style="margin-right: 5px"/>
                            <!-- 昵称 内容 时间-->
                            <div>
                              <!-- 昵称 -->
                              <div style="">{{comment.author.nickname}}</div>
                              <!-- 评论内容 -->
                              <div style="margin: 5px 0">
                                {{comment.content}}
                              </div>
                              <!-- 评论时间 和 删除评论按钮-->
                              <div style="display: flex; align-items: center; font-size: 10px;">
                                <div>{{comment.create_date}}</div>
                                <div style="margin-right: 10px;"></div>

                                <!-- 帖主或评论的人可以删除评论 -->
                                <el-popconfirm v-if="[comment.author.id, post.id].includes($store.getters.get_account.id)"
                                               title="确定要删除该评论吗？"
                                               confirm-button-text="确定"
                                               cancel-button-text="取消"
                                               @confirm="delete_comment(comment.id, post.id, idx1)">
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
import {parse} from "@typescript-eslint/parser";

export default {
  name: "WorldCircleView",
  components: {},
  setup() {
    const limit = 5;
    let last_len = 0
    let next_url = ''

    const post_input = ref('')
    const comment_input = ref('')

    const count = ref(10)
    const post_list = ref([])
    const load = async () => {
      console.log('load')
      console.log('next_url:', next_url)

      if (next_url === null || next_url === '') {
        ElMessage({
          showClose: true,
          message: '已经没有数据咯~',
          type: 'warning',
          duration: 5000,
        })
        return false
      }

      await Get(next_url, {}, true)
          .then((resp) => {


            next_url = resp.data.next
            console.log('next_url:', next_url)
            const ofs = resp.data.count - last_len;
            last_len = resp.data.count;
            post_list.value.push(...(resp.data.results.splice(ofs)))
            /*if (ofs > 0) {
              console.log('ofs:', ofs)

              const url_arr = (next_url).toString().split("offset=")
              next_url = url_arr[0] + "offset=" + (parseInt(url_arr[1]) + ofs).toString()
              console.log('after_next_url:', next_url)
            }*/


            console.log('数组之后：', post_list.value)

          })
          .catch((error) => {
            console.log('error:', error)
            console.log('error.response:', error.response)
            ElMessage({
              showClose: true,
              message: '刷新出错！',
              type: 'error',
              duration: 5000,
            })
          })

    }

    const load2 = () => {
      // count.value += 2
      console.log('load2')
    }


    onMounted(() => {
      last_len = 0
      Get('account/posts/', {limit: limit}, true)
      .then((resp) => {
        post_list.value = resp.data.results
        next_url = resp.data.next
        console.log('next_url:', next_url)
        last_len = resp.data.count
      })
      .catch((error) => {
        console.log(error.response)
      })

    })

    const like = (post_id, pos) => {

      Post('account/likes/', {
        // account_id: store.getters.get_account.id,
        post_id: post_id
      }, true)
          .then((resp) => {
            post_list.value[pos].like_id = resp.data.id;
            post_list.value[pos].like_count += 1;
          })

    }

    const cancle_like = (like_id, idx) => {
      Delete('account/likes/' + like_id, {}, true)
          .then((resp) => {
            post_list.value[idx].like_id = 0;
            post_list.value[idx].like_count -= 1;
          })
    }

    const hide_plq = (idx) => {
      comment_input.value = ''
      const the_plq = document.getElementById(idx + '_plq')
      the_plq.style.display = 'none';
    }

    const get_comment = async (post_id, pos) => {
      console.log('post_id:', post_id)
      await Get('account/comments/', {
        post: post_id,
      }, true)
          .then((resp) => {
            console.log(resp.data.results)
            post_list.value[pos].post_comments = resp.data.results
            console.log('post_list.value:', post_list.value)
          })
          .catch((error) => {
            console.log('error:', error)
          })
    }

    const open_plq = async (post_id, pos) => {
      const the_plq = document.getElementById(pos + '_plq')
      if (the_plq.style.display === 'block') {
        alert('打开的也来点，点你吗')
        return false
      }
      await get_comment(post_id, pos)
      the_plq.style.display = 'block';
    }

    const add_comment = (post_id, pos) => {
      if (comment_input.value === '') {
        ElMessage({
          showClose: true,
          type: 'error',
          message: '请输入内容！',
          duration: 5000,
        })
        return false
      }

      Post('account/comments/', {
        // account_id: store.getters.get_account.id,
        post_id: post_id,
        content: comment_input.value,
      }, true)
      .then((resp) => {
        comment_input.value = ''
        get_comment(post_id, pos)
      })
      .catch((error) => {
        console.log('error:', error)
        // console.log(error.response)
      })
    }
    const delete_comment = (comment_id, post_id, pos) => {

      Delete('account/comments/', {
        id: comment_id,
      }, true)
      .then((resp) => {
        get_comment(post_id, pos)
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

      Post('account/posts/', {
        content: post_input.value,
        // id: store.getters.get_account.id,
      }, true)
      .then((resp) => {
        post_input.value = ''
        last_len = 0
        Get('account/posts/', {limit: limit}, true)
            .then((resp) => {
              post_list.value = resp.data.results
              next_url = resp.data.next
              last_len = resp.data.count
            })
            .catch((error) => {
              console.log(error.response)
            })
        
      })

    }

    const delete_post = (post_id, pos) => {
      Delete('account/posts/', {
        id: post_id,
      }, true)
      .then((resp) => {
        console.log(resp)
        post_list.value.splice(pos, 1)
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