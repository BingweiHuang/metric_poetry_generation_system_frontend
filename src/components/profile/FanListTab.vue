<template>
  <!-- 粉丝列表 -->
  <ul v-infinite-scroll="fan_load" infinite-scroll-distance="1" infinite-scroll-immediate="false" class="infinite-list" style="overflow: auto; max-height: 520px;">
    <template v-if="fan_list.length > 0">
      <li v-for="(item, index) in fan_list" :key="'fan_' + item.id + index" class="infinite-list-item">
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
import {onMounted, ref} from "vue";
import {Get, system_base_url} from "@/utils/request";
import {ElMessage} from "element-plus";

export default {
  name: "FanListTab",
  components: {},
  props: {
    account_id: {
      type: Number,
      required: true,
    },
  },
  setup(props, context) {

    const default_limit = 10;

    let fan_next_url = '';
    const fan_list = ref([])
    const get_fan_list = async () => {
      await Get(system_base_url + 'account/follows/', {follow: props.account_id, limit: default_limit}, true)
          .then((resp) => {
            const result = resp.data.results
            fan_list.value = result;
            fan_next_url = resp.data.next;
          })
          .catch((err) => {
            console.log(err)
          })
    }

    const fan_load = () => {
      if (fan_next_url === null || fan_next_url === '') {
        ElMessage({
          showClose: true,
          message: '已经没有数据咯~',
          type: 'warning',
          duration: 3000,
        })
        return false
      }

      Get(fan_next_url, {fan: props.account_id, limit: default_limit}, true)
          .then((resp) => {
            let result = resp.data.results
            fan_next_url = resp.data.next
            fan_list.value = fan_list.value.concat(result)

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

    const open_profile = (id) => {
      context.emit('open_profile', id);
    }

    onMounted(async () => {
      await get_fan_list()
    })

    return {
      fan_list,
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
  margin: 10px;
  //color: var(--el-color-primary);
}
.infinite-list .infinite-list-item:hover {
  //width: 100%;
  display: flex;
  align-items: center;
  justify-content: start;
  min-height: 50px;
  //background: var(--el-color-primary-light-9);
  margin: 10px;
  color: var(--el-color-primary);
}
.infinite-list .infinite-list-item + .list-item {
  margin-top: 10px;
}
</style>