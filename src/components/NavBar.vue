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

  <!-- 小窗隐藏 web端显示 -->
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


          <el-menu-item :index="'/Profile/' + $store.getters.get_account.id" v-if="$store.getters.get_is_login">
            家
          </el-menu-item>
          <el-button link type="info" v-else @click="open_login_table">
              登录
          </el-button>
          <el-button link type="info" @click="log_out">
            退出登录
          </el-button>

        </el-menu>
      </el-col>

      <el-col :span="4"></el-col>

    </el-row>

  </div>

  <!-- 大窗隐藏 移动端显示 -->
  <div class="hidden-lg-and-up">

    <el-row style="height: 58px">
      <el-col :xl="4" :lg="4" :md="3" :sm="2" :xs="0"></el-col>

      <el-col :xl="16" :lg="16" :md="18" :sm="20" :xs="24">
        <el-menu router
                 menu-trigger="click"
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

            <el-menu-item :index="'/Profile/' + $store.getters.get_account.id" v-if="$store.getters.get_is_login">
              家
            </el-menu-item>
            <el-button link type="info" v-else @click="open_login_table">
              登录
            </el-button>
            <el-button link type="info" @click="log_out">
              退出登录
            </el-button>


          </el-sub-menu>

        </el-menu>
      </el-col>

      <el-col :xl="4" :lg="4" :md="3" :sm="2" :xs="0"></el-col>

    </el-row>

  </div>

  <!-- 登陆注册框 -->
  <div class="my-dialog">
    <el-dialog v-model="dialogFormVisible" :title="form_state">
      <el-form :model="form" :rules="rules" ref="dom" :label-width="formLabelWidth">
        <el-form-item label="邮箱" prop="email" v-if="login_style">
          <!--        <el-input v-model="form.email" placeholder="请输入邮箱" oninput ="value=value.replace(/[^\d]/g,'')" />-->
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="账号" prop="username" v-if="!login_style">
          <el-input v-model="form.username" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="验证码"  v-if="['注册','找回密码'].includes(form_state)" prop="code">
          <el-input v-model="form.code" placeholder="请输入验证码">
            <template #append>
              <el-button @click="send_email">
                {{clock.countDownTime <= 0 ? "发送验证码" : clock.countDownTime+'秒后获取'}}
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="密码"  v-if="['注册', '找回密码'].includes(form_state)" prop="password">
          <el-input v-model="form.password" type="password" show-password placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="密码"  v-if="['登录'].includes(form_state)">
          <el-input v-model="form.password" type="password" show-password placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="确认密码"  v-if="['注册', '找回密码'].includes(form_state)" prop="password2">
          <el-input v-model="form.password2" type="password" show-password placeholder="请再次输入密码" />
        </el-form-item>
        <el-form-item label="登陆方式"  v-if="form_state === '登录'">
          <el-switch v-model="login_style" size="" inline-prompt active-text="邮箱" inactive-text="账号"/>
        </el-form-item>


      </el-form>

      <div style="display: flex; justify-content: space-around; align-items: center">
        <div style="width: 80px">

        </div>
        <div style="display: flex; justify-content: space-around; align-items: center; margin-bottom: 20px;">
          <el-button type="primary" class="my-button" @click="log_in" v-if="form_state === '登录'">登 录</el-button>
          <el-button type="primary" class="my-button" @click="sign_in" v-if="form_state === '注册'">注 册</el-button>
          <el-button type="primary" class="my-button" @click="update_password" v-if="form_state === '找回密码'">修改密码</el-button>
        </div>
      </div>

      <div style="display: flex; justify-content: space-around; align-items: center">
        <div style="width: 80px">

        </div>
        <div style="display: flex; justify-content: space-around; align-items: center; width: 260px">
          <el-link @click="trans_forget" v-if="form_state === '登录'" >忘记密码</el-link>
          <el-link @click="trans_sign_in" v-if="form_state === '登录'">注册</el-link>
          <el-link @click="trans_login" v-if="['注册', '找回密码'].includes(form_state)">登录</el-link>
        </div>
      </div>

    </el-dialog>
  </div>


</template>

<script lang="ts">

import 'element-plus/theme-chalk/display.css'
import {computed, onMounted, reactive, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useStore} from "vuex";
import {ElMessage} from "element-plus";
import {Get, Post, system_base_url} from "@/utils/request";
import { useIntervalFn } from '@vueuse/core'
import store from "@/store";


