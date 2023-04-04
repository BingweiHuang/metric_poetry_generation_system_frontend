<template>
  <!-- 帖子 -->
  <el-card style="width: 100%" shadow="hover">
    <!-- 头像、昵称和时间 -->
    <el-row justify="start" align="middle">
      <!-- 头像 -->
      <el-avatar :size="50" :src="post.author.avatar_url" style="margin-right: 10px; cursor: pointer" @click="open_profile(post.author.id)"/>
      <!-- 昵称 和 时间-->
      <div>
        <el-link :underline="false" style="margin-bottom: 6px; font-size: 18px" @click="open_profile(post.author.id)">{{post.author.nickname}}</el-link>
        <!--                <div>{{post.dateTime.year}}-{{post.dateTime.month}}-{{post.dateTime.day}}</div>-->
        <div>{{post.create_date}}</div>
      </div>
    </el-row>

    <!-- 帖子内容 -->
    <div style="margin-top: 10px; font-size: 18px;">
      {{post.content}}
    </div>

    <!-- 删帖、点赞图标和评论图标 -->
    <div style="margin: 5px 8px 5px 0; display: flex; align-items: center; justify-content: end; font-size: 16px;">
      <!-- 删帖 -->
      <el-popconfirm v-if="post.author.id === $store.getters.get_account.id || $store.getters.get_account.is_superuser"
                     title="确定要删除该帖吗？"
                     confirm-button-text="确定"
                     cancel-button-text="取消"
                     @confirm="delete_post">
        <template #reference>
          <el-link style="margin-right: 10px; font-size: 16px;">删除帖子</el-link>
        </template>
      </el-popconfirm>

      <!-- 点赞图标 -->
      <div style="margin-right: 10px; display: flex; align-items: center">
        <el-icon v-if="post.like_id === 0" size="20" style="cursor: pointer" @click="like(idx1)"><Star /></el-icon>
        <el-icon v-else size="20" style="cursor: pointer; color: #EA3323" @click="cancle_like(post.like_id, idx1)"><StarFilled /></el-icon>
        &nbsp;{{post.like_count}}
      </div>

      <!-- 评论图标 -->
      <div style="display: flex; align-items: center" @click="open_plq(idx1)">
        <el-icon size="20" style="cursor: pointer"><ChatDotRound /></el-icon>
        &nbsp;{{comments.len}}
      </div>
    </div>

    <!-- 评论区 -->
    <div :id="idx1 + '_plq'" style="display: none" class="plq">
      <!-- 评论区主体 -->
      <!-- background-color: #F8F8F8; -->
      <div style=" border-radius: 10px">

        <!-- 输入框 -->
        <div style="display: flex; justify-content: start;">
          <el-input size="" v-model="comment_input" placeholder="善语结善缘，恶语伤人心~"
                    type="textarea" :rows="row_num" maxlength="255" show-word-limit
                    @focus="post_input_focus" @blur="close_input_focus"/>
          <el-button size="" :icon="Promotion" @click="add_comment(idx1)"  :disabled="comment_input === ''"/>
        </div>

        <!-- 评论展示 -->
        <ul v-infinite-scroll="comment_load" infinite-scroll-distance="1" infinite-scroll-immediate="false" class="infinite-list" style="overflow: auto; max-height: 320px;">
          <template v-if="comments.comment_list.length > 0">
            <li v-for="(comment) in comments.comment_list" :key="comment.id" class="infinite-list-item">
              <div>
                <!-- 主体 -->
                <div style="display: flex; justify-content: start; align-items: start;">
                  <!-- 头像 -->
                  <div>
                    <el-avatar :size="25" :src="comment.author.avatar_url"
                               style="margin-right: 5px; cursor: pointer" @click="open_profile(comment.author.id)"/>
                  </div>
                  <!-- 昵称 内容 时间-->
                  <div>
                    <!-- 昵称 -->
                    <div><el-link :underline="false" style="font-size: 16px" @click="open_profile(comment.author.id)">{{comment.author.nickname}}</el-link></div>
                    <!-- 评论内容 -->
                    <div style="margin: 5px 0; font-size: 16px;">
                      {{comment.content}}
                    </div>
                    <!-- 评论时间 和 删除评论按钮-->
                    <div style="display: flex; align-items: center; font-size: 14px;">
                      <div>{{comment.create_date}}</div>
                      <div style="margin-right: 10px;"></div>

                      <!-- 帖主或评论的人可以删除评论 -->
                      <el-popconfirm v-if="[comment.author.id, post.author.id].includes($store.getters.get_account.id) || $store.getters.get_account.is_superuser"
                                     title="确定要删除该评论吗？"
                                     confirm-button-text="确定"
                                     cancel-button-text="取消"
                                     @confirm="delete_comment(comment.id)">
                        <template #reference>
                          <el-link >删除评论</el-link>
                        </template>
                      </el-popconfirm>


                    </div>
                  </div>
                </div>
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
</template>

