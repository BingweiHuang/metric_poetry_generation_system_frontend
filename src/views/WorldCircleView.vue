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
        <el-button size="" :icon="Promotion" @click="add_post" :disabled="post_input === ''"/>
      </div>

      <!-- 帖子展示无限滑动栏 -->
      <div style="overflow-y:hidden">
        <ul v-infinite-scroll="post_load" infinite-scroll-distance="1" class="infinite-list" style="overflow: auto" infinite-scroll-immediate="false">
          <li v-for="(post, idx1) in post_list" :key="idx1 + post.id" style="margin: 10px">
            <PostComponent :post="post" :idx1="idx1" @open_profile="open_profile" @delete_post="delete_post"
            @like="like" @cancle_like="cancle_like"/>
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
import {Delete, Get, Post, system_base_url} from "@/utils/request";
import {
  Promotion,
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
    const limit = 5;
    let last_len = 0
    let next_url = ''

    const post_input = ref('')

    const count = ref(10)
    const post_list = ref([])
    const post_load = async () => {

      if (next_url === null || next_url === '') {
        ElMessage({
          showClose: true,
          message: '已经没有数据咯~',
          type: 'warning',
          duration: 3000,
        })
        return false
      }

      await Get(next_url, {}, true)
          .then((resp) => {

            next_url = resp.data.next
            const ofs = resp.data.count - last_len; // 浏览过程中保护缓存，防止顶贴
            last_len = resp.data.count;
            post_list.value.push(...(resp.data.results.splice(ofs > 0 ? ofs : 0))) // 保护缓存，防止删帖
            /*if (ofs > 0) {
              console.log('ofs:', ofs)

              const url_arr = (next_url).toString().split("offset=")
              next_url = url_arr[0] + "offset=" + (parseInt(url_arr[1]) + ofs).toString()
              console.log('after_next_url:', next_url)
            }*/

          })
          .catch((error) => {
            ElMessage({
              showClose: true,
              message: '刷新出错！',
              type: 'error',
              duration: 3000,
            })
          })

    }


    onMounted(() => {
      last_len = 0
      Get(system_base_url + 'account/posts/', {limit: limit}, true)
      .then((resp) => {
        post_list.value = resp.data.results
        next_url = resp.data.next
        last_len = resp.data.count
      })
      .catch((error) => {
        console.log(error.response)
      })

    })

    const like = (obj) => {

      Post(system_base_url + 'account/likes/', {
        // account_id: store.getters.get_account.id,
        post_id: obj.post_id
      }, true)
          .then((resp) => {
            post_list.value[obj.pos].like_id = resp.data.id;
            post_list.value[obj.pos].like_count += 1;
          })

    }

    const cancle_like = (obj) => {
      Delete(system_base_url + 'account/likes/' + obj.like_id, {}, true)
          .then((resp) => {
            post_list.value[obj.pos].like_id = 0;
            post_list.value[obj.pos].like_count -= 1;
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
          last_len = 0
          Get(system_base_url + 'account/posts/', {limit: limit}, true)
              .then((resp) => {
                post_list.value = resp.data.results
                next_url = resp.data.next
                last_len = resp.data.count
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

    const delete_post = (obj) => {
      Delete(system_base_url + 'account/posts/' + obj.post_id, {}, true)
      .then((resp) => {
        if (resp.status === 204) {
          post_list.value.splice(obj.pos, 1)
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
      post_input,
      count,
      post_list,
      post_load,


      like,
      cancle_like,
      add_post,
      delete_post,
      open_profile,
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