<template>

  <el-row justify="center" align="middle">
    <el-col :xl="5" :lg="5" :md="4" :sm="2" :xs="0">

    </el-col>
    <el-col :xl="14" :lg="14" :md="16" :sm="19" :xs="23">

      <!-- LSTM模型 -->
      <el-card class="box-card" style="margin-bottom: 10px">
        <!-- 标题 -->
        <div style="text-align: center; width: 100%; font-weight: bold; font-size: 18px">LSTM</div>

        <!-- 生成诗文结果展示 -->
        <div class="card-body ai_content">
          <el-card class="box-card mx-card" shadow="never" v-loading="lstm_loading">

            <!-- 空状态 -->
            <div v-if="lstm_display_state === 0">
              <div style="text-align: center; width: 100%">我是一个无情的作诗机器~</div>
            </div>

            <!-- 作诗状态 -->
            <div v-else-if="lstm_display_state === 1"></div>

            <!-- 展示状态 -->
            <div v-else-if="lstm_display_state === 2">
              <div v-for="(poem, index) in lstmCreateList" :key="index">
                <div v-if="poem[0] === 0">没有限制押韵</div>
                <div v-else>{{poem[0] === 1 ? '平水韵' : '中华新韵'}} : {{poem[1]}}</div>
                <div class="ai_create_poetry" v-for="(sen, index2) in poem[2]" :key="index-index2">{{sen}}</div>
              </div>
            </div>
          </el-card>

        </div>

        <!-- 选项 -->
        <el-row justify="center" align="middle" :gutter="30">
          <el-col :span="5">
            <el-switch v-model="yan" size="large" inline-prompt style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" active-text="七言" inactive-text="五言"/>
          </el-col>
          <el-col :span="5">
            <el-switch v-model="jue" size="large" inline-prompt style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" active-text="绝句" inactive-text="律句"/>
          </el-col>
          <el-col :span="5">
            <el-switch v-model="qi" size="large" inline-prompt style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" active-text="平起" inactive-text="仄起"/>
          </el-col>
          <el-col :span="5">
            <el-tooltip content="首句是否押(入)韵" placement="top">
              <el-switch v-model="ru" size="large" inline-prompt active-text="入韵" inactive-text="不入"/>
            </el-tooltip>
          </el-col>
        </el-row>
        <el-row justify="center" align="middle" :gutter="30">
          <el-col :span="10">
            <el-select v-model="use_rhyme" placeholder="选韵表" style="">
              <el-option :key="0" :label="'不管平仄押韵'" :value="0"/>
              <el-option :key="1" :label="'平水韵'" :value="1"/>
              <el-option :key="2" :label="'中华新韵'" :value="2"/>
            </el-select>
          </el-col>
          <el-col :span="10">
            <el-select v-model="style" placeholder="生成方式" style="">
              <el-option :key="0" :label="'单字续写'" :value="0"/>
              <el-option :key="1" :label="'首句续写'" :value="1"/>
              <el-option :key="2" :label="'鹤顶格'" :value="2"/>
            </el-select>
          </el-col>
        </el-row>
        <el-row justify="center" align="middle" :gutter="30">
          <el-col :span="12">
            <el-input style="" v-model="text" placeholder="不用管标点符号" clearable>
            </el-input>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" id="lstm_create_button" @click="lstm_create" :loading="lstm_loading">{{lstm_button_state}}</el-button>
          </el-col>
          <!--              <el-col :span="4" v-if="lstm_display_state === 2">
                          <el-button type="success">存入我的诗库</el-button>
                        </el-col>-->

        </el-row>

      </el-card>

      <!-- GPT2模型 -->
      <el-card class="box-card" >
        <!-- 标题 -->
        <div style="text-align: center; width: 100%; font-weight: bold; font-size: 18px">GPT2</div>

        <!-- 生成诗文结果展示 -->
        <div class="card-body ai_content">
          <el-card class="box-card mx-card" shadow="never" v-loading="gpt2_loading">

            <!-- 空状态 -->
            <div v-if="gpt2_display_state === 0">
              <div style="text-align: center; width: 100%">我是一个无情但有素的作诗机器~</div>
            </div>

            <!-- 作诗状态 -->
            <div v-else-if="gpt2_display_state === 1"></div>

            <!-- 展示状态 -->
            <div v-else-if="gpt2_display_state === 2">
              <div v-for="(poem, index) in gpt2CreateList" :key="index">
                <div v-if="poem[0] === 0">没有限制押韵</div>
                <div v-else>{{poem[0] === 1 ? '平水韵' : '中华新韵'}} : {{poem[1]}}</div>
                <div class="ai_create_poetry" v-for="(sen, index2) in poem[2]" :key="index-index2">{{sen}}</div>
              </div>
            </div>
          </el-card>

        </div>

        <!-- 选项 -->
        <el-row justify="center" align="middle" :gutter="30">
          <el-col :span="5">
            <el-switch v-model="yan2" size="large" inline-prompt style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" active-text="七言" inactive-text="五言"/>
          </el-col>
          <el-col :span="5">
            <el-switch v-model="jue2" size="large" inline-prompt style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" active-text="绝句" inactive-text="律句"/>
          </el-col>
          <el-col :span="5">
            <el-switch v-model="qi2" size="large" inline-prompt style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" active-text="平起" inactive-text="仄起"/>
          </el-col>
          <el-col :span="5">
            <el-tooltip content="首句是否押(入)韵" placement="top">
              <el-switch v-model="ru2" size="large" inline-prompt active-text="入韵" inactive-text="不入"/>
            </el-tooltip>
          </el-col>
        </el-row>
        <el-row justify="center" align="middle" :gutter="30">
          <el-col :span="10">
            <el-select v-model="use_rhyme2" placeholder="选韵表" style="">
              <el-option :key="0" :label="'不管平仄押韵'" :value="0"/>
              <el-option :key="1" :label="'平水韵'" :value="1"/>
              <el-option :key="2" :label="'中华新韵'" :value="2"/>
            </el-select>
          </el-col>
          <el-col :span="10">
            <el-select v-model="style2" placeholder="生成方式" style="">
              <el-option :key="0" :label="'单字续写'" :value="0"/>
              <el-option :key="1" :label="'首句续写'" :value="1"/>
              <el-option :key="2" :label="'鹤顶格'" :value="2"/>
            </el-select>
          </el-col>
        </el-row>
        <el-row justify="center" align="middle" :gutter="30">
          <el-col :span="12">
            <el-input style="" v-model="text2" placeholder="不用管标点符号" clearable>
            </el-input>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" id="gpt2_create_button" @click="gpt2_create" :loading="gpt2_loading">{{gpt2_button_state}}</el-button>
          </el-col>
          <!--              <el-col :span="4" v-if="gpt2_display_state === 2">
                          <el-button type="success">存入我的诗库</el-button>
                        </el-col>-->

        </el-row>

      </el-card>

    </el-col>
    <el-col :xl="5" :lg="5" :md="4" :sm="2" :xs="0">

    </el-col>
  </el-row>

