<template>
  <el-row style="width: 100%; align-items: center; justify-content: center">
    <el-col :span="22">
      <div class="demo-collapse">

        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item title="系统说明" name="1">
            <div>
              系统功能：
            </div>
            <div>
              引玉才华-AI作诗;&nbsp;&nbsp;吹毛求瑕-格律检测;&nbsp;&nbsp;顺藤摸瓜-韵表检索;&nbsp;&nbsp;大浪淘沙-诗词检索;&nbsp;&nbsp;春城飞花-飞花令检索;&nbsp;&nbsp;
              收割如麻-数据分析;&nbsp;&nbsp;游子天涯-交流论坛;&nbsp;&nbsp;
            </div>

            <div>
              诗文分类算法：
            </div>
            <div>
              具体效果见“大浪淘沙”模块的诗文tag，算法并不完美，如有对分类存疑可联系作者。
            </div>

            <div>
              AI模型训练：
            </div>
            <div>
              使用“诗文分类算法”筛选出的近体诗（高质量数据集）进行训练，GPT2生成的律诗颔联和颈联自动满足对仗。
            </div>

            <div>
              待进行：
            </div>
            <div>
              词林正韵韵表，词谱，词曲分类，AI填词，词格检测。
            </div>

            <div>
              特别说明：
            </div>
            <div>
              系统纯属个人兴趣爱好，不涉及任何商业用途。
            </div>
          </el-collapse-item>
          <el-collapse-item title="帮助" name="2">
            <div>
              格律：
            </div>
            <div>
              引玉才华-AI作诗;&nbsp;&nbsp;吹毛求瑕-格律检测;&nbsp;&nbsp;顺藤摸瓜-韵表检索;&nbsp;&nbsp;大浪淘沙-诗词检索;&nbsp;&nbsp;春城飞花-飞花令检索;&nbsp;&nbsp;
              收割如麻-数据分析;&nbsp;&nbsp;游子天涯-交流论坛;&nbsp;&nbsp;
            </div>

            <div>
              韵表：
            </div>
            <div>
              引玉才华-AI作诗;&nbsp;&nbsp;吹毛求瑕-格律检测;&nbsp;&nbsp;顺藤摸瓜-韵表检索;&nbsp;&nbsp;大浪淘沙-诗词检索;&nbsp;&nbsp;春城飞花-飞花令检索;&nbsp;&nbsp;
              收割如麻-数据分析;&nbsp;&nbsp;游子天涯-交流论坛;&nbsp;&nbsp;
            </div>

            <div>
              诗文分类标准：
            </div>
            <div>
              引玉才华-AI作诗;&nbsp;&nbsp;吹毛求瑕-格律检测;&nbsp;&nbsp;顺藤摸瓜-韵表检索;&nbsp;&nbsp;大浪淘沙-诗词检索;&nbsp;&nbsp;春城飞花-飞花令检索;&nbsp;&nbsp;
              收割如麻-数据分析;&nbsp;&nbsp;游子天涯-交流论坛;&nbsp;&nbsp;
            </div>
          </el-collapse-item>
          <el-collapse-item title="鸣谢" name="3">
            <div>
              特别感谢XXX的数据集
            </div>
          </el-collapse-item>
          <el-collapse-item title="作者" name="4">
            <div>
              软件工程 本科生
            </div>

            <div>
              如遇到bug或者对系统有任何意见、建议，请邮件(给您发验证码的邮箱)联系我。
            </div>
          </el-collapse-item>
        </el-collapse>

      </div>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { ref } from 'vue'

export default {
  name: "AboutView",
  components: {},
  setup() {

    const activeNames = ref(['1'])
    const handleChange = (val: string[]) => {
      console.log(val)
    }

    return {
      activeNames,
      handleChange,
    }
  }
}
</script>

<style lang="scss" scoped>

</style>