<template>
  <el-form :model="update_password_form" :rules="update_password_rules" ref="update_password_dom" label-width="80px">

    <el-form-item label="验证码">
      <el-input v-model="update_password_form.code" placeholder="请输入验证码">
        <template #append>
          <el-button @click="send_email">
            {{clock.countDownTime <= 0 ? "发送验证码" : clock.countDownTime+'秒后获取'}}
          </el-button>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="update_password_form.password" type="password" show-password placeholder="请输入密码" />
    </el-form-item>

    <el-form-item label="确认密码" prop="password2">
      <el-input v-model="update_password_form.password2" type="password" show-password placeholder="请再次输入密码" />
    </el-form-item>

    <div style="display: flex; justify-content: space-around; align-items: center;">
      <el-button type="primary" @click="update_password">修 改</el-button>
    </div>
  </el-form>

</template>

<script lang="ts">
import {onMounted, reactive, ref, watch} from "vue";
import {Get, Post, system_base_url} from "@/utils/request";
import store from "@/store";
import {useRouter} from "vue-router";

export default {
  name: "UpdatePasswordTab",
  components: {},
  /*props: {
    email: {
      type: String,
      required: true,
    },
  },*/
  setup(props) {
    onMounted(() => {
      let sendEndTime = localStorage.getItem('clockStartTime');
      if (sendEndTime) countDown(email_clock_seconds);
    })

    const send_email = () => {
      update_password_dom.value.validateField('email', async (valid) => {
        if (valid) {

          // 如果大于0  直接return
          if (clock.countDownTime > 0) return false
          // 发送axios
          await Get(system_base_url + 'account/update_password/', {
            'email' : store.getters.get_account.email,
          }, 2)
              .then((resp) => {
                if (resp.status === 200) {
                  countDown(email_clock_seconds)
                }
              })
              .catch((error) => {
                console.log(error.response)
              })

        } else {
          return false;
        }
      })

    }

    const clear_update_password_form = () => {
      Object.keys(update_password_form).map(key => {
        update_password_form[key] = ''
      })
    }

    const update_password_form = reactive({
      email: store.getters.get_account.email,
      code: '',
      password: '',
      password2: '',
    })

    const update_password_dom = ref(null)
    const update_password_rules = ref({

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
            if (update_password_form.password !== update_password_form.password2) {
              callback(new Error("两次输入密码不同"));
            } else {
              //校验通过
              callback();
            }
          },
          trigger: "blur"
        }
      ],
    })

    const router = useRouter();
    const update_password = () => {

      update_password_dom.value.validate((valid) => {
        if (valid) {
          Post(system_base_url + 'account/update_password/', update_password_form)
              .then((resp) => {
                if (resp.status === 201) {
                  store.dispatch('logout')
                  router.push('/')
                  clear_update_password_form()
                }
              })
              .catch((error) => {
                console.log(error);
              })

        } else {
          return false
        }
      })
    }

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
    return {
      update_password_dom,
      update_password_form,
      update_password_rules,
      email_clock_seconds,
      clock,
      countDown,
      send_email,
      clear_update_password_form,
      update_password,
    }
  }
}
</script>

<style lang="scss" scoped>

</style>