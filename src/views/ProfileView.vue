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
              <el-avatar :size="100" :src="the_account.avatar_url"/>
              <div>{{the_account.nickname}}</div>
            </div>
          </el-col>

          <!-- 其他资料 -->
          <el-col :span="16">
            <div style="display: flex; align-items: center; ">
              关注：<el-link style="font-size: 16px">{{the_account.follow_count}}</el-link>
              &nbsp;&nbsp; 粉丝：<el-link style="font-size: 16px">{{the_account.fan_count}}</el-link>
              &nbsp;&nbsp; <el-button type="success" plain circle :icon="Plus" size="small" v-if="follow_id === 0 && (the_account.id !== $store.getters.get_account.id)"  @click="add_follow"/>
              <el-button type="success" circle :icon="Check" size="small" @click="delete_follow(follow_id, 0, false)"
                         v-if="follow_id"/>
            </div>
            <div>邮箱：{{the_account.email}}</div>
            <div>账号：{{the_account.username}}</div>
            <div>个人简介：{{ the_account.introduction }}</div>
          </el-col>
        </el-row>
      </el-card>


      <!-- 标签页切换 -->
      <el-card>
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane label="作品" name="作品">
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
          <el-tab-pane label="诗作收藏" name="诗作收藏">
            <!-- 诗作收藏列表 -->
            <el-space size="" wrap style="width: 100%; justify-content: center;">
              <template v-for="item in shi_collection_list.slice((shi_currentPage - 1) * shi_pageSize, shi_currentPage * shi_pageSize)" :key="item.shi.id">
                <ShiCard :poetry="item.shi"/>
              </template>
              <template v-if="shi_collection_list.length === 0">
                <el-empty description="没有收藏任何诗作~"/>
              </template>
              <template v-else>
                <el-button type="primary" text size="large"
                           v-if="(shi_currentPage >= (shi_collection_list.length / shi_pageSize)) && shi_have_more"
                           @click="shi_load" style="font-size: 20px; font-weight: bold">
                  加载更多...
                </el-button>
              </template>
            </el-space>

            <!-- web端分页码 -->
            <el-pagination
                class="my-el-pagination hidden-xs-only"
                background
                :small="false"
                :hide-on-single-page="true"
                @size-change="shi_handleSizeChange"
                @current-change="shi_handleCurrentChange"
                :current-page="shi_currentPage"
                :page-size="shi_pageSize"
                :pager-count="6"
                layout=" prev, pager, next"
                :total="shi_collection_list.length">
            </el-pagination>

            <!-- 移动端分页码 -->
            <el-pagination
                class="my-el-pagination hidden-sm-and-up"
                background
                :small="true"
                :hide-on-single-page="true"
                @size-change="shi_handleSizeChange"
                @current-change="shi_handleCurrentChange"
                :current-page="shi_currentPage"
                :page-size="shi_pageSize"
                :pager-count="6"
                layout=" prev, pager, next"
                :total="shi_collection_list.length">
            </el-pagination>

          </el-tab-pane>
          <el-tab-pane label="词作收藏" name="词作收藏">
            <!-- 词作收藏列表 -->
            <el-space size="" wrap style="width: 100%; justify-content: center;">
              <template v-for="item in ci_collection_list.slice((ci_currentPage - 1) * ci_pageSize, ci_currentPage * ci_pageSize)" :key="item.ci.id">
                <CiCard :poetry="item.ci"/>
              </template>
              <template v-if="ci_collection_list.length === 0">
                <el-empty description="没有收藏任何词作~"/>
              </template>
              <template v-else>
                <el-button type="primary" text size="large"
                           v-if="(ci_currentPage >= (ci_collection_list.length / ci_pageSize)) && ci_have_more"
                           @click="ci_load" style="font-size: 20px; font-weight: bold">
                  加载更多...
                </el-button>
              </template>
            </el-space>

            <!-- web端分页码 -->
            <el-pagination
                class="my-el-pagination hidden-xs-only"
                background
                :small="false"
                :hide-on-single-page="true"
                @size-change="ci_handleSizeChange"
                @current-change="ci_handleCurrentChange"
                :current-page="ci_currentPage"
                :page-size="ci_pageSize"
                :pager-count="6"
                layout=" prev, pager, next"
                :total="ci_collection_list.length">
            </el-pagination>

            <!-- 移动端分页码 -->
            <el-pagination
                class="my-el-pagination hidden-sm-and-up"
                background
                :small="true"
                :hide-on-single-page="true"
                @size-change="ci_handleSizeChange"
                @current-change="ci_handleCurrentChange"
                :current-page="ci_currentPage"
                :page-size="ci_pageSize"
                :pager-count="6"
                layout=" prev, pager, next"
                :total="ci_collection_list.length">
            </el-pagination>
          </el-tab-pane>
          <el-tab-pane label="编辑个人资料" name="编辑个人资料" v-if="the_account.id === $store.getters.get_account.id">

            <el-form :model="form2" :rules="rules2" ref="dom2" label-width="80px">

              <el-form-item label="头像" style="display: flex; align-items: center; justify-content: start">

                <el-upload
                    ref="upload"
                    class="avatar-uploader"
                    action="http://upload-z2.qiniup.com"
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

                <el-button class="ml-3" type="success" @click="update_avatar">
                  修改头像
                </el-button>


              </el-form-item>

              <el-form-item label="昵称" prop="nickname">
                <el-input v-model="form2.nickname" show-word-limit maxlength="10" />
              </el-form-item>
              <el-form-item label="账号" prop="username">
                <el-input v-model="form2.username" show-word-limit maxlength="12" />
              </el-form-item>

              <el-form-item label="公开作品">
                <el-switch v-model="form2.display_works" />
              </el-form-item>
              <el-form-item label="公开收藏">
                <el-switch v-model="form2.display_collections" />
              </el-form-item>
              <el-form-item label="个人简介" prop="introduction">
                <el-input v-model="form2.introduction" type="textarea" :autosize="{ minRows: 3, maxRows: 3 }" show-word-limit maxlength="30">
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="update_profile">修改信息</el-button>
                <el-button @click="huan_yuan">还原</el-button>
              </el-form-item>
            </el-form>

          </el-tab-pane>
          <el-tab-pane label="修改密码" name="修改密码" v-if="the_account.id === $store.getters.get_account.id">


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
          <el-tab-pane label="关注" name="关注" v-if="the_account.id === $store.getters.get_account.id">


            <!-- 关注列表 -->
            <ul v-infinite-scroll="load2" infinite-scroll-distance="1" infinite-scroll-immediate="false" class="infinite-list" style="overflow: auto; max-height: 520px;">
              <template v-if="follow_list.length > 0">
                <li v-for="(item, index) in follow_list" :key="index" class="infinite-list-item">
                  <!-- 头像、昵称和取消关注 -->
                  <div style="display: flex; align-items: center; justify-content: space-between; width: 100%">
                    <div style="display: flex; align-items: center">
                      <!-- 头像 -->
                      <el-avatar :size="50" :src="item.follow.avatar_url" style="margin-right: 10px; cursor: pointer" @click="open_profile(item.follow.id)"/>
                      <!-- 昵称-->
                      <div>
                        <span style="cursor: pointer; font-size: 18px" @click="open_profile(item.follow.id)">{{item.follow.nickname}}</span>
                      </div>
                    </div>
                    <el-button @click="delete_follow(item.id, index, true)">取消关注</el-button>

                  </div>
                </li>

              </template>
              <li v-else style="text-align: center; color: #6b778c; margin-top: 10px">还没有关注~</li>

            </ul>

          </el-tab-pane>
          <el-tab-pane label="粉丝" name="粉丝" v-if="the_account.id === $store.getters.get_account.id">


            <!-- 粉丝列表 -->
            <ul v-infinite-scroll="load2" infinite-scroll-distance="1" infinite-scroll-immediate="false" class="infinite-list" style="overflow: auto; max-height: 520px;">
              <template v-if="fan_list.length > 0">
                <li v-for="(item, index) in fan_list" :key="index" class="infinite-list-item">
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
import {Delete, Get, Post, Put, system_base_url} from "@/utils/request";
import {useRoute, useRouter} from "vue-router";
import store from "@/store";
import ShiCard from "@/components/ShiCard.vue";
import CiCard from "@/components/CiCard.vue";

