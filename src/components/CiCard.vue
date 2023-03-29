<template>
  <el-card :body-style="{ padding: '10px' }" shadow="hover" style="width: 340px; border: none;">

    <div class="poetry-collection">
      <el-icon v-if="the_poetry.collection_id === 0" size="20" style="cursor: pointer" @click="collection(the_poetry.id)"><Star /></el-icon>
      <el-icon v-else size="20" style="cursor: pointer; color: #EA3323" @click="cancle_collection(the_poetry.collection_id)"><StarFilled /></el-icon>
    </div>
    <div class="poetry-name">
      《{{the_poetry.rhythmic}}》
    </div>
    <div class="poetry-author">
      <div>{{the_poetry.dynasty}}-{{the_poetry.author}}</div>
    </div>

    <div class="poetry-detail">
      <div class="poetry-detail-div">{{the_poetry.content}}</div>
    </div>

    <div class="poetry-tags" >
      <el-tag class="mx-1" effect="light" type="success">
        {{the_poetry.rhythmic.split('·')[0].split(' ')[0]}}
      </el-tag>
      <el-tag class="mx-1" effect="light" type="success" v-if="the_poetry.three_hundred">
        宋词三百首
      </el-tag>
    </div>

  </el-card>
</template>

<script lang="ts">
import {ref, watch} from "vue";
import {Delete, Post, system_base_url} from "@/utils/request";
import {ElMessage} from "element-plus";

export default {
  name: "CiCard",
  components: {},
  props: {
    poetry: {
      type: Object,
      required: true,
    },
  },
  setup(props) {

    const the_poetry = ref(props.poetry)

    watch(
        ()=>(props.poetry),
        (val,preVal)=>{
          the_poetry.value = val
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

    const cancle_collection = (collection_id) => {
      Delete(system_base_url + 'account/ci_collections/' + collection_id, {}, true)
          .then((resp) => {
            if (resp.status === 204) { // 删除成功返回204
              the_poetry.value.collection_id = 0;
              ElMessage({
                showClose: true,
                message: '取消收藏成功！',
                type: 'success',
                duration: 3000,
              })
            }

          })
          .catch((error) => {
            console.log(error)
          })
    }

    const collection = (ci_id) => {
      Post(system_base_url + 'account/ci_collections/', {ci_id:ci_id}, true)
          .then((resp) => {
            if (resp.status === 201) { // 成功收藏 创建成功返回201
              the_poetry.value.collection_id = resp.data.id;
              ElMessage({
                showClose: true,
                message: '收藏成功！',
                type: 'success',
                duration: 3000,
              })
            }
          })
          .catch((error) => {
            console.log(error)
          })
    }

    return {
      the_poetry,
      cancle_collection,
      collection,
    }
  }
}
</script>

<style lang="scss" scoped>

.poetry-collection {
  display: flex;
  justify-content: right;
  width: 100%;

}

.poetry-name {
  display: flex;
  justify-content: center;
  margin-bottom: 5px;
  width: 100%;
  font-size: 20px;
  /*文本超出 省略*/
  /*width:260px;
  overflow:hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow:ellipsis;*/
}

.poetry-author {
  display: flex;
  justify-content: center;
  margin-bottom: 5px;
  width: 100%;
  /*文本超出 省略*/
  /*width:260px;
  overflow:hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow:ellipsis;*/
}

.poetry-detail {
  //display: flex;
  //justify-content: space-between; /*水平居中*/
  //align-items: center; /*竖直居中*/
  //margin: 0 15px;
  width: 100%;
  text-align: center;
}
.poetry-detail-div {
  //font-family: '华文楷体';
  font-family:Georgia,"Nimbus Roman No9 L","Songti SC",STSong,"AR PL New Sung","AR PL SungtiL GB",NSimSun,SimSun,"TW\-Sung","WenQuanYi Bitmap Song","AR PL UMing CN","AR PL UMing HK","AR PL UMing TW","AR PL UMing TW MBE",sans-serif;
  font-size: 20px;
}

.poetry-tags {
  display: flex;
  justify-content: center;
  align-items: center; /*竖直居中*/
  margin: 5px 5px;
  width: 100%;
  flex-wrap:wrap; /*超过长度 换行*/
}
.poetry-tags .el-tag {
  margin-right: 5px;
  font-size: 14px;
  //cursor: pointer;
}
</style>