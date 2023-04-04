<template>
  <el-card :body-style="{ padding: '10px' }" shadow="hover" style="width: 340px; border: none;">

    <!--    <el-image style="width: 250px; height: 300px; margin-bottom: 10px"
                  src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" fit="cover" />-->

    <div class="poetry-name">
      《{{poetry.title}}》
    </div>
    <div class="poetry-author">
<!--      <div>{{poetry.chapter}}-{{poetry.section}}</div>-->
      <div>先秦-佚名</div>
    </div>

    <div class="poetry-detail">
      <div class="poetry-detail-div">{{poetry.content}}</div>
    </div>

    <div class="poetry-tags" >
      <el-tag class="mx-1" effect="light" type="danger">
        {{poetry.chapter}}
      </el-tag>
      <el-tag class="mx-1" effect="light" type="danger">
        {{poetry.section}}
      </el-tag>
      <el-tag class="mx-1" effect="light" type="danger">
        {{poetry.title}}
      </el-tag>
    </div>

  </el-card>
</template>

<script lang="ts">
export default {
  name: "ShijingCard",
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
  font-family: '瘦金体简','行楷',NSimSun,SimSun;
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