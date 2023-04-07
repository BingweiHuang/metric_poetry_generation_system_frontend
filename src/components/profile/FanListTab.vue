<template>
  <!-- 粉丝列表 -->
  <ul v-infinite-scroll="fan_load" infinite-scroll-distance="1" infinite-scroll-immediate="false" class="infinite-list" style="overflow: auto; max-height: 520px;">
    <template v-if="fans.list && fans.list.length > 0">
      <li v-for="(item, index) in fans.list" :key="'fan_' + item.id + index" class="infinite-list-item">
        <!-- 头像、昵称 -->
        <div style="display: flex; align-items: center; justify-content: space-between; width: 100%">
          <div style="display: flex; align-items: center">
            <!-- 头像 -->
            <el-avatar :size="50" :src="item.fan.avatar_url" style="margin-right: 10px; cursor: pointer" @click="open_profile(item.fan.id)"/>
            <!-- 昵称-->
            <div>
              <span style="cursor: pointer; font-size: 18px" @click="open_profile(item.fan.id)">{{item.fan.nickname}}</span>
            </div>
          </div>

        </div>
      </li>

    </template>
    <li v-else style="text-align: center; color: #6b778c; margin-top: 10px">还没有关注~</li>

  </ul>

</template>

<script lang="ts">
import {onMounted, reactive, ref, watch} from "vue";
import {authGet, system_base_url} from "@/utils/request";
import {ElMessage} from "element-plus";
import store from "@/store";

export default {
  name: "FanListTab",
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
  },
  setup(props, context) {
    const fans = reactive({
      list: null,
      len: 0,
      next_url: '',
      limit: 8,
    })

    const get_fan_list = () => {
      fans.len = 0;
      authGet(system_base_url + 'account/follows/', {follow: props.account_id, limit: fans.limit})
          .then((resp) => {
            if (resp.status === 200) {
              fans.list = resp.data.results;
              fans.next_url = resp.data.next;
              fans.len = resp.data.count;
            }
          })
          .catch((err) => {
            console.log(err)
          })
    }

    watch(
        ()=>(props.activeName),
        (val,preVal)=>{
          if (val === '粉丝') {
            if (fans.list === null) {
              get_fan_list()
            }
          }
        },
        {
          immediate:true,
          deep:false,
        }
    )

    const fan_load = () => {
      if (fans.next_url === null || fans.next_url === '') {
        ElMessage({
          showClose: true,
          message: '已经没有数据咯~',
          type: 'warning',
          duration: 3000,
        })
        return false
      }

      authGet(fans.next_url, {follow: props.account_id, limit: fans.limit})
          .then((resp) => {
            fans.next_url = resp.data.next
            const ofs = resp.data.count - fans.len; // 浏览过程中保护缓存，防止新关注
            fans.len = resp.data.count;
            fans.list.push(...(resp.data.results.splice(ofs > 0 ? ofs : 0))) // 保护缓存，防止取消关注

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

    const open_profile = (id) => {
      context.emit('open_profile', id);
    }

    return {
      fans,
      get_fan_list,
      fan_load,
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