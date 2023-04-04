<template>


  <el-row justify="center" align="middle">
    <el-col :xl="2" :lg="2" :md="2" :sm="1" :xs="0">

    </el-col>
    <!-- 主体页面 -->
    <el-col :xl="20" :lg="20" :md="20" :sm="22" :xs="24">
      <!-- 发帖输入框 -->
      <div style="display: flex; justify-content: start; margin: 10px" class="post">
        <el-input size="" v-model="post_input" placeholder="互联网并非逍遥法外之地，请注意言辞，一旦发言违规直接自动封号~"
                  type="textarea" :rows="row_num" maxlength="255" show-word-limit
                  @focus="row_num = 4" @blur="row_num = 2"/>
        <el-button size="" :icon="Promotion" @click="add_post" :disabled="post_input === ''"/>
      </div>

      <!-- 帖子检索条件 -->
      <el-space wrap size="small" style="display: flex; margin: 0 10px">
        <el-date-picker
            v-model="start_time"
            type="datetime"
            placeholder="开始时间"
            format="YYYY/MM/DD HH:mm:ss"
        />
        <el-date-picker
            v-model="end_time"
            type="datetime"
            placeholder="截止时间"
            format="YYYY/MM/DD HH:mm:ss"
        />

        <div>
          <el-select size="" v-model="search_value">
            <el-option
                v-for="item in search_options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>

          <el-button size="" :icon="Search" style="margin-left: 10px" @click="get_post_list(true)"/>
        </div>
      </el-space>

      <!-- 帖子展示无限滑动栏 -->
      <el-empty v-if="posts.list && posts.list.length === 0" description="没有满足条件的帖子哦~"/>
      <div v-else style="overflow-y:hidden" class="my">
        <ul v-infinite-scroll="post_load" infinite-scroll-distance="1" class="infinite-list" style="overflow: auto" infinite-scroll-immediate="false">
          <template v-if="posts.list">
            <li v-for="(post, idx1) in posts.list" :key="post.id" style="margin: 10px">
              <PostComponent :post="post" :idx1="idx1" @open_profile="open_profile" @delete_post="delete_post"
                             @like="like" @cancle_like="cancle_like"/>
            </li>
          </template>
        </ul>
      </div>
    </el-col>
    <el-col :xl="2" :lg="2" :md="2" :sm="1" :xs="0">

    </el-col>
  </el-row>


</template>

<script lang="ts">

import {onMounted, reactive, ref} from 'vue'
import {Delete, Get, Post, system_base_url} from "@/utils/request";
import {
    Promotion,
    Search,
} from '@element-plus/icons-vue'
import store from "@/store";
import {ElMessage} from "element-plus";
import {parse} from "@typescript-eslint/parser";
import {useRouter} from "vue-router";
import PostComponent from "@/components/world_circle/PostComponent.vue";

