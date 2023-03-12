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
  <!-- 小窗隐藏 -->
  <div class="hidden-md-and-down">
    <el-row style="height: 58px">
      <el-col :span="4"></el-col>

      <el-col :span="16">
        <el-menu router
                 :default-active="activeIndex"
                 class="el-menu-demo"
                 mode="horizontal"
                 background-color="#2775B6"
                 text-color="#fff"
                 active-text-color="#ffd04b"
                 style="padding: 0; font-weight: bold"
                 :ellipsis="false"
        >

          <router-link to="/">
            <img class="el-image-logo" src="/favicon.ico" fit="cover" style="margin-top: 10px"/>
          </router-link>

          <el-menu-item v-for="(item, index) in MenuList" :key="index" :index="item.index">
            {{ item.content }}
          </el-menu-item>

          <div class="flex-grow" />

<!--          <el-menu-item index="/My" v-if="$store.state.account.is_login === true">
            我的
          </el-menu-item>
          <el-menu-item index="/Login" v-else>
            登录
          </el-menu-item>-->

          <el-button link type="info" v-if="$store.state.account.is_login === true" @click="log_out">
              退出登录
          </el-button>
          <el-button link type="info" v-else @click="dialogFormVisible = true">
              登录
          </el-button>

        </el-menu>
      </el-col>

      <el-col :span="4"></el-col>

    </el-row>

  </div>

  <!-- 大窗隐藏 -->
  <div class="hidden-lg-and-up">

    <el-row style="height: 58px">
      <el-col :xl="4" :lg="4" :md="3" :sm="2" :xs="0"></el-col>

      <el-col :xl="16" :lg="16" :md="18" :sm="20" :xs="24">
        <el-menu router
                 :default-active="activeIndex2"
                 class="el-menu-demo"
                 mode="horizontal"
                 background-color="#2775B6"
                 text-color="#fff"
                 active-text-color="#ffd04b"
                 style="padding: 0; font-weight: bold"
                 :ellipsis="false"
        >

          <router-link to="/">
            <img class="el-image-logo" src="/favicon.ico" fit="cover"  style="margin-top: 10px"/>
          </router-link>

          <div class="flex-grow" />

          <el-sub-menu index="1">
            <template #title>选项</template>
            <el-menu-item v-for="(item, index) in MenuList" :key="index" :index="item.index">
              {{ item.content }}
            </el-menu-item>

<!--            <el-menu-item index="/My" v-if="$store.state.account.is_login === true">
              退出登录
            </el-menu-item>
            <el-menu-item index="/Login" v-else>
              登录
            </el-menu-item>-->

            <el-button link type="info" v-if="$store.state.account.is_login === true" @click="log_out">
              退出登录
            </el-button>
            <el-button link type="info" v-else @click="dialogFormVisible = true">
              登录
            </el-button>


          </el-sub-menu>

        </el-menu>
      </el-col>

      <el-col :xl="4" :lg="4" :md="3" :sm="2" :xs="0"></el-col>

    </el-row>

  </div>

  <el-dialog v-model="dialogFormVisible" :title="form_state">
    <el-form :model="form">
      <el-form-item label="邮箱" :label-width="formLabelWidth">
        <el-input v-model="form.username" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item label="密码" :label-width="formLabelWidth" v-if="['注册', '登录'].includes(form_state)">
        <el-input v-model="form.password" type="password" show-password placeholder="请输入密码" />
      </el-form-item>
      <el-form-item label="确认密码" :label-width="formLabelWidth" v-if="form_state === '注册'">
        <el-input v-model="form.password2" type="password" show-password placeholder="请再次输入密码" />
      </el-form-item>
    </el-form>

    <div style="display: flex; justify-content: center; align-items: center">
      <el-button type="primary" @click="log_in" v-if="form_state === '登录'">登录</el-button>
      <el-button type="primary" @click="sign_in" v-if="form_state === '注册'">注册</el-button>
    </div>

    <div style="display: flex; justify-content: space-around; align-items: center">
      <el-link v-if="form_state === '登录'" >忘记密码</el-link>
      <el-link @click="form_state = '注册'" v-if="form_state === '登录'">注册</el-link>
      <el-link @click="form_state = '登录'" v-if="form_state === '注册'">登录</el-link>
    </div>

    <div style="display: flex; justify-content: space-around; align-items: center">
      {{error_message}}
    </div>


  </el-dialog>


</template>

<script lang="ts">

import 'element-plus/theme-chalk/display.css'
import {onMounted, reactive, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useStore} from "vuex";
import {instance} from "@/utils/utils";


export default {
  name: "NavBar",
  props: {

  },
  components: {

  },
  setup() {




    const store = useStore();

    console.log(store.state.account.id)
    console.log(store.state.account.username)
    console.log(store.state.account.followerCount)
    console.log(store.state.account.access)
    console.log(store.state.account.refresh)
    console.log(store.state.account.is_login)

    const activeIndex = ref('/')
    const activeIndex2 = ref('1')
    const MenuList = [
      {
        index: '/',
        content: '首页',
      },
      {
        index: '/AICreate',
        content: 'AI作诗',
      },
      {
        index: '/MetricDetection',
        content: '格律检测',
      },
      {
        index: '/RhymeSearch',
        content: '韵表检索',
      },
      {
        index: '/PoetrySearch',
        content: '诗词检索',
      },
      {
        index: '/FlyingOrder',
        content: '飞花检索',
      },
      {
        index: '/Analyze',
        content: '一览无余',
      },
      {
        index: '/Test',
        content: '个人中心',
      },

    ]

    const route = useRoute();

    watch(
        ()=>(route.path),
        (val,preVal)=>{
          //val为修改后的值,preVal为修改前的值
          console.log(val, preVal)
          if (activeIndex.value !== val) {
            activeIndex.value = val;
          }
        },
        {
          //如果加了这个参数，值为true的话，就消除了惰性，watch会在创建后立即执行一次
          //那么首次执行，val为默认值,preVal为undefined
          immediate:false,
          //这个参数代表监听对象时，可以监听深度嵌套的对象属性
          //比如message是一个对象的话，可以监听到message.a.b.c，也就是message下的所有属性
          deep:false,
        }
    )

    const dialogFormVisible = ref(false)
    const formLabelWidth = '140px'
    const form = reactive({
      username: '',
      password: '',
      password2: '',
    })
    const form_state = ref('登录') // 登录 注册 忘记密码
    const error_message = ref('')


    const log_out = () => {
      store.commit('logout');
    }

    const log_in = () => {
      error_message.value = "";
      store.dispatch("login", {
        username: form.username,
        password: form.password,
        success() {
          dialogFormVisible.value = false
        },
        error() {
          error_message.value = "用户名或密码错误";
        }
      });
    }

    const sign_in = () => {
      instance({
        url: 'account/sign_in',
        method:'post',
        headers: {
          // 'Authorization': "Bearer " + store.state.user.access,
        },
        data: form,
      })
      .then((resp) => {
        console.log(resp.data.result)
        dialogFormVisible.value = false
      })
      .catch((error) => {
        console.log(error);
        console.log(error.data.result);
      })
    }

    return {
      activeIndex,
      activeIndex2,
      MenuList,

      dialogFormVisible,
      formLabelWidth,
      form,
      form_state,
      error_message,

      log_out,
      log_in,
      sign_in,
    }
},

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

.dialog-footer {

}

</style>