import {
  Plus,
  Check,
} from '@element-plus/icons-vue'
export default {
  name: "ProfileView",
  components: {
    ShiCard,
    CiCard,
  },
  setup() {

    const activeName = ref('作品')

    const follow_list = ref([])
    const get_follow_list = async () => {
      await Get(system_base_url + 'account/follows/', {fan: the_account.id}, true)
          .then((resp) => {
            follow_list.value = resp.data.results
          })
          .catch((err) => {
            console.log(err)
          })
    }

    const fan_list = ref([])
    const get_fan_list = async () => {
      await Get(system_base_url + 'account/follows/', {follow: the_account.id}, true)
          .then((resp) => {
            fan_list.value = resp.data.results
          })
          .catch((err) => {
            console.log(err)
          })
    }
    
    const default_limit = 9;
    
    let shi_next_url = '';
    const shi_collection_list = ref([])
    const get_shi_collection_list = async () => {
      await Get(system_base_url + 'account/shi_collections/', 
          {author: the_account.id, limit: default_limit}, true)
          .then((resp) => {
            const result = resp.data.results
            shi_collection_list.value = result;
            shi_next_url = resp.data.next
            if (result.length < default_limit) shi_have_more.value = false;
            else shi_have_more.value = true;
          })
          .catch((err) => {
            console.log(err)
          })
    }

    const shi_currentPage = ref(1);
    const shi_pageSize = ref(9);
    const shi_have_more = ref(true);
    const shi_handleSizeChange = (val: number) => {
      // 更新每页展示数据size
      shi_pageSize.value = val
    };
    const shi_handleCurrentChange = (val: number) => {
      // 更新当前页数是第几页
      shi_currentPage.value = val
    };
    const shi_load = () => {
      if (shi_next_url === null || shi_next_url === '') {
        shi_have_more.value = false
        ElMessage({
          showClose: true,
          message: '已经没有数据咯~',
          type: 'warning',
          duration: 3000,
        })
        return false
      }

      Get(shi_next_url, {author: the_account.id, limit: default_limit}, true)
          .then((resp) => {
            let result = resp.data.results
            shi_next_url = resp.data.next
            if (result.length < default_limit) shi_have_more.value = false;
            else shi_have_more.value = true;
            shi_collection_list.value = shi_collection_list.value.concat(result)

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



    let ci_next_url = '';
    const ci_collection_list = ref([])
    const get_ci_collection_list = async () => {
      await Get(system_base_url + 'account/ci_collections/',
          {author: the_account.id, limit: default_limit}, true)
          .then((resp) => {
            const result = resp.data.results
            ci_collection_list.value = result;
            ci_next_url = resp.data.next
            if (result.length < default_limit) ci_have_more.value = false;
            else ci_have_more.value = true;
          })
          .catch((err) => {
            console.log(err)
          })
    }

    const ci_currentPage = ref(1);
    const ci_pageSize = ref(9);
    const ci_have_more = ref(true);
    const ci_handleSizeChange = (val: number) => {
      // 更新每页展示数据size
      ci_pageSize.value = val
    };
    const ci_handleCurrentChange = (val: number) => {
      // 更新当前页数是第几页
      ci_currentPage.value = val
    };
    const ci_load = () => {
      if (ci_next_url === null || ci_next_url === '') {
        ci_have_more.value = false
        ElMessage({
          showClose: true,
          message: '已经没有数据咯~',
          type: 'warning',
          duration: 3000,
        })
        return false
      }

      Get(ci_next_url, {author: the_account.id, limit: default_limit}, true)
          .then((resp) => {
            let result = resp.data.results
            ci_next_url = resp.data.next
            if (result.length < default_limit) ci_have_more.value = false;
            else ci_have_more.value = true;
            ci_collection_list.value = ci_collection_list.value.concat(result)

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
    
    

    const handleClick = (tab: TabsPaneContext, event: Event) => {
      if (tab.props.name === '关注') {
        get_follow_list()
      } else if (tab.props.name === '粉丝') {
        get_fan_list()
      } else if (tab.props.name === '诗作收藏') {
        get_shi_collection_list()
      } else if (tab.props.name === '词作收藏') {
        get_ci_collection_list()
      }

    }

    const upload = ref<UploadInstance>()
    const upload_data = ref({
      // key: "",
      token: "",
    })

    const route = useRoute();

    const the_account = reactive({
      id: 0,
      avatar_url: '',
      nickname: '',
      follow_count: 0,
      fan_count: 0,
      email: '',
      username: '',
      introduction: '',
      display_works: true,
      display_collections: true,
    });
    const follow_id = ref(0);



    const fileList = ref<UploadUserFile[]>()

    const beforeAvatarUpload = async (file) => {
      // upload_data.value.key = 'avatar/' + the_account.email;
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG && !isPNG) {
        ElMessage({
          showClose: true,
          message: '图片只能是 JPG/PNG 格式！',
          type: 'error',
          duration: 3000,
        })
        return false;
      }
      if (!isLt2M) {
        ElMessage({
          showClose: true,
          message: '图片大小不能超过 2MB！',
          type: 'error',
          duration: 3000,
        })
        return false;
      }

      await Get(system_base_url + 'account/get_qiniu_token/', {}, true)
      .then((resp) => {
        upload_data.value.token = resp.data.qn_token
      })
      .catch((error) => {
        console.log(error);
      })
    }


    const baseUrl = 'http://rs2ezu96y.hn-bkt.clouddn.com/'
    
    //上传成功后执行的代码
    const handleAvatarSuccess: UploadProps['onSuccess'] = (
        response,
        uploadFile
    ) => {
      // const new_avatar = URL.createObjectURL(uploadFile.raw!)
      // console.log("new_avatar:", new_avatar)

      form2.avatar_url = baseUrl + response.key;

      Put(system_base_url + 'account/accounts/' + store.getters.get_account.id, form2, true)
          .then((resp) => {
            ElMessage({
              showClose: true,
              message: '头像修改成功！',
              type: 'success',
              duration: 3000,
            })
            the_account.avatar_url = resp.data.avatar_url
            fileList.value = [
              {
                name: 'avatar.jpg',
                url: the_account.avatar_url,
              },
            ]
          })
          .catch((error) => {
            console.log(error);
          })
    }
    //上传失败后执行的代码
    const uploadError = (err) => {
      ElMessage({
        showClose: true,
        message: '上传失败！',
        type: 'error',
        duration: 3000,
      })
    }


    const form = reactive({
      email: '',
      code: '',
      password: '',
      password2: '',
    })

    const form2 = reactive({
      nickname: '',
      username: '',
      display_works: false,
      display_collections: false,
      introduction: '',
      avatar_url: ''
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

    const dom2 = ref(null)
    const rules2 = ref({

      nickname: [ // 昵称限制
        { required: true, message: "请输入昵称", trigger: "blur" },
        {
          validator: function(rule, value, callback) {
            if (value.length < 1 || value.length > 10) {
              callback(new Error("昵称长度必须为[1,10]"));
            } else {
              //校验通过
              callback();
            }
          },
          trigger: "blur"
        }
      ],

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

      introduction: [ // 简介限制
        { required: true, message: "请编辑个人简介", trigger: "blur" },
        {
          validator: function(rule, value, callback) {
            if (value.length < 1 || value.length > 30) {
              callback(new Error("个人简介长度必须为[1,30]"));
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
      if (sendEndTime) countDown(email_clock_seconds);
      the_account.id = Number(route.params.account_id);
      Get(system_base_url + 'account/accounts/' + the_account.id, {}, false)
      .then((resp) => {
        fileList.value = [
          {
            name: 'avatar.jpg',
            url: resp.data.avatar_url,
          },
        ]

        the_account.avatar_url = resp.data.avatar_url
        form2.avatar_url = resp.data.avatar_url
        the_account.nickname = resp.data.nickname
        form2.nickname = resp.data.nickname
        the_account.follow_count = resp.data.follow_count
        the_account.fan_count = resp.data.fan_count
        the_account.email = resp.data.email
        form.email = resp.data.email
        the_account.username = resp.data.username
        form2.username = resp.data.username
        the_account.introduction = resp.data.introduction
        form2.introduction = resp.data.introduction
        the_account.display_works = resp.data.display_works
        form2.display_works = resp.data.display_works
        the_account.display_collections = resp.data.display_collections
        form2.display_collections = resp.data.display_collections

        follow_id.value = resp.data.follow_id
      })
      .catch((error) => {
        console.log(error);
      })

    })


    const send_email = () => {
      dom.value.validateField('email', async (valid) => {
        if (valid) {

          // 如果大于0  直接return
          if (clock.countDownTime > 0) return false
          // 发送axios
          await Get(system_base_url + 'account/update_password/', {
            'email' : form.email,
          }, false, 2)
          .then((resp) => {
            countDown(email_clock_seconds)
          })
          .catch((error) => {
            console.log(error.response)
          })

        } else {
          return false;
        }
      })

    }

    const clear_form = () => {
      Object.keys(form).map(key => {
        form[key] = ''
      })
    }

    const router = useRouter();
    const update_password = () => {

      dom.value.validate((valid) => {
        if (valid) {
          Post(system_base_url + 'account/update_password/', form, false)
          .then((resp) => {
            store.dispatch('logout')
            router.push('/')
            clear_form()
          })
          .catch((error) => {
            console.log('error.response.data.result:', error.response.data.result);
          })

        } else {
          return false
        }
      })
    }

    const huan_yuan = () => {
      form2.avatar_url = the_account.avatar_url
      form2.nickname = the_account.nickname
      form2.username = the_account.username
      form2.introduction = the_account.introduction
      form2.display_works = the_account.display_works
      form2.display_collections = the_account.display_collections
    }

    const update_profile = () => {

      dom2.value.validate((valid) => {
        if (valid) {

          Put(system_base_url + 'account/accounts/' + store.getters.get_account.id, form2, true)
              .then((resp) => {
                ElMessage({
                  showClose: true,
                  message: '修改成功！',
                  type: 'success',
                  duration: 3000,
                })
                the_account.nickname = resp.data.nickname
                the_account.follow_count = resp.data.follow_count
                the_account.fan_count = resp.data.fan_count
                the_account.email = resp.data.email
                form.email = resp.data.email
                the_account.username = resp.data.username
                the_account.introduction = resp.data.introduction
                the_account.display_works = resp.data.display_works
                the_account.display_collections = resp.data.display_collections
                follow_id.value = resp.data.follow_id
              })
              .catch((error) => {
                console.log(error);
              })

        } else {
          return false
        }
      })
    }

    const update_avatar = () => {
      if (fileList.value.length === 0) {
        ElMessage({
          showClose: true,
          message: '请选择照片！',
          type: 'error',
          duration: 3000,
        })
        return false
      } else if (fileList.value[0].url === the_account.avatar_url) {
        ElMessage({
          showClose: true,
          message: '请选择新照片！',
          type: 'error',
          duration: 3000,
        })
        return false
      }
      upload.value!.submit()
    }

    const open_profile = (id) => {
      router.push('/Profile/'  + id)
    }

    const load2 = () => {
      // count.value += 2
      console.log('load2')
    }

    const delete_follow = (id, pos, flag) => {
      Delete(system_base_url + 'account/follows/' + id, {}, true)
          .then((resp) => {
            if (flag) follow_list.value.splice(pos, 1);
            else follow_id.value = 0;
            ElMessage({
              showClose: true,
              message: '取消关注成功！',
              type: 'success',
              duration: 3000,
            })
          })
    }

    const add_follow = () => {
      Post(system_base_url + 'account/follows/', {follow_id:the_account.id}, true)
          .then((resp) => {
            follow_id.value = resp.data.id;
            ElMessage({
              showClose: true,
              message: '关注成功！',
              type: 'success',
              duration: 3000,
            })
          })
    }

    

    return {
      update_password,
      update_profile,
      huan_yuan,
      update_avatar,
      open_profile,
      delete_follow,
      add_follow,


      load2,
      follow_list,
      get_follow_list,
      fan_list,
      get_fan_list,

      shi_load,
      shi_collection_list,
      get_shi_collection_list,
      shi_currentPage,
      shi_pageSize,
      shi_have_more,
      shi_handleSizeChange,
      shi_handleCurrentChange,

      ci_load,
      ci_collection_list,
      get_ci_collection_list,
      ci_currentPage,
      ci_pageSize,
      ci_have_more,
      ci_handleSizeChange,
      ci_handleCurrentChange,

      the_account,
      follow_id,

      form,
      form2,
      dom,
      rules,
      dom2,
      rules2,
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


      Plus,
      Check,
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

.my-el-pagination {
  align-items: center; /*竖直居中*/
  justify-content: center; /*水平居中*/
  margin-top: 20px;
  margin-bottom: 20px;
}

</style>