<script lang="ts">
import {reactive, ref} from "vue";
import {ElMessage} from "element-plus";
import {Delete, Get, Post, system_base_url} from "@/utils/request";
import {
  Promotion,
} from '@element-plus/icons-vue'

export default {
  name: "PostComponent",
  components: {},
  props: {
    post: {
      type: Object,
      required: true,
    },
    idx1: {
      type: Number,
      required: true,
    },
  },
  setup(props, context) {

    const comment_input = ref('')
    const row_num = ref(1)
    const post_input_focus = () => {
      row_num.value = 3;
    }

    const close_input_focus = () => {
      row_num.value = 1;
    }

    const comments = reactive({
      comment_list: props.post.post_comments,
      len: props.post.comment_count,
      next_url: '',
      limit: 6,
    })

    const open_profile = (id) => {
      context.emit('open_profile', id);
    }

    const delete_post = () => {
      context.emit('delete_post', props.post.id);
    }

    const like = (pos) => {
      context.emit('like', {post_id:props.post.id, pos:pos});
    }

    const cancle_like = (like_id, pos) => {
      context.emit('cancle_like', {like_id:like_id, pos:pos});
    }


    const get_comment_list = async () => {
      await Get(system_base_url + 'account/comments/', {
        post: props.post.id, limit: comments.limit,
      }, true)
          .then((resp) => {
            if (resp.status === 200) {
              const result = resp.data.results
              comments.len = resp.data.count; // 更新评论数量
              comments.next_url = resp.data.next;
              comments.comment_list = result
            }
          })
          .catch((error) => {
            console.log('error:', error)
          })
    }

    const open_plq = async (pos) => {
      const the_plq = document.getElementById(pos + '_plq')
      if (the_plq.style.display === 'block') {
        return false
      }
      await get_comment_list()
      the_plq.style.display = 'block';
    }

    const hide_plq = (idx) => {
      const the_plq = document.getElementById(idx + '_plq')
      the_plq.style.display = 'none';
    }

    const add_comment = () => {
      if (comment_input.value === '') {
        ElMessage({
          showClose: true,
          type: 'error',
          message: '请输入内容！',
          duration: 3000,
        })
        return false
      }

      Post(system_base_url + 'account/comments/', {
        // account_id: store.getters.get_account.id,
        post_id: props.post.id,
        content: comment_input.value,
      }, true)
          .then((resp) => {
            if (resp.status === 201) {
              comment_input.value = ''
              comments.len += 1
              ElMessage({
                showClose: true,
                type: 'success',
                message: '评论成功！',
                duration: 3000,
              })
              get_comment_list()
            } else {
              ElMessage({
                showClose: true,
                type: 'error',
                message: '评论失败！',
                duration: 3000,
              })
            }
          })
          .catch((error) => {
            console.log('error:', error)
          })
    }

    const delete_comment = (comment_id) => {

      Delete(system_base_url + 'account/comments/' + comment_id, {}, true)
          .then((resp) => {
            if (resp.status === 204) {
              // comments.comment_list.splice(pos, 1)
              comments.comment_list = comments.comment_list.filter(comment => comment.id !== comment_id)
              comments.len -= 1
              ElMessage({
                showClose: true,
                message: '评论删除成功！',
                type: 'success',
                duration: 3000,
              })
            } else {
              ElMessage({
                showClose: true,
                message: '评论删除失败！',
                type: 'error',
                duration: 3000,
              })
            }

          })
    }

    const comment_load = () => {
      if (comments.next_url === null || comments.next_url === '') {
        ElMessage({
          showClose: true,
          message: '已经没有数据咯~',
          type: 'warning',
          duration: 3000,
        })
        return false
      }

      Get(comments.next_url, {post: props.post.id, limit: comments.limit,}, true)
          .then((resp) => {
            if (resp.status === 200) {
              const result = resp.data.results
              const ofs = resp.data.count - comments.len; // 浏览过程中保护缓存，防止顶贴
              comments.len = resp.data.count
              comments.next_url = resp.data.next
              comments.comment_list.push(...(result.splice(ofs > 0 ? ofs : 0))) // 保护缓存，防止删帖
            } else {
              ElMessage({
                showClose: true,
                message: '刷新出错！',
                type: 'error',
                duration: 3000,
              })
            }

          })
          .catch((error) => {
            console.log(error);

          })
    }

    return {
      comment_input,
      row_num,
      post_input_focus,
      close_input_focus,
      comments,
      open_profile,
      delete_post,
      like,
      cancle_like,
      open_plq,
      hide_plq,
      add_comment,
      delete_comment,
      comment_load,

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

.my .el-card {
  border: none;
  background: none;
}

.plq .el-textarea {
  font-size: 16px;
}
</style>