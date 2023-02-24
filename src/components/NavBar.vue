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
             background-color="#158BB8"
             text-color="#fff"
             active-text-color="#ffd04b"
             @select="handleSelect"
             style="padding: 0 250px;"
             :ellipsis="false"
    >

      <!--    <el-image style="width: 100px; height: 100px" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" fit="cover"/>-->

      <router-link to="/" style="  margin: auto 0;"><img class="el-image-logo" src="/favicon.ico" fit="cover" /></router-link>
      <div class="flex-grow" />
      <el-menu-item index="/AICreate">
        AI作诗
      </el-menu-item>
      <el-menu-item index="/PoetrySearch">
        诗词检索
      </el-menu-item>
      <el-menu-item index="/MetricDetection">
        格律检测
      </el-menu-item>
      <el-menu-item index="/RhymeSearch">
        韵表检索
      </el-menu-item>
      <el-menu-item index="/TraditionalSimplified">
        繁简转换
      </el-menu-item>
<!--      <el-sub-menu index="2">
        <template #title>项目</template>
        <el-menu-item index="2-1">item one</el-menu-item>
        <el-menu-item index="2-2">item two</el-menu-item>
        <el-menu-item index="2-3">item three</el-menu-item>
        <el-sub-menu index="2-4">
          <template #title>item four</template>
          <el-menu-item index="2-4-1">item one</el-menu-item>
          <el-menu-item index="2-4-2">item two</el-menu-item>
          <el-menu-item index="2-4-3">item three</el-menu-item>
        </el-sub-menu>
      </el-sub-menu>-->
      <el-menu-item index="/Test" class="image">
        <!--      <el-avatar :icon="UserFilled" />-->
        <el-avatar class="my"
                   src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        />
        个人中心
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script lang="ts">

import {useStore} from "vuex";


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

    /*const toFigure = () => {
      store.dispatch("selectFigure", {
        args: {
          // fig_ch_name: input.value,
        },
        success() {
          console.log("NavBar selectFigure 成功");
        },
        error() {
          console.log("NavBar selectFigure 失败");
        }
      });
    }*/



    /*const mohuSearch = () => {

      console.log(select.value);
      console.log(input.value);
      if(parseInt(select.value) === 1) {

        store.dispatch("selectFigure", {
          args: {
            fig_ch_name: input.value,
          },
          success() {
            console.log("NavBar selectFigure 成功");
          },
          error() {
            console.log("NavBar selectFigure 失败");
          }
        });

        router.push({
          name: "FigureView",
          params: {
            // lit_id
          }
        });

        console.log(store.state.figure.figureList);

      } else if (parseInt(select.value) === 2) {
        store.dispatch("selectLiterature", {
          args: {
            lit_ch_title: input.value,
          },
          success() {
            console.log("NavBar selectLiterature 成功");
          },
          error() {
            console.log("NavBar selectLiterature 失败");
          }
        })
      }
    }*/

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
  height: 58px !important;
}
.el-menu--horizontal {
  border: none;
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