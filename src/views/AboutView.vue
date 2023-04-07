<template>
  <el-row style="width: 100%; align-items: center; justify-content: center">
    <el-col :span="22" >
      <div class="my">

        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item title="系统说明" name="1">
            <div class="title">
              一、系统功能：
            </div>
            <div class="content">
              1.引玉才华-AI作诗;&nbsp;&nbsp;2.吹毛求瑕-格律检测;&nbsp;&nbsp;3.顺藤摸瓜-韵表检索;&nbsp;&nbsp;4.大浪淘沙-诗词检索;&nbsp;&nbsp;5.春城飞花-飞花令检索;&nbsp;&nbsp;
              6.收割如麻-数据可视化分析;&nbsp;&nbsp;7.游子天涯-交流论坛;&nbsp;&nbsp;8.家-用户模块;
            </div>

            <div class="title">
              二、诗文分类：
            </div>
            <div class="content">
              1.<b>诗文分类标准</b>:<br>
              &nbsp;&nbsp;大方向分为近体诗(也即格律诗)和非近体诗(其中有乐府、古体诗等)，近体诗需满足齐言(五、七言)、押韵(平韵脚)、平仄和粘对。
              近体诗按照联数('出句'和'对句'这两句即为一联)可分为绝句、律诗、排律；按照首句第二个字的平仄调可分为平起、仄起；
              按照首句的最后一个字是否押韵(韵脚)分为入韵、不入韵。古体诗也可分绝句、律诗，除了不要求平仄和粘对外，与近体诗同。另，为方便起见，本系统未作细分，一律将非近体诗标作古体。<br>
              2.<b>诗文分类算法</b>:<br>
              &nbsp;&nbsp;具体效果见“大浪淘沙”模块的诗文tag，算法严格按照分类标准，如有对分类存疑可联系作者。
            </div>

            <div class="title">
              三、AI模型训练：
            </div>
            <div class="content">
              使用“诗文分类算法”筛选出的近体诗（高质量数据集）进行训练，GPT2生成的律诗颔联和颈联自动满足对仗。
            </div>

            <div class="title">
              四、飞花令明细：
            </div>
            <div class="content">
              1.<b>种类</b>:<br>
              &nbsp;&nbsp;①数字:['几', '零', '一', '二', '两', '三', '四', '五', '六', '七', '八', '九', '十', '百', '千', '万', '亿']<br>
              &nbsp;&nbsp;②季节:['春', '夏', '秋', '冬']<br>
              &nbsp;&nbsp;③方位:['上', '下', '前', '后', '左', '右', '东', '西', '南', '北', '里', '外', '中', '内', '旁']<br>
              &nbsp;&nbsp;④天气:['风', '雨', '阴', '晴', '雾', '霜', '雪']<br>
              &nbsp;&nbsp;⑤颜色:['红', '赤', '粉', '橙', '黄', '金', '褐', '棕', '绿', '青', '碧', '葱', '翠', '皓', '蓝', '靛', '紫', '黑', '乌', '墨', '白', '灰', '银']<br>
              &nbsp;&nbsp;⑥酒器:['樽', '壶', '瓢', '杯', '盏', '斗'](还必须带'酒'字)<br>
              &nbsp;&nbsp;⑦叠词:连续叠两个字及以上(标点符号隔开不算)<br>
              &nbsp;&nbsp;七大类参考历届<b>中国诗词大会</b>节目<br>

              2.<b>数据源</b>:<br>
              &nbsp;&nbsp;①全唐诗<br>
              &nbsp;&nbsp;②宋诗部分作者:['陆游', '刘克庄', '杨万里', '赵蕃', '梅尧臣', '方回', '苏轼', '韩淲', '张耒', '黄庭坚', '王十朋', '陈造', '周紫芝', '苏辙', '释德洪', '王安石', '刘敞', '释居简']<br>
              &nbsp;&nbsp;③全宋词<br>
              &nbsp;&nbsp;④五代(唐)词<br>
              &nbsp;&nbsp;⑤纳兰性德词、王国维词<br>
              &nbsp;&nbsp;⑥毛泽东诗词<br>
              &nbsp;&nbsp;欢迎补充、修正。
            </div>

            <div class="title">
              五、待进行模块：
            </div>
            <div class="content">
              词林正韵韵表，词谱，词曲分类，AI填词，词作格律检测。
            </div>

            <div class="title">
              六、特别说明：
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
              本系统绝大部分数据来自GitHub项目:<el-link href="https://github.com/chinese-poetry/chinese-poetry" :underline="false" style="font-size: 16px; font-weight: bold">最全中华古诗词数据库</el-link>，特别感谢项目创建者和维护者-高哥！
            </div>
          </el-collapse-item>
          <el-collapse-item title="作者" name="4">

            <div style="text-align: center">
              <div>邮箱：909140058@qq.com</div>
              <el-image src="/wx.png" style="height: 400px"/>
              <div>遇bug、有意见、建议或问题，可联系，注明来意。</div>
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
      // console.log(val)
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