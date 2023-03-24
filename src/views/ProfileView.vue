<template>

  <el-row>
    <el-col :xl="0" :lg="0" :md="0" :sm="0" :xs="0"></el-col>

    <el-col :xl="24" :lg="24" :md="24" :sm="24" :xs="24">

      <!-- 个人资料展示页面 -->
      <el-card style="margin: 10px 0">
        <el-row justify="start" align="middle">
          <!-- 头像 昵称 -->
          <el-col :span="8">
            <div style="text-align: center">
              <el-avatar :size="100" :src="the_account.photo"/>
              <div>{{the_account.nickname}}</div>
            </div>
          </el-col>

          <!-- 其他资料 -->
          <el-col :span="16">
            <div> <span>关注：{{the_account.followCount}}</span> &nbsp; <span>粉丝：{{the_account.fanCount}}</span></div>
            <div>邮箱：{{the_account.email}}</div>
            <div>账号：{{ the_account.username }}</div>
            <div>个人简介：{{ the_account.introduction }}</div>
          </el-col>
        </el-row>
      </el-card>


      <!-- 标签页切换 -->
      <el-card>
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane label="我的作品" name="我的作品">
            <el-button type="primary" style="margin-bottom: 10px">
              添加
            </el-button>
            <el-space wrap size="" style="display: flex; align-items: start; justify-content: center">
              <template v-for="idx in 10" :key="idx">
                <el-card style="text-align: center">
                  <div style="display: flex; justify-content: space-between">
                    <el-button type="success" text style="margin-bottom: 10px" size="small">
                      编辑
                    </el-button>
                    <el-button type="danger" text style="margin-bottom: 10px" size="small">
                      删除
                    </el-button>
                  </div>
                  <div>《经邹鲁祭孔子而叹之》</div>
                  <div>嗟君此别意何如，驻马衔杯问谪居。</div>
                  <div>巫峡啼猿数行泪，衡阳归雁几封书。</div>
                  <div>青枫江上秋天远，白帝城边古木疏。</div>
                  <div>圣代即今多雨露，暂时分手莫踌躇。</div>
                  <div>创建时间：</div>
                  <div>上次修改：</div>
                </el-card>
              </template>
            </el-space>
          </el-tab-pane>
          <el-tab-pane label="诗作收藏" name="诗作收藏">Config</el-tab-pane>
          <el-tab-pane label="词作收藏" name="词作收藏">Role</el-tab-pane>
          <el-tab-pane label="编辑个人资料" name="编辑个人资料">

            <el-form :model="form" label-width="80px">

              <el-form-item label="头像" style="display: flex; align-items: center; justify-content: start">

                <el-upload
                    ref="upload"
                    class="avatar-uploader"
                    action="http://upload-z1.qiniup.com"
                    list-type="picture-card"
                    v-model:file-list="fileList"
                    :limit="1"
                    :auto-upload="false"
                    accept=".jpg, .png, .jpeg"
                    :on-success="handleAvatarSuccess"
                    :data="upload_data"
                    :before-upload="beforeAvatarUpload"
                    :on-error="uploadError"
                    :show-file-list="true"
                >

                  <el-icon class="avatar-uploader-icon"><Plus /></el-icon>

                </el-upload>

                <el-button class="ml-3" type="success" @click="submitUpload">
                  修改
                </el-button>


              </el-form-item>

              <el-form-item label="昵称">
                <el-input v-model="the_account.nickname" show-word-limit maxlength="10" />
              </el-form-item>
              <el-form-item label="账号">
                <el-input v-model="the_account.username" show-word-limit maxlength="16" />
              </el-form-item>

              <el-form-item label="公开作品">
                <el-switch v-model="the_account.displayWorks" />
              </el-form-item>
              <el-form-item label="公开收藏">
                <el-switch v-model="the_account.displayCollections" />
              </el-form-item>
              <el-form-item label="个人简介">
                <el-input v-model="the_account.introduction" type="textarea" :autosize="{ minRows: 3, maxRows: 3 }" show-word-limit maxlength="30">

                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="update_profile">确认修改</el-button>
                <el-button>Cancel</el-button>
              </el-form-item>
            </el-form>

          </el-tab-pane>
          <el-tab-pane label="修改密码" name="修改密码">

            <el-form :model="form" :rules="rules" ref="dom" label-width="80px">

              <el-form-item label="验证码">
                <el-input v-model="form.code" placeholder="请输入验证码">
                  <template #append>
                    <el-button @click="send_email">
                      {{clock.countDownTime <= 0 ? "发送验证码" : clock.countDownTime+'秒后获取'}}
                    </el-button>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="form.password" type="password" show-password placeholder="请输入密码" />
              </el-form-item>

              <el-form-item label="确认密码" prop="password2">
                <el-input v-model="form.password2" type="password" show-password placeholder="请再次输入密码" />
              </el-form-item>

              <div style="display: flex; justify-content: space-around; align-items: center;">
                <el-button type="primary" @click="update_password">修 改</el-button>
              </div>
            </el-form>

          </el-tab-pane>
        </el-tabs>
      </el-card>

    </el-col>

    <el-col :xl="0" :lg="0" :md="0" :sm="0" :xs="0"></el-col>
  </el-row>

</template>

<script lang="ts">

