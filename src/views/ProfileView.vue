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
              <el-avatar :size="100" :src="touxiang_url"/>
              <div>{{my_nickname}}</div>
            </div>
          </el-col>

          <!-- 其他资料 -->
          <el-col :span="16">
            <div> <span>关注：{{follow_count}}</span> &nbsp; <span>粉丝：{{fans_count}}</span></div>
            <div>邮箱：{{my_email}}</div>
            <div>账号：{{ my_username }}</div>
            <div>个人简介：{{ my_introduction }}</div>
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

                <el-avatar :size="80" :src="touxiang_url"/>

                <el-upload
                    ref="upload"
                    class="upload-demo"
                    action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                    :limit="1"
                    :on-exceed="handleExceed"
                    :auto-upload="false"
                >
                  <el-button type="primary">选择</el-button>
                  <el-button class="ml-3" type="success" @click="submitUpload">
                    上传
                  </el-button>
                  <template #tip>
                    <div class="el-upload__tip text-red">
                      新头像会覆盖旧头像
                    </div>
                  </template>
                </el-upload>

              </el-form-item>

              <el-form-item label="昵称">
                <el-input v-model="form.nickname" show-word-limit maxlength="10" />
              </el-form-item>
              <el-form-item label="账号">
                <el-input v-model="form.username" show-word-limit maxlength="16" />
              </el-form-item>

              <el-form-item label="公开作品">
                <el-switch v-model="form.display_works" />
              </el-form-item>
              <el-form-item label="公开收藏">
                <el-switch v-model="form.display_collections" />
              </el-form-item>
              <el-form-item label="个人简介">
                <el-input v-model="form.introduction" type="textarea" :autosize="{ minRows: 3, maxRows: 3 }" show-word-limit maxlength="30">

                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit">Create</el-button>
                <el-button>Cancel</el-button>
              </el-form-item>
            </el-form>

          </el-tab-pane>
          <el-tab-pane label="修改密码" name="修改密码">

            <el-form :model="form2" :rules="rules" ref="dom" label-width="80px">

              <el-form-item label="验证码">
                <el-input v-model="form2.code" placeholder="请输入验证码">
                  <template #append>
                    <el-button @click="send_email">
                      {{time === 0 ? "发送验证码" : time+'秒后获取'}}
                    </el-button>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="form2.password" type="password" show-password placeholder="请输入密码" />
              </el-form-item>

              <el-form-item label="确认密码" prop="password2">
                <el-input v-model="form2.password2" type="password" show-password placeholder="请再次输入密码" />
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="onSubmit">Create</el-button>
                <el-button>Cancel</el-button>
              </el-form-item>
            </el-form>

          </el-tab-pane>
        </el-tabs>
      </el-card>

    </el-col>

    <el-col :xl="0" :lg="0" :md="0" :sm="0" :xs="0"></el-col>
  </el-row>


</template>

<script lang="ts">

import { ref, reactive } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import {ElMessage, genFileId} from 'element-plus'
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
import {useIntervalFn} from "@vueuse/core";
import {get} from "@/utils/request";

export default {
  name: "ProfileView",
  components: {},
  setup() {

    const activeName = ref('first')

    const handleClick = (tab: TabsPaneContext, event: Event) => {
      // console.log(tab, event)
    }

    const upload = ref<UploadInstance>()

    const my_nickname = ref('踏云')
    const follow_count = ref(1)
    const fans_count = ref(0)
    const my_email = ref('909140058@qq.com')
    const my_username = ref('Binigwei_Huang')
    const my_introduction = ref('哈哈哈哈哈哈，哈哈哈哈哈哈哈。这个人很懒，没留下简介...')

    const handleExceed: UploadProps['onExceed'] = (files) => {
      upload.value!.clearFiles()
      const file = files[0] as UploadRawFile
      file.uid = genFileId()
      upload.value!.handleStart(file)
    }

    const submitUpload = () => {
      upload.value!.submit()
    }


    // do not use same name with ref
    const form = reactive({
      nickname: my_nickname,
      username: my_username,
      display_works: false,
      display_collections: false,
      introduction: my_introduction,
    })

    const form2 = reactive({
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
            if (form2.password !== form2.password2) {
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

    const useCountDown = () => {
      const time = ref(0)
      // pause 停止  resume继续
      const { pause, resume } = useIntervalFn(
          () => {
            time.value--
            if (time.value <= 0) {
              pause()
            }
          },
          1000,
          { immediate: false }
      )

      const start = (num) => {
        // 赋值
        time.value = num
        // 调用
        resume()
      }
      return { time, start }
    }
    const { start, time } = useCountDown()


    const send_email = () => {
      dom.value.validateField('email', async (valid) => {
        if (valid) {
          // console.log('邮箱验证通过')

          // 如果大于0  直接return
          if (time.value > 0) return

          // 发送axios
          await get('account/sign_in', {
            'email' : my_email
          }, false)
              .then((resp) => {
                console.log(resp.data.result)
                ElMessage({
                  showClose: true,
                  message: '邮件发送成功~',
                  type: 'success',
                  duration: 5000,
                })
                start(60)
              })
              .catch((error) => {
                console.log(error);
                if (error.response.data.result === '邮箱已被注册') {
                  ElMessage({
                    showClose: true,
                    message: '邮箱已被注册！',
                    type: 'error',
                    duration: 5000,
                  })
                }
                console.log("error.response.data.result:",error.response.data.result);
              })

        } else {
          console.log('邮箱格式不对');
          return false;
        }
      })

    }

    const onSubmit = () => {
      console.log('submit!')
    }

    const touxiang_url = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png';

    return {
      form,
      onSubmit,

      my_nickname,
      follow_count,
      fans_count,
      my_email,
      my_username,
      my_introduction,

      form2,
      dom,
      rules,
      time,
      send_email,

      activeName,
      handleClick,
      touxiang_url,

      upload,
      handleExceed,
      submitUpload,
    }
  }
}
</script>

<style lang="scss" scoped>

.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

</style>