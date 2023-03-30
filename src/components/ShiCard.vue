<template>
  <el-card :body-style="{ padding: '10px' }" shadow="hover" style="width: 340px; border: none;">

    <div class="poetry-collection">
      <el-icon v-if="poetry.collection_id === 0" size="20" style="cursor: pointer" @click="collection(poetry.id)"><Star /></el-icon>
      <el-icon v-else size="20" style="cursor: pointer; color: #EA3323" @click="cancle_collection(poetry.collection_id)"><StarFilled /></el-icon>
    </div>
    <div class="poetry-name">
      《{{poetry.title}}》
    </div>
    <div class="poetry-author">
      <div>{{poetry.dynasty}}-{{poetry.author}}</div>
    </div>

    <div class="poetry-detail">
      <div class="poetry-detail-div" v-for="(sen, index) in poetry.content" :key="index">{{sen}}</div>
    </div>

    <div class="poetry-tags">
      <el-tag class="mx-1" effect="light" type="" :round="true">
        {{poetry.metric ? '近体' : '古体'}}
      </el-tag>
      <template v-if="poetry.jue !== 3">
        <el-tag class="mx-1" effect="light" type="" :round="true">
          {{poetry.jue === 0 ? '绝句' : poetry.jue === 1 ? '律诗' : '排律'}}
        </el-tag>
      </template>

      <template v-if="poetry.rhyme !== ''">
        <el-tag class="mx-1" effect="light" type="" :round="true">
          {{poetry.rhyme}}
        </el-tag>
        <el-tag class="mx-1" effect="light" type="" :round="true">
          {{poetry.ru === false ? '入韵' : '不入韵'}}
        </el-tag>
      </template>

      <template v-if="poetry.metric === 1">
        <el-tag class="mx-1" effect="light" type="" :round="true" >
          {{poetry.qi ? '平起' : '仄起'}}
        </el-tag>
      </template>
      <template v-if="poetry.three_hundred">
        <el-tag class="mx-1" effect="light" type="" :round="true" >
          唐诗三百首
        </el-tag>
      </template>


    </div>

  </el-card>
</template>

<script lang="ts">

import {Delete, Post, system_base_url} from "@/utils/request";
import {ElMessage} from "element-plus";
import {ref, watch} from "vue";

export default {
  name: "ShiCard",
  components: {},
  props: {
    poetry: {
      type: Object,
      required: true,
    },
    pos: {
      type: Number,
      required: true,
    },
  },
  setup(props, context) {
    const cancle_collection = (collection_id, pos) => {
      context.emit('cancle_collection', {collection_id:collection_id, pos:props.pos}, status => {
        if (status === 204) {
          ElMessage({
            showClose: true,
            message: '取消收藏成功！',
            type: 'success',
            duration: 3000,
          })
        } else {
          ElMessage({
            showClose: true,
            message: '取消收藏失败！',
            type: 'error',
            duration: 3000,
          })
        }
      })
    }

    const collection = (shi_id, pos) => {
      context.emit('collection', {shi_id:shi_id, pos:props.pos}, status => {
        if (status === 201) {
          ElMessage({
            showClose: true,
            message: '收藏成功！',
            type: 'success',
            duration: 3000,
          })
        } else {
          ElMessage({
            showClose: true,
            message: '收藏失败！',
            type: 'error',
            duration: 3000,
          })
        }
      })
    }

    return {
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
  //font-family: '楷体';
  //font-family: '华文楷体';
  font-family:Georgia,"Nimbus Roman No9 L","Songti SC",STSong,"AR PL New Sung","AR PL SungtiL GB",NSimSun,SimSun,"TW\-Sung","WenQuanYi Bitmap Song","AR PL UMing CN","AR PL UMing HK","AR PL UMing TW","AR PL UMing TW MBE",sans-serif;
  font-size: 20px;
}

.poetry-tags {
  display: flex;
  justify-content: center;
  align-items: center; /*竖直居中*/
  margin: 5px 0px;
  width: 100%;
  flex-wrap:wrap; /*超过长度 换行*/
}
.poetry-tags .el-tag {
  margin-right: 5px;
  font-size: 14px;
  //cursor: pointer;
}
</style>