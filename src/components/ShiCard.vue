<template>
  <el-card :body-style="{ padding: '10px' }" shadow="hover" style="width: 340px; border: none;">

<!--    <el-image style="width: 250px; height: 300px; margin-bottom: 10px"
              src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" fit="cover" />-->

    <div class="poetry-name">
      《{{poetry.title}}》
    </div>
    <div class="poetry-author">
      <div>{{poetry.dynasty}}-{{poetry.author}}</div>
    </div>

    <div class="poetry-detail">
<!--      <span class="poetry-detail-span">{{poetry.fig_birthday}} ~ {{poetry.fig_deathday}}</span>-->
      <div class="poetry-detail-div" v-for="(sen, index) in poetry.content" :key="index">{{sen}}</div>
<!--      <el-button class="button" text @click="open_FigureDetail(poetry.fig_id)">查看详情</el-button>-->
    </div>

    <div class="poetry-tags" v-if="poetry.rhyme_type === 0">

      <el-tag class="mx-1" effect="light" type="" :round="true">
        不是格律诗
      </el-tag>

    </div>

    <div class="poetry-tags" v-else>
      <el-tag class="mx-1" effect="light" type="" :round="true">
        {{poetry.yan === 7 ? '七言' : '五言'}}{{poetry.jue === 0 ? '绝句' : poetry.jue === 1 ? '律句' : '排律'}}
      </el-tag>
      <el-tag class="mx-1" effect="light" type="" :round="true">
        {{poetry.rhyme}}
      </el-tag>
      <el-tag class="mx-1" effect="light" type="" :round="true">
        {{poetry.qi === 1 ? '平起' : '仄起'}}
      </el-tag>
      <el-tag class="mx-1" effect="light" type="" :round="true">
        {{poetry.ru === 0 ? '首句入韵' : '首句不入韵'}}
      </el-tag>
    </div>

  </el-card>
</template>

<script lang="ts">

export default {
  name: "ShiCard",
  components: {},
  props: {
    poetry: {
      type: Object,
      required: true,
    },
  },
  setup() {


    return {

    }
  }
}
</script>

<style lang="scss" scoped>
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
  font-family: '华文楷体';
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