</template>

<style lang="scss" scoped>

.ai_content .el-card {
  --el-card-padding: 0px;
}

.el-row {
  margin-bottom: 10px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}


.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
}
.card_intro {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #99a9bf;
}
.card-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  //width: 480px;
  width: 100%;
}

.mx-card {
  height: 180px;
}
.mx-card div {
  margin: 10px auto;
  width: 100%;
  text-align: center;
}
.ai_create_poetry {
  font-family:Georgia,"Nimbus Roman No9 L","Songti SC",STSong,"AR PL New Sung","AR PL SungtiL GB",NSimSun,SimSun,"TW\-Sung","WenQuanYi Bitmap Song","AR PL UMing CN","AR PL UMing HK","AR PL UMing TW","AR PL UMing TW MBE",sans-serif;

  font-size: 18px;
}

</style>


<script lang="ts">
import { ref } from 'vue';
import {instance} from "@/utils/utils";
import { ElMessage } from 'element-plus'
import {Get, Post} from "@/utils/request";

export default {
  name: "AICreateView",
  components: {},
  setup() {
    const text = ref('')
    const yan = ref(true)
    const jue = ref(true)
    const qi = ref(true)
    const ru = ref(true)
    const use_rhyme = ref(1)
    const style = ref(0)
    const lstmCreateList = ref([])
    const lstm_loading = ref(false)
    const lstm_button_state = ref('开始作诗')
    const lstm_display_state = ref(0)

    const text2 = ref('')
    const yan2 = ref(true)
    const jue2 = ref(true)
    const qi2 = ref(true)
    const ru2 = ref(true)
    const use_rhyme2 = ref(1)
    const style2 = ref(0)
    const gpt2CreateList = ref([])
    const gpt2_loading = ref(false)
    const gpt2_button_state = ref('开始作诗')
    const gpt2_display_state = ref(0)

    const is_word_num_valid = (text:string, style:number, yan:boolean) => {
      let txt = text.length
      let len = yan ? 7 : 5
      if (style === 0 && txt === 1) return true
      else if (style === 1 && txt === len) return true
      else if (style === 2 && txt === 4) return true
      return false
    }

    const first_sentence_valid = async(text:string, yan:boolean, qi:boolean, ru:boolean, use_rhyme:number) => {
      let flag = false

      //axios是异步请求（返回Promise对象），想要让ret获取到他的结果然后给flag 必须用async/await使其同步

      const ret = await Get('rhyme/first_sentence/', {
        text: text,
        yan: yan ? 7 : 5,
        qi: qi ? 1 : 0,
        ru: ru ? 0 : 1,
        use_rhyme: use_rhyme,
      }, false)
      
      flag = (ret.data.is_rhyme === 1)
      return flag
    }

    const lstm_change_state = (state:number) => { // state:1-正在作诗 2-作诗完毕
      lstm_display_state.value = state;
      if (state === 1) {
        lstm_loading.value = true;
        lstm_button_state.value = '正在作诗';
      } else if (state === 2) {
        lstm_loading.value = false;
        lstm_button_state.value = '开始作诗';
      }
    }

    const gpt2_change_state = (state:number) => { // state:1-正在作诗 2-作诗完毕
      gpt2_display_state.value = state;
      if (state === 1) {
        gpt2_loading.value = true;
        gpt2_button_state.value = '正在作诗';
      } else if (state === 2) {
        gpt2_loading.value = false;
        gpt2_button_state.value = '开始作诗';
      }
    }

    const reserved_chinese_word = (text:string) => {
      if (text === '') return '';
      let regEx = /[^\u4e00-\u9fa5\uf900-\ufa2d]/g;
      return text.replace(regEx, '');
    }

    const lstm_create = async() => {
      let text_filter = reserved_chinese_word(text.value)
      if (text_filter !== text.value) { // 如果输入框有其他符号则警告
        ElMessage({
          showClose: true,
          message: '建议不要输入其他符号，只输入汉字哦~',
          type: 'warning',
          duration: 3000,
        })
      }

      if (!is_word_num_valid(text_filter, style.value, yan.value)) { // 判断字数是否正确
        let num = 1
        if (style.value === 1) {
          num = yan.value ? 7 : 5
        } else if (style.value === 2) {
          num = 4
        }
        let msg:string = '输入字数不正确，应为' + num + '个汉字'
        ElMessage({
          showClose: true,
          message: msg,
          type: 'error',
          duration: 3000,
        })
        return false
      }

      if (style.value === 1 && use_rhyme.value) { // 首句续写 并且限制用韵了

        //同样的，async返回的是一个Promise对象（异步），要用await等待这个promise的返回结果后，再继续执行，才能让ret获取到他的结果
        let ret = await first_sentence_valid(text_filter, yan.value, qi.value, ru.value, use_rhyme.value)

        if (!ret) { // 如果给出的首句平仄韵不对
          let yun_table = use_rhyme.value == 1 ? '平水韵' : '中华新韵'
          let the_yan = yan.value ? '七言' : '五言'
          let the_qi = qi.value ? '平起' : '仄起'
          let the_ru = ru.value ? '入韵' : '不入韵'
          ElMessage({
            showClose: true,
            message: '您输入的首句不符合' + the_yan + the_qi + the_ru + '的' + yun_table + '标准。\n请查阅韵表进行修改，或选择不押韵生成。',
            type: 'error',
            duration: 3000,
          })
          return false
        }
      }

      lstm_change_state(1) // 字数和韵律都符合规范 切换状态 开始作诗

      await Get('create/lstm/', {
        text: text_filter,
        yan: yan.value ? 7 : 5,
        jue: jue.value ? 0 : 1,
        qi: qi.value ? 1 : 0,
        ru: ru.value ? 0 : 1,
        use_rhyme: use_rhyme.value,
        style: style.value,
      }, true, 1)
      .then((resp) => {
        lstm_change_state(2)
        console.log(resp.data);
        lstmCreateList.value = resp.data.createList;
      })
      .catch((error) => {
        lstm_change_state(2)
        console.log(error);
      })
    };

    const gpt2_create = async() => {
      let text_filter = reserved_chinese_word(text2.value)
      if (text_filter !== text2.value) { // 如果输入框有其他符号则警告
        ElMessage({
          showClose: true,
          message: '建议不要输入其他符号，只输入汉字哦~',
          type: 'warning',
          duration: 3000,
        })
      }

      if (!is_word_num_valid(text_filter, style2.value, yan2.value)) {
        let num = 1
        if (style2.value === 1) {
          num = yan2.value ? 7 : 5
        } else if (style2.value === 2) {
          num = 4
        }
        let msg:any = '输入字数不正确，应为' + num + '个汉字'
        ElMessage({
          showClose: true,
          message: msg,
          type: 'error',
          duration: 3000,
        })
        return false
      }

      if (style2.value === 1 && use_rhyme2.value) { // 首句续写 并且限制用韵了

        //同样的，async返回的是一个Promise对象（异步），要用await等待这个promise的返回结果后，再继续执行，才能让ret获取到他的结果
        let ret = await first_sentence_valid(text_filter, yan2.value, qi2.value, ru2.value, use_rhyme2.value)

        if (!ret) { // 如果给出的首句平仄韵不对
          let yun_table = use_rhyme2.value == 1 ? '平水韵' : '中华新韵'
          let the_yan = yan2.value ? '七言' : '五言'
          let the_qi = qi2.value ? '平起' : '仄起'
          let the_ru = ru2.value ? '入韵' : '不入韵'
          ElMessage({
            showClose: true,
            message: '您输入的首句不符合' + the_yan + the_qi + the_ru + '的' + yun_table + '标准。\n请查阅韵表进行修改，或选择不押韵生成。',
            type: 'error',
            duration: 3000,
          })
          return false
        }
      }

      gpt2_change_state(1);
      await Get('create/gpt2/', {
        text: text_filter,
        yan: yan2.value ? 7 : 5,
        jue: jue2.value ? 0 : 1,
        qi: qi2.value ? 1 : 0,
        ru: ru2.value ? 0 : 1,
        use_rhyme: use_rhyme2.value,
        style: style2.value,
      }, true, 1)
      .then((resp) => {
        gpt2_change_state(2)
        console.log(resp.data);
        gpt2CreateList.value = resp.data.createList;
      })
      .catch((error) => {
        gpt2_change_state(2)
        console.log(error);
      })
      console.log('完毕');
    };

    return {
      text,
      yan,
      jue,
      qi,
      ru,
      use_rhyme,
      style,
      lstmCreateList,
      lstm_loading,
      lstm_button_state,
      lstm_display_state,

      text2,
      yan2,
      jue2,
      qi2,
      ru2,
      use_rhyme2,
      style2,
      gpt2CreateList,
      gpt2_loading,
      gpt2_button_state,
      gpt2_display_state,

      lstm_create,
      gpt2_create,

    }
  }
}
</script>