export default {
  name: "WorldCircleView",
  components: {
    PostComponent,
  },
  setup() {

    const search_options = ref([
      {
        value: 0,
        label: '看世界',
      },
      {
        value: 1,
        label: '只看关注',
      },
      {
        value: 2,
        label: '只看自己',
      },
    ])
    const search_value = ref(0)
    const start_time = ref(null)
    const end_time = ref('')

    const post_input = ref('')

    const row_num = ref(2)


    const posts = reactive({
      list: null,
      len: 0,
      next_url: '',
      limit: 6,
    });

    const format_dateTime = (d) => {
      let res = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' '
          + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
      return res;
    }
    
    const get_post_list = (flag) => {
      const now = format_dateTime(new Date())
      /*console.log('start_time.value:', start_time.value)
      console.log('end_time.value:', end_time.value)*/
      let start = ''
      let end = ''
      if (start_time.value) {
        start = format_dateTime(new Date(start_time.value))
      }
      if (end_time.value) {
        end = format_dateTime(new Date(end_time.value))
      }
      posts.len = 0;
      let params = {
        limit: posts.limit,
      }
      if (search_value.value === 2) {
        params['author'] = store.getters.get_account.id
      } else if (search_value.value === 1) {
        params['mode'] = 1
      }

      if (start !== '' && end !== '') {
        if (start >= end) {
          ElMessage({
            showClose: true,
            message: '开始时间必须早于截止时间！',
            type: 'error',
            duration: 3000,
          })
          return false;
        }
      }
      if (start !== '') {
        if (start >= now) {
          ElMessage({
            showClose: true,
            message: '开始时间必须早于当前时间！',
            type: 'error',
            duration: 3000,
          })
          return false;
        }
        params['create_date_after'] = start
      }

      if (end !== '') {

        if (end > now) {
          ElMessage({
            showClose: true,
            message: '截止时间不能晚于当前时间！',
            type: 'error',
            duration: 3000,
          })
          return false;
        }
        params['create_date_before'] = end
      }

      Get(system_base_url + 'account/posts/', params, true)
          .then((resp) => {
            if (resp.status === 200) {
              posts.list = resp.data.results
              posts.next_url = resp.data.next
              posts.len = resp.data.count
              if (flag) {
                ElMessage({
                  showClose: true,
                  message: '帖子搜索成功~',
                  type: 'success',
                  duration: 3000,
                })
              }
            } else {
              ElMessage({
                showClose: true,
                message: '帖子搜索失败！',
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

      await Get(posts.next_url, {}, true)
          .then((resp) => {

            posts.next_url = resp.data.next
            const ofs = resp.data.count - posts.len; // 浏览过程中保护缓存，防止顶贴
            posts.len = resp.data.count;
            posts.list.push(...(resp.data.results.splice(ofs > 0 ? ofs : 0))) // 保护缓存，防止删帖
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


    onMounted(() => {

      get_post_list(false)

    })

    const like = (obj) => {

      Post(system_base_url + 'account/likes/', {
        // account_id: store.getters.get_account.id,
        post_id: obj.post_id
      }, true)
          .then((resp) => {
            posts.list[obj.pos].like_id = resp.data.id;
            posts.list[obj.pos].like_count += 1;
          })

    }

    const cancle_like = (obj) => {
      Delete(system_base_url + 'account/likes/' + obj.like_id, {}, true)
          .then((resp) => {
            posts.list[obj.pos].like_id = 0;
            posts.list[obj.pos].like_count -= 1;
          })
    }

    const add_post = () => {
      if (post_input.value.length < 10) {
        ElMessage({
          showClose: true,
          type: 'error',
          message: '请输入不少于十个字符内容！',
          duration: 3000,
        })
        return false
      }

      Post(system_base_url + 'account/posts/', {
        content: post_input.value,
        // id: store.getters.get_account.id,
      }, true)
      .then((resp) => {
        if (resp.status === 201) {
          post_input.value = ''
          ElMessage({
            showClose: true,
            type: 'success',
            message: '发帖成功！',
            duration: 3000,
          })
          posts.len = 0
          Get(system_base_url + 'account/posts/', {limit: posts.limit}, true)
              .then((resp) => {
                posts.list = resp.data.results
                posts.next_url = resp.data.next
                posts.len = resp.data.count
              })
              .catch((error) => {
                console.log(error.response)
              })
        } else {
          ElMessage({
            showClose: true,
            type: 'success',
            message: '发帖失败！',
            duration: 3000,
          })
        }
      })
      .catch((error) => {
        console.log(error)
      })
    }

    const delete_post = (post_id) => {
      Delete(system_base_url + 'account/posts/' + post_id, {}, true)
      .then((resp) => {
        if (resp.status === 204) {
          // posts.list.splice(obj.pos, 1)
          posts.list = posts.list.filter(post => post.id !== post_id)
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

    const router = useRouter();
    const open_profile = (id) => {
      router.push('/Profile/'  + id)
    }

    return {
      search_options,
      search_value,
      start_time,
      end_time,
      post_input,
      row_num,
      posts,
      post_load,
      get_post_list,


      like,
      cancle_like,
      add_post,
      delete_post,
      open_profile,
      Promotion,
      Search,
    }
  }
}
</script>

<style lang="scss">
.infinite-list {
  height: 700px;
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

.post .el-textarea {
  font-size: 18px;
}

</style>