import {ref, reactive, onMounted, toRaw} from 'vue'
import type { TabsPaneContext } from 'element-plus'
import {ElMessage, genFileId} from 'element-plus'
import type { UploadInstance, UploadProps, UploadRawFile, UploadUserFile } from 'element-plus'
import {useIntervalFn} from "@vueuse/core";
import {Get, Post} from "@/utils/request";
import * as echarts from "echarts";
import {useRoute, useRouter} from "vue-router";
import store from "@/store";


export default {
  name: "ProfileView",
  components: {},
  setup() {

    const activeName = ref('我的作品')

    const handleClick = (tab: TabsPaneContext, event: Event) => {
      // console.log(tab, event)
    }

    const upload = ref<UploadInstance>()
    const upload_data = ref({
      key: "",
      token: "",
    })

    const route = useRoute();

    const the_account = reactive({
      photo: '',
      nickname: '',
      followCount: 0,
      fanCount: 0,
      email: '',
      username: '',
      introduction: '',
      displayWorks: true,
      displayCollections: true,
    });
    const is_followed = ref(true);



    const fileList = ref<UploadUserFile[]>([
      /*{
        name: 'food.jpeg',
        url: photoUrl.value,
      },*/
    ])

    const beforeAvatarUpload = (file) => {
      upload_data.value.key = the_account.email;
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG && !isPNG) {
        ElMessage({
          showClose: true,
          message: '图片只能是 JPG/PNG 格式！',
          type: 'error',
          duration: 5000,
        })
        return false;
      }
      if (!isLt2M) {
        ElMessage({
          showClose: true,
          message: '图片大小不能超过 2MB！',
          type: 'error',
          duration: 5000,
        })
        return false;
      }
    }


    const baseUrl = 'http://bwhlifetimelove.top/'
    
    //上传成功后执行的代码
    const handleAvatarSuccess: UploadProps['onSuccess'] = (
        response,
        uploadFile
    ) => {
      the_account.photo = URL.createObjectURL(uploadFile.raw!)
      console.log('上传成功')
    }
    //上传失败后执行的代码
    const uploadError = (err) => {
      console.log("上传失败", err);
    }





    const form = reactive({
      email: '',
      code: '',
      password: '',
      password2: '',
    })

    const dom = ref(null)
    const rules = ref({

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
    })

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
      /*Get('analyze/get_qiniu_token', {}, false)
      .then((resp) => {
        upload_data.value.token = resp.data.qn_token
      })
      .catch((error) => {
        console.log(error);
      })*/
      const the_account_id = (route.params.account_id);
      Get('account/accounts/' + the_account_id, {}, false)
      .then((resp) => {
        // console.log('resp.data.account:', resp.data.account)
        the_account.photo = resp.data.photo
        the_account.nickname = resp.data.nickname
        the_account.followCount = resp.data.followCount
        the_account.fanCount = resp.data.fanCount
        the_account.email = resp.data.email
        form.email = resp.data.email
        the_account.username = resp.data.username
        the_account.introduction = resp.data.introduction
        the_account.displayWorks = resp.data.displayWorks
        the_account.displayCollections = resp.data.displayCollections
      })
      .catch((error) => {
        console.log(error);
      })

      const my_id = store.getters.get_account.id;
      if (my_id !== the_account_id) {
        Get('account/follows/', {
          fan: my_id,
          follow: the_account_id,
        }, false)
            .then((resp) => {
              if (resp.data.id && 1) is_followed.value = true;
              else is_followed.value = false;
            })
            .catch((error) => {
              console.log(error);
            })
      }


    })


    const send_email = () => {
      dom.value.validateField('email', async (valid) => {
        if (valid) {
          // console.log('邮箱验证通过')

          // 如果大于0  直接return
          if (clock.countDownTime > 0) return false
          // 发送axios
          await Get('account/update_password/', {
            'email' : form.email,
          }, false)
          .then((resp) => {
            countDown(email_clock_seconds)
          })
          .catch((error) => {
            console.log(error.response)
          })

        } else {
          console.log('邮箱格式不对');
          return false;
        }
      })

    }

    const clear_form = () => {
      Object.keys(form).map(key => {
        form[key] = ''
      })
      // console.log('清空情况:', form)
    }

    const router = useRouter();
    const update_password = () => {

      dom.value.validate((valid) => {
        console.log('校验结果', valid)
        if (valid) {
          console.log('form:', form)
          Post('account/update_password/', form, false)
          .then((resp) => {
            store.dispatch('logout')
            router.push('/')
            clear_form()
          })
          .catch((error) => {
            console.log('error.response.data.result:', error.response.data.result);
          })

        } else {
          console.log('校验不通过')
        }
      })
    }
    const update_profile = () => {
      console.log('提交数据', form)

      dom.value.validate((valid) => {
        console.log('校验结果', valid)
        if (valid) {

          Post('account/update_password/', form, false)
          .then((resp) => {

            clear_form()
          })
          .catch((error) => {
            console.log('error.response.data.result:', error.response.data.result);
          })

        } else {
          console.log('校验不通过')
        }
      })
    }

    

    return {
      update_password,
      update_profile,

      the_account,
      is_followed,

      form,
      dom,
      rules,
      clock,
      send_email,

      activeName,
      handleClick,
      fileList,

      upload,
      upload_data,
      handleAvatarSuccess,
      uploadError,
      beforeAvatarUpload,
    }
  }
}
</script>

<style lang="scss" scoped>

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
}

.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

</style>