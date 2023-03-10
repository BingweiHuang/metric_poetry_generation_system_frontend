<template>

<!--
  蓝色
  background-color="#BACCD9" 云水
  background-color="#8FB2C9" 晴山
  background-color="#8ABCD1" 秋波
  background-color="#10AEC2" 甸子
  background-color="#158BB8" 鸢尾
  background-color="#4E7CA1" 蝶翅
  background-color="#2775B6" 景泰

  绿色



-->
  <div>
    <el-menu router
             :default-active="this.$router.path"
             class="el-menu-demo"
             mode="horizontal"
             background-color="#2775B6"
             text-color="#fff"
             active-text-color="#ffd04b"
             @select="handleSelect"
             style="padding: 0; font-weight: bold"
             :ellipsis="false"
    >
      <!--      <div class="flex-grow" />-->

      <el-col :xl="4" :lg="4" :md="2" :sm="0" :xs="0">

      </el-col>

      <el-col :xl="16" :lg="16" :md="20" :sm="24" :xs="24">
        <el-row align="middle" justify="center">


          <el-col :span="2">
            <router-link to="/">
              <img class="el-image-logo" src="/favicon.ico" fit="cover"  style="margin-top: 10px"/>
            </router-link>
          </el-col>
          <el-col :span="1.5">
            <el-menu-item index="/AICreate">
              AI作诗
            </el-menu-item>
          </el-col>
          <el-col :span="1.5">
            <el-menu-item index="/MetricDetection">
              格律检测
            </el-menu-item>
          </el-col>
          <el-col :span="1.5">
            <el-menu-item index="/RhymeSearch">
              韵表检索
            </el-menu-item>
          </el-col>
          <el-col :span="1.5">
            <el-menu-item index="/PoetrySearch">
              诗词检索
            </el-menu-item>
          </el-col>
          <el-col :span="1.5">
            <el-menu-item index="/FlyingOrder">
              飞花检索
            </el-menu-item>
          </el-col>
          <el-col :span="1.5">
            <el-menu-item index="/Test" class="image">
              个人中心
            </el-menu-item>
          </el-col>
        </el-row>
      </el-col>

    </el-menu>
  </div>
</template>

<script lang="ts">


export default {
  name: "NavBar",
  props: {

  },
  components: {

  },
  setup() {

    const handleSelect = (key: string, keyPath: string[]) => {
      console.log(key, keyPath);
    }

    return {
      handleSelect,
    }
  }
}



</script>

<style lang="scss" scoped>
.flex-grow {
  flex-grow: 1;
}

.image {
  //height: 58px !important;
}


.el-image-logo {
  width: 33px;
  height: 33px;
}
.el-image-logo:hover {
  cursor: pointer;
}

.my {
  margin-right: 10px;
}

</style>