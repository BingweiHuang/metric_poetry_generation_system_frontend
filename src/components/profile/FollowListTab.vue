<template>
  <!-- 关注列表 -->
  <ul v-infinite-scroll="follow_load" infinite-scroll-distance="1" infinite-scroll-immediate="false" class="infinite-list" style="overflow: auto; max-height: 520px;">
    <template v-if="follows.list && follows.list.length > 0">
      <li v-for="(item, index) in follows.list" :key="'follow_' + item.id + index" class="infinite-list-item">
        <!-- 头像、昵称和取消关注 -->
        <div style="display: flex; align-items: center; justify-content: space-between; width: 100%">
          <div style="display: flex; align-items: center">
            <!-- 头像 -->
            <el-avatar :size="50" :src="item.follow.avatar_url" style="margin-right: 10px; cursor: pointer" @click="open_profile(item.follow.id)"/>
            <!-- 昵称-->
            <div>
              <span style="cursor: pointer; font-size: 18px" @click="open_profile(item.follow.id)">{{item.follow.nickname}}</span>
            </div>
          </div>
          <template v-if="is_me">
            <el-button v-if="item.id === 0" type="success" @click="follow_list_add(item.follow.id, index)">关 注</el-button>
            <el-button v-else type="danger" @click="follow_list_delete(item.id, index)">取消关注</el-button>
          </template>


        </div>
      </li>

    </template>
    <li v-else style="text-align: center; color: #6b778c; margin-top: 10px">还没有关注~</li>

  </ul>

</template>

<script lang="ts">
import {onMounted, reactive, ref, watch} from "vue";
import {Delete, Get, Post, system_base_url} from "@/utils/request";
import {ElMessage} from "element-plus";

export default {
  name: "FollowListTab",
  components: {},
  props: {
    account_id: {
      type: Number,
      required: true,
    },
    activeName: {
      type: String,
      required: true,
    },
    is_me: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, context) {
    const follows = reactive({
      list: null,
      len: 0,
      next_url: '',
      limit: 8,
    })

    const get_follow_list = async () => {
      await Get(system_base_url + 'account/follows/', {fan: props.account_id, limit: follows.limit}, true)
          .then((resp) => {
            if (resp.status === 200) {
              follows.list = resp.data.results;
              follows.next_url = resp.data.next;
              follows.len = resp.data.count;
            }
          })
          .catch((err) => {
            console.log(err)
          })
    }

    watch(
        ()=>(props.activeName),
        (val,preVal)=>{
          if (val === '关注') {
            if (follows.list === null) {
              get_follow_list()
            }
          }
        },
        {
          immediate:true,
          deep:false,
        }
    )

    const follow_load = () => {
      if (follows.next_url === null || follows.next_url === '') {
        ElMessage({
          showClose: true,
          message: '已经没有数据咯~',
          type: 'warning',
          duration: 3000,
        })
        return false
      }

      Get(follows.next_url, {fan: props.account_id, limit: follows.limit}, true)
          .then((resp) => {
            follows.next_url = resp.data.next
            const ofs = resp.data.count - follows.len; // 浏览过程中保护缓存，防止新关注
            follows.len = resp.data.count;
            follows.list.push(...(resp.data.results.splice(ofs > 0 ? ofs : 0))) // 保护缓存，防止取消关注


          })
          .catch((error) => {
            console.log(error);
            ElMessage({
              showClose: true,
              message: '刷新出错！',
              type: 'error',
              duration: 3000,
            })
          })
    }

    const follow_list_delete = (id, pos) => {
      Delete(system_base_url + 'account/follows/' + id, {}, true)
          .then((resp) => {
            if (resp.status === 204) {
              // follow_list.value.splice(pos, 1);
              follows.list[pos].id = 0;
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
          .catch((error) => {
            console.log(error)
          })
    }

    const follow_list_add = (account_id, pos) => {
      Post(system_base_url + 'account/follows/', {follow_id:account_id}, true)
          .then((resp) => {
            if (resp.status === 201) {
              follows.list[pos].id = resp.data.id;
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
          .catch((error) => {
            console.log(error)
          })
    }

    const open_profile = (id) => {
      context.emit('open_profile', id);
    }

    onMounted(async () => {
      await get_follow_list()
    })

    return {

      follows,
      follow_load,
      get_follow_list,
      follow_list_delete,
      follow_list_add,
      open_profile,

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
  margin: 15px;
  //color: var(--el-color-primary);
}
.infinite-list .infinite-list-item:hover {
  //background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}
.infinite-list .infinite-list-item + .list-item {
  margin-top: 10px;
}
</style>