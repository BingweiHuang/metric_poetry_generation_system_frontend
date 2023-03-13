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

  <div class="my-dialog">
    <el-dialog v-model="dialogFormVisible" :title="form_state">
      <el-form :model="form" :rules="rules" ref="dom">
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <!--        <el-input v-model="form.email" placeholder="请输入邮箱" oninput ="value=value.replace(/[^\d]/g,'')" />-->
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="验证码" :label-width="formLabelWidth" v-if="['注册','忘记密码'].includes(form_state)">
          <el-input v-model="form.code" placeholder="请输入验证码">
            <template #append>
              <el-button @click="send_email">
                发送
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" v-if="['注册', '忘记密码'].includes(form_state)" prop="password">
          <el-input v-model="form.password" type="password" show-password placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" v-if="['登录'].includes(form_state)">
          <el-input v-model="form.password" type="password" show-password placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="确认密码" :label-width="formLabelWidth" v-if="['注册', '忘记密码'].includes(form_state)" prop="password2">
          <el-input v-model="form.password2" type="password" show-password placeholder="请再次输入密码" />
        </el-form-item>
        <el-form-item label="记住我" :label-width="formLabelWidth" v-if="form_state === '登录'">
          <el-checkbox v-model="form.remember" size="" />
        </el-form-item>


      </el-form>

      <div style="display: flex; justify-content: space-around; align-items: center">
        <div style="width: 80px">

        </div>
        <div style="display: flex; justify-content: space-around; align-items: center; margin-bottom: 20px;">
          <el-button type="primary" class="my-button" @click="log_in('form')" v-if="form_state === '登录'">登 录</el-button>
          <el-button type="primary" class="my-button" @click="sign_in" v-if="form_state === '注册'">注 册</el-button>
          <el-button type="primary" class="my-button" @click="update_password" v-if="form_state === '忘记密码'">修改密码</el-button>
        </div>
      </div>

      <div style="display: flex; justify-content: space-around; align-items: center">
        <div style="width: 80px">

        </div>
        <div style="display: flex; justify-content: space-around; align-items: center; width: 260px">
          <el-link @click="trans_forget" v-if="form_state === '登录'" >忘记密码</el-link>
          <el-link @click="trans_sign_in" v-if="form_state === '登录'">注册</el-link>
          <el-link @click="form_state = '登录'" v-if="['注册', '忘记密码'].includes(form_state)">登录</el-link>
        </div>
      </div>

    </el-dialog>
  </div>






</template>

<script lang="ts">

import 'element-plus/theme-chalk/display.css'
import {onMounted, reactive, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useStore} from "vuex";
import {instance} from "@/utils/utils";
import {ElMessage} from "element-plus";


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
    const formLabelWidth = '80px'
    const form = reactive({
      email: '',
      code: '',
      password: '',
      password2: '',
      remember: false,
    })
    const form_state = ref('登录') // 登录 注册 忘记密码
    const dom = ref(null)
    const rules = ref({
      chinese: [ // 只能输入中文
        { required: true, message: "请输入中文名", trigger: "blur" },
        {
          validator: function(rule, value, callback) {
            if (/^[\u4e00-\u9fa5]+$/.test(value) == false) {
              callback(new Error("请输入中文"));
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
              callback(new Error("密码必须为8~16位，数字+英文字母+特殊符号"));
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
    })


    const log_out = () => {
      store.commit('logout');
    }

    const log_in = () => {
      console.log('提交数据', form)
      store.dispatch("login", {
        email: form.email,
        password: form.password,
        success() {
          dialogFormVisible.value = false
        },
        error() {
          form.email = ''
          form.password = ''
          form.password2 = ''
          ElMessage({
            showClose: true,
            message: '用户名或密码错误~',
            type: 'error',
            duration: 5000,
          })
        }
      });
      /*dom.value.validate((valid) => {
        console.log('校验结果', valid)
        if (valid) {

          store.dispatch("login", {
            username: form.email,
            password: form.password,
            success() {
              dialogFormVisible.value = false
            },
            error() {
              form.email = ''
              form.password = ''
              form.password2 = ''
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
      })*/
    }

    const send_email = () => {

      dom.value.validateField('email', (valid) => {
        if (valid) {
          console.log('邮箱验证通过')

          instance({
            url: 'account/sign_in',
            method:'get',
            headers: {
              // 'Authorization': "Bearer " + store.state.user.access,
            },
            params: {
              'email' : form.email
            }
          })
              .then((resp) => {
                console.log(resp.data.result)
              })
              .catch((error) => {
                console.log(error);
                console.log(error.responce.data.result);
              })

        } else {
          console.log('邮箱验证失败');
          return false;
        }
      })


    }

    const sign_in = () => {

      console.log('提交数据', form)

      dom.value.validate((valid) => {
        console.log('校验结果', valid)
        if (valid) {

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
            console.log(error.responce.data.result);
          })

        } else {
          console.log('校验不通过')
        }
      })
    }

    const trans_sign_in = () => {
      form_state.value = '注册'
      form.email = ''
      form.code = ''
      form.password = ''
      form.password2 = ''
      form.remember = false
    }

    const trans_forget = () => {
      form_state.value = '忘记密码'
      form.email = ''
      form.code = ''
      form.password = ''
      form.password2 = ''
      form.remember = false
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

      log_out,
      log_in,
      sign_in,
      send_email,
      trans_sign_in,
      trans_forget,
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

.my {
  margin-right: 10px;
}

.my-dialog .el-dialog {
  width: 380px !important;
}

.my-button {
  width: 260px;
}

</style>