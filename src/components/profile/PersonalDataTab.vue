<template>
  <el-form :model="update_profile_form" :rules="update_profile_rules" ref="update_profile_dom" label-width="80px">

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
      <el-input v-model="update_profile_form.nickname" show-word-limit maxlength="10" />
    </el-form-item>
    <el-form-item label="账号" prop="username">
      <el-input v-model="update_profile_form.username" show-word-limit maxlength="12" />
    </el-form-item>

    <el-form-item label="公开作品">
      <el-switch v-model="update_profile_form.display_works" inline-prompt active-text="是" inactive-text="否"/>
    </el-form-item>
    <el-form-item label="公开收藏">
      <el-switch v-model="update_profile_form.display_collections" inline-prompt active-text="是" inactive-text="否"/>
    </el-form-item>
    <el-form-item label="个人简介" prop="introduction">
      <el-input v-model="update_profile_form.introduction" type="textarea" :autosize="{ minRows: 3, maxRows: 3 }" show-word-limit maxlength="30">
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="update_account">修改信息</el-button>
      <el-button @click="huan_yuan">还原</el-button>
    </el-form-item>
  </el-form>

</template>

<script lang="ts">
import {reactive, ref, watch} from "vue";
import {ElMessage, UploadInstance, UploadProps, UploadUserFile} from "element-plus";
import {authGet, authPut, system_base_url} from "@/utils/request";
import store from "@/store";

export default {
  name: "PersonalDataTab",
  components: {},
  props: {
    the_account: {
      type: Object,
      required: true,
    },
  },
  setup(props, context) {

    const upload = ref<UploadInstance>()
    const fileList = ref<UploadUserFile[]>([
      {
        name: 'avatar.jpg',
        url: props.the_account.avatar_url,
      },
    ])
    const update_profile_form = reactive({
      nickname: '',
      username: '',
      display_works: false,
      display_collections: false,
      introduction: '',
      avatar_url: ''
    })

    watch(
        ()=>(props.the_account),
        (val,preVal)=>{
          //val为修改后的值,preVal为修改前的值
          update_profile_form.nickname = val.nickname
          update_profile_form.username = val.username
          update_profile_form.display_works = val.display_works
          update_profile_form.display_collections = val.display_collections
          update_profile_form.introduction = val.introduction
          update_profile_form.avatar_url = val.avatar_url
        },
        {
          //如果加了这个参数，值为true的话，就消除了惰性，watch会在创建后立即执行一次
          //那么首次执行，val为默认值,preVal为undefined
          immediate:true,
          //这个参数代表监听对象时，可以监听深度嵌套的对象属性
          //比如message是一个对象的话，可以监听到message.a.b.c，也就是message下的所有属性
          deep:true,
        }
    )

    watch(
        ()=>(props.the_account.avatar_url),
        (val,preVal)=>{
          fileList.value = [
            {
              name: 'avatar.jpg',
              url: val,
            },
          ]
        },
        {
          immediate:true,
          deep:false,
        }
    )

    const huan_yuan = () => {
      update_profile_form.avatar_url = props.the_account.avatar_url
      update_profile_form.nickname = props.the_account.nickname
      update_profile_form.username = props.the_account.username
      update_profile_form.introduction = props.the_account.introduction
      update_profile_form.display_works = props.the_account.display_works
      update_profile_form.display_collections = props.the_account.display_collections
    }

    const update_account = () => {
      update_profile_dom.value.validate((valid) => {
        if (valid) {
          context.emit('update_account', update_profile_form, status => {
            if (status === 200) {
              ElMessage({
                showClose: true,
                message: '修改成功！',
                type: 'success',
                duration: 3000,
              })
            } else {
              ElMessage({
                showClose: true,
                message: '修改失败！',
                type: 'error',
                duration: 3000,
              })
            }

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
      } else if (fileList.value[0].url === props.the_account.avatar_url) {
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

    const upload_data = ref({
      // key: "",
      token: "",
    })

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

      await authGet(system_base_url + 'account/get_qiniu_token/', {})
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

      update_profile_form.avatar_url = baseUrl + response.key;

      authPut(system_base_url + 'account/accounts/' + store.getters.get_account.id, update_profile_form)
          .then((resp) => {
            if (resp.status === 200) {
              ElMessage({
                showClose: true,
                message: '头像修改成功！',
                type: 'success',
                duration: 3000,
              })
              context.emit('update_account_avatar_url', resp.data.avatar_url)
            } else {
              ElMessage({
                showClose: true,
                message: '头像修改失败！',
                type: 'error',
                duration: 3000,
              })
            }
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

    const update_profile_dom = ref(null)
    const update_profile_rules = ref({

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

    return {
      update_account,
      huan_yuan,
      handleAvatarSuccess,
      uploadError,
      beforeAvatarUpload,
      update_avatar,
      update_profile_dom,
      update_profile_rules,
      upload,
      update_profile_form,
      fileList,
      upload_data,

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

</style>