export default {
  name: "NavBar",
  props: {

  },
  components: {

  },
  setup() {
    const email_clock_seconds = 60

    // 倒计时
    const clock = reactive({
      // 倒计时
      countDownTime: 0,
      timer: null,
    })
    const countDown = (the_seconds) => {

      let startTime = localStorage.getItem('clockStartTime');
      let nowTime = new Date().getTime();
      if (startTime) {
        let surplus = the_seconds - parseInt(((nowTime - parseInt(startTime)) / 1000).toString(), 10);
        // let surplus = the_seconds - ((nowTime - parseInt(startTime)) / 1000)
        clock.countDownTime = (surplus <= 0) ? 0 : surplus;
      } else {
        clock.countDownTime = the_seconds;
        localStorage.setItem('clockStartTime', nowTime.toString());
      }

      if (clock.timer === null) {
        clock.timer = setInterval(() => {
          clock.countDownTime--;
          if (clock.countDownTime <= 0) {
            localStorage.removeItem('clockStartTime');
            clearInterval(clock.timer);
            clock.countDownTime = 0;
          }
        }, 1000)
      }
    }

    onMounted(() => {
      let sendEndTime = localStorage.getItem('clockStartTime');
      if (sendEndTime) countDown(email_clock_seconds)
    })



    const send_email = () => {
      dom.value.validateField('email', async (valid) => {
        if (valid) {

          // 如果大于0  直接return
          if (clock.countDownTime > 0) return false

          if (form_state.value === '注册') {
            // 发送axios
            await Get(system_base_url + 'account/sign_in/', {
              'email' : form.email
            }, false, 2)
                .then((resp) => {
                  countDown(email_clock_seconds)
                })
                .catch((error) => {
                  console.log(error.response)
                })
          } else if (form_state.value === '找回密码') {
            // 发送axios
            await Get(system_base_url + 'account/update_password/', {
              'email' : form.email
            }, false, 2)
                .then((resp) => {
                  countDown(email_clock_seconds)
                })
                .catch((error) => {
                  console.log(error.response)
                })
          }


        } else {
          console.log('邮箱格式不对');
          return false;
        }
      })

    }

    const store = useStore();


    /*console.log(store.getters.get_account)
    console.log(store.getters.get_access)
    console.log(store.getters.get_refresh)
    console.log(store.getters.get_is_login)*/

    const activeIndex = ref('/')
    const activeIndex2 = ref('/')
    const MenuList = [
      {
        index: '/',
        content: '首页',
      },
      {
        index: '/AICreate',
        content: '引玉才华',
      },
      {
        index: '/MetricDetection',
        content: '吹毛求瑕',
      },
      {
        index: '/RhymeSearch',
        content: '顺藤摸瓜',
      },
      {
        index: '/PoetrySearch',
        content: '大浪淘沙',
      },
      {
        index: '/FlyingOrder',
        content: '春城飞花',
      },
      {
        index: '/Analyze',
        content: '收割如麻',
      },
      {
        index: '/WorldCircle',
        content: '游子天涯',
      },
      /*{
        index: '/Profile',
        content: '个人中心',
      },*/

    ]

    const route = useRoute();
    const router = useRouter();

    watch(
        ()=>(route.path),
        (val,preVal)=>{
          //val为修改后的值,preVal为修改前的值
          if (activeIndex.value !== val) {
            activeIndex.value = val;
          }
          if (activeIndex2.value !== val) {
            activeIndex2.value = val;
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
    const formLabelWidth = '80px'
    const form = reactive({
      email: '',
      username: '',
      code: '',
      password: '',
      password2: '',
    })
    const form_state = ref('登录') // 登录 注册 找回密码
    const login_style = ref(true) // 登录方式
    const dom = ref(null)
    const rules = ref({
      username: [ // 账号限制
        { required: true, message: "请输入账号", trigger: "blur" },
        {
          validator: function(rule, value, callback) {
            if (value.length < 4 || value.length > 12) {
              callback(new Error("账号长度必须为[4,12]"));
            } else {
              //校验通过
              callback();
            }
          },
          trigger: "blur"
        }
      ],

      password: [ // 密码限制
        { required: true, message: "请输入密码", trigger: "blur" },
        {
          validator: function(rule, value, callback) {
            if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#.$@!%&*?])[A-Za-z\d#.$@!%&*?]{8,16}$/.test(value) == false) {
              callback(new Error("密码必须为8~16位，数字+大写和小写英文+特殊符号"));
            } else {
              //校验通过
              callback();
            }
          },
          trigger: "blur"
        }
      ],

      password2: [ // 两次密码需相同
        { required: true, message: "请再次输入密码", trigger: "blur" },
        {
          validator: function(rule, value, callback) {
            if (form.password !== form.password2) {
              callback(new Error("两次输入密码不同"));
            } else {
              //校验通过
              callback();
            }
          },
          trigger: "blur"
        }
      ],

      english: [ // 英文
        { required: true, message: "请输入英文名", trigger: "blur" },
        {
          validator: function(rule, value, callback) {
            if (/[a-zA-z]$/.test(value) == false) {
              callback(new Error("请输入英文"));
            } else {
              //校验通过
              callback();
            }
          },
          trigger: "blur"
        }
      ],

      email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        {
          type: 'email',
          message: '请输入正确的邮箱格式',
          trigger: ['blur'],
        },
      ],

      phone: [ // 手机号
        { required: true, message: "请输入手机号", trigger: "blur" },
        {
          validator: function(rule, value, callback) {
            if (/^(13[0-9]|14[0-9]|15[0-9]|16[6]|18[0-9]|19[6,9]|17[0-9])\d{8}$/i.test(value) == false) {
              callback(new Error("请输入手机号"));
            } else {
              //校验通过
              callback();
            }
          },
          trigger: "blur"
        }
      ],

      code: [
        { required: true, message: '请输入6位数字验证码', trigger: 'blur'},
        {
          validator: function(rule, value, callback) {
            if (/^\d{6}$/.test(value) == false) {
              callback(new Error("验证码是6位数字"));
            } else {
              //校验通过
              callback();
            }
          },
          trigger: "blur"
        }
      ],
    })


    const log_out = () => {
      router.push('/')
      store.dispatch('logout');
    }

    const log_in = () => {

      dom.value.validate((valid) => {
        if (valid) {

          // 邮箱或者用户名登录
          const the_username = (login_style.value) ? form.email : form.username;
          store.dispatch("login", {
            username: the_username,
            password: form.password,
            success() {
              dialogFormVisible.value = false
              clear_form()
            },
            error() {
              clear_form()
              ElMessage({
                showClose: true,
                message: '用户名或密码错误~',
                type: 'error',
                duration: 5000,
              })
            }
          });

        } else {
          console.log('校验不通过')
        }
      })


    }


    const sign_in = () => {


      dom.value.validate((valid) => {
        if (valid) {

          Post(system_base_url + 'account/sign_in/', form, false)
          .then((resp) => {
            router.push('/')
            clear_form()
            dialogFormVisible.value = true
            form_state.value = '登录'
          })
          .catch((error) => {
            console.log(error.response.data.result);
          })

        } else {
          console.log('校验不通过')
        }
      })
    }

    const update_password = () => {

      dom.value.validate((valid) => {
        if (valid) {

          Post(system_base_url + 'account/update_password/', form, false)
          .then((resp) => {

            store.dispatch('logout')
            router.push('/')
            clear_form()
            form_state.value = '登录'
            dialogFormVisible.value = true

          })
          .catch((error) => {
            console.log('error.response.data.result:', error.response.data.result);
          })

        } else {
          console.log('校验不通过')
        }
      })
    }

    const clear_form = () => {
      login_style.value = true
      Object.keys(form).map(key => {
        form[key] = ''
      })
      // console.log('清空情况:', form)
    }

    const trans_sign_in = () => {
      form_state.value = '注册'
      clear_form();
    }

    const trans_forget = () => {
      form_state.value = '找回密码'
      clear_form()
    }

    const trans_login = () => {
      form_state.value = '登录'
      clear_form()
    }

    const open_login_table = () => {
      form_state.value = '登录'
      dialogFormVisible.value = true
      clear_form()
    }

    return {
      dom,
      rules,
      activeIndex,
      activeIndex2,
      MenuList,

      dialogFormVisible,
      formLabelWidth,
      form,
      form_state,
      login_style,

      log_out,
      log_in,
      sign_in,
      update_password,
      send_email,
      trans_sign_in,
      trans_login,
      trans_forget,
      open_login_table,
      clock,
    }
},

}



</script>

<style lang="scss">
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


.my-dialog .el-dialog {
  width: 360px !important;
}

.my-button {
  width: 260px;
}

</style>