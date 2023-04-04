<template>
  <el-row style="width: 100%; align-items: center; justify-content: center">
    <el-col :span="22" >
      <div class="my">

        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item title="系统说明" name="1">
            <div class="title">
              系统功能：
            </div>
            <div class="content">
              1.引玉才华-AI作诗;&nbsp;&nbsp;2.吹毛求瑕-格律检测;&nbsp;&nbsp;3.顺藤摸瓜-韵表检索;&nbsp;&nbsp;4.大浪淘沙-诗词检索;&nbsp;&nbsp;5.春城飞花-飞花令检索;&nbsp;&nbsp;
              6.收割如麻-数据可视化分析;&nbsp;&nbsp;7.游子天涯-交流论坛;&nbsp;&nbsp;8.家-用户模块;
            </div>

            <div class="title">
              诗文分类：
            </div>
            <div class="content">
              1.诗文分类标准：大方向分为近体诗(也即格律诗)和非近体诗(其中有乐府、古体诗等)，近体诗需满足齐言(五、七言)、押韵(平韵脚)、平仄和粘对。
              近体诗按照联数('出句'和'对句'这两句即为一联)可分为绝句、律诗、排律；按照首句第二个字的平仄调可分为平起、仄起；
              按照首句的最后一个字是否押韵(韵脚)分为入韵、不入韵。古体诗也可分绝句、律诗，除了不要求平仄和粘对外，与近体诗同。另，为方便起见，本系统未作细分，一律将非近体诗标作古体。
              2.诗文分类算法：具体效果见“大浪淘沙”模块的诗文tag，算法严格按照分类标准，如有对分类存疑可联系作者。
            </div>

            <div class="title">
              AI模型训练：
            </div>
            <div class="content">
              使用“诗文分类算法”筛选出的近体诗（高质量数据集）进行训练，GPT2生成的律诗颔联和颈联自动满足对仗。
            </div>

            <div class="title">
              待进行模块：
            </div>
            <div class="content">
              词林正韵韵表，词谱，词曲分类，AI填词，词作格律检测。
            </div>

            <div class="title">
              特别说明：
            </div>
            <div class="content">
              个人爱好，不涉及任何商业用途。
            </div>
          </el-collapse-item>
          <el-collapse-item title="帮助" name="2">
            <div class="title">
              格律：
            </div>
            <div class="content">
             1.押韵：2.平仄 3.粘对 4.对仗
            </div>

            <div class="title">
              韵表：
            </div>
            <div class="content">
              作诗用平水韵 作词用词林正韵
            </div>

            <div class="title">
              格律诗检测：
            </div>
            <div class="content">
              鹤顶格即为藏头诗，限制只能输入四个字。
            </div>
          </el-collapse-item>
          <el-collapse-item title="鸣谢" name="3">
            <div>
              特别感谢XXX的数据集
            </div>
          </el-collapse-item>
          <el-collapse-item title="作者" name="4">

            <div style="text-align: center">
              <div>邮箱：909140058@qq.com</div>
              <el-image src="/wx.png" style="height: 400px"/>
              <div>如遇bug或对系统有任何意见、建议和问题都可联系，注明来意。</div>
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

.my .el-collapse {
  --el-collapse-header-bg-color: rgb(128, 128, 128, 0);
  --el-collapse-content-bg-color: rgb(128, 128, 128, 0);

  --el-collapse-header-font-size: 20px;
  --el-collapse-content-font-size: 16px;
}

.my .title {
  font-weight: bold;
}

.my .content {
  margin-bottom: 10px;
}

</style>