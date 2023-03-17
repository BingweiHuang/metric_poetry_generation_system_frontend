<template>


  <el-row justify="center" align="middle">
    <el-col :xl="2" :lg="2" :md="2" :sm="1" :xs="0">

    </el-col>
    <!-- 主体页面 -->
    <el-col :xl="20" :lg="20" :md="20" :sm="22" :xs="24">
      <ul v-infinite-scroll="load" infinite-scroll-distance="30" class="infinite-list" style="overflow: auto">
        <li v-for="i in count" :key="i" class="infinite-list-item">
          <el-card>
            <el-row justify="start" align="middle">
              <!-- 头像 -->
              <el-avatar :size="50" :src="touxiang_url" style="margin-right: 10px"/>
              <!-- 昵称 和 时间-->
              <div>
                <div style="margin-bottom: 6px">{{my_nickname}}</div>
                <div>2023-03-13</div>
              </div>
            </el-row>

            <div style="margin-top: 10px">
              {{my_introduction}}{{my_introduction}}{{my_introduction}}
            </div>

            <div style="text-align: end; margin: 5px 8px 0 0;">
              <span style="margin-right: 8px">点赞</span>
              <span>评论</span>
            </div>
          </el-card>
        </li>
      </ul>
    </el-col>
    <el-col :xl="2" :lg="2" :md="2" :sm="1" :xs="0">

    </el-col>
  </el-row>


</template>

<script lang="ts">

import { ref } from 'vue'
export default {
  name: "WorldCircleView",
  components: {},
  setup() {
    const count = ref(0)
    const load = () => {
      count.value += 2
    }


    const my_nickname = ref('踏云')
    const follow_count = ref(1)
    const fans_count = ref(0)
    const my_email = ref('909140058@qq.com')
    const my_username = ref('Binigwei_Huang')
    const my_introduction = ref('哈哈哈哈哈哈，哈哈哈哈哈哈哈。这个人很懒，没留下简介...')
    const touxiang_url = 'http://bwhlifetimelove.top/metric_poetry/avatar/default.png';

    return {
      count,
      load,

      my_nickname,
      follow_count,
      fans_count,
      my_email,
      my_username,
      my_introduction,
      touxiang_url,
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
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50px;
  background: var(--el-color-primary-light-9);
  margin: 10px;
  color: var(--el-color-primary);
}
.infinite-list .infinite-list-item + .list-item {
  margin-top: 10px;
}
</style>