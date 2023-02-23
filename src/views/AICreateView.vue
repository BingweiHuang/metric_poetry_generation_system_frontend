<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <div style="text-align: center; width: 100%">LSTM</div>
        <div style="text-align: center; width: 100%">GPT2</div>
<!--        <el-button class="button" text>Operation button</el-button>-->
      </div>
      <div class="card_intro">
        <div style="text-align: center; width: 100%">我是一个无情的作诗机器~</div>
        <div style="text-align: center; width: 100%">我是一个无情但有素的作诗机器~</div>
      </div>
    </template>
<!--    <div v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</div>-->

    <div class="card-body">

      <el-card class="box-card mx-card" shadow="never" v-loading="lstm_loading">
        <div v-if="lstm_display_state === 0">
          我很C，来试试看吧
        </div>
        <div v-else-if="lstm_display_state === 1">

        </div>
        <div v-else-if="lstm_display_state === 2">
          <div v-for="(poem, index) in lstmCreateList" :key="index">
            <div v-if="poem[0] === 0">没有限制用韵</div>
            <div v-else>{{poem[0] === 1 ? '平水韵' : '中华新韵'}} : {{poem[1]}}</div>
            <div v-for="(sen, index2) in poem[2]" :key="index-index2">{{sen}}</div>
          </div>
        </div>
      </el-card>

      <el-card class="box-card mx-card" shadow="never" v-loading="gpt2_loading">
        <div v-if="gpt2_display_state === 0">
          我很C，来试试看吧
        </div>
        <div v-else-if="gpt2_display_state === 1">

        </div>
        <div v-else-if="gpt2_display_state === 2">
          <div v-for="(poem, index) in gpt2CreateList" :key="index">
            <div v-if="poem[0] === 0">没有限制用韵</div>
            <div v-else>{{poem[0] === 1 ? '平水韵' : '中华新韵'}} : {{poem[1]}}</div>
            <div v-for="(sen, index2) in poem[2]" :key="index-index2">{{sen}}</div>
          </div>
        </div>
      </el-card>

    </div>

    <div class="card-body">

      <el-card class="box-card " shadow="never">

        <el-space wrap style="">
          <el-switch v-model="yan" size="large" inline-prompt style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" active-text="七言" inactive-text="五言"/>
          <el-switch v-model="jue" size="large" inline-prompt style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" active-text="绝句" inactive-text="律句"/>
          <el-switch v-model="ru" size="large" inline-prompt active-text="入韵" inactive-text="不入"/>
          <el-switch v-model="qi" size="large" inline-prompt style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" active-text="平起" inactive-text="仄起"/>
          <el-select v-model="use_rhyme" class="m-2" placeholder="选韵表" style="width: 100px">
            <el-option :key="0" :label="'不押韵'" :value="0"/>
            <el-option :key="1" :label="'平水韵'" :value="1"/>
            <el-option :key="2" :label="'中华新韵'" :value="2"/>
          </el-select>
          <el-select v-model="style" class="m-2" placeholder="生成方式" style="width: 100px">
            <el-option :key="0" :label="'单字续写'" :value="0"/>
            <el-option :key="1" :label="'首句续写'" :value="1"/>
            <el-option :key="2" :label="'藏头绝句'" :value="2"/>
          </el-select>
          <el-input style="width: 150px" v-model="text" placeholder="请输入text" clearable />
          <el-button type="primary" id="lstm_create_button" @click="lstm_create" :loading="lstm_loading">{{lstm_button_state}}</el-button>
          <el-button type="success" v-if="lstm_display_state === 2">存入我的诗库</el-button>
        </el-space>

      </el-card>
      <el-card class="box-card" shadow="never">

        <el-space wrap>
          <el-switch v-model="yan2" size="large" inline-prompt style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" active-text="七言" inactive-text="五言"/>
          <el-switch v-model="jue2" size="large" inline-prompt style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" active-text="绝句" inactive-text="律句"/>
          <el-switch v-model="ru2" size="large" inline-prompt active-text="入韵" inactive-text="不入"/>
          <el-switch v-model="qi2" size="large" inline-prompt style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" active-text="平起" inactive-text="仄起"/>
          <el-select v-model="use_rhyme2" class="m-2" placeholder="选韵表" style="width: 100px">
            <el-option :key="0" :label="'不押韵'" :value="0"/>
            <el-option :key="1" :label="'平水韵'" :value="1"/>
            <el-option :key="2" :label="'中华新韵'" :value="2"/>
          </el-select>
          <el-select v-model="style2" class="m-2" placeholder="生成方式" style="width: 100px">
            <el-option :key="0" :label="'单字续写'" :value="0"/>
            <el-option :key="1" :label="'首句续写'" :value="1"/>
            <el-option :key="2" :label="'藏头绝句'" :value="2"/>
          </el-select>
          <el-input style="width: 150px" v-model="text2" placeholder="请输入text" clearable />
          <el-button type="primary" id="gpt2_create_button" @click="gpt2_create" :loading="gpt2_loading" >{{gpt2_button_state}}</el-button>
          <el-button type="success" v-if="gpt2_display_state === 2">存入我的诗库</el-button>
        </el-space>

      </el-card>
    </div>
  </el-card>
</template>

<style lang="scss" scoped>
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
  font-size: 10px;
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
  height: 200px;
}
.mx-card div {
  margin: 10px auto;
  width: 100%;
  text-align: center;
}

</style>


<script lang="ts">
import { ref } from 'vue';
import {instance} from "@/utils/utils";

export default {
  name: "AICreateView",
  components: {},
  setup() {
    const text = ref('春')
    const yan = ref(7)
    const jue = ref(0)
    const qi = ref(1)
    const ru = ref(0)
    const use_rhyme = ref(1)
    const style = ref(0)
    const lstmCreateList = ref([])
    const lstm_loading = ref(false)
    const lstm_button_state = ref('开始作诗')
    const lstm_display_state = ref(0)

    const text2 = ref('春')
    const yan2 = ref(7)
    const jue2 = ref(0)
    const qi2 = ref(1)
    const ru2 = ref(0)
    const use_rhyme2 = ref(1)
    const style2 = ref(0)
    const gpt2CreateList = ref([])
    const gpt2_loading = ref(false)
    const gpt2_button_state = ref('开始作诗')
    const gpt2_display_state = ref(0)

    const is_valid = (text:string, style:number, yan:number) => {
      let txt = text.length
      let len = yan ? 7 : 5
      if (style === 0 && txt === 1) return true
      else if (style === 1 && txt === len) return true
      else if (style === 2 && txt === 4) return true
      return false
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

    const lstm_create = () => {
      if (!is_valid(text.value, style.value, yan.value)) {
        console.log('输入字数不正确！')
        return false
      }

      // const lstm_create_button = document.getElementById('lstm_create_button') as HTMLInputElement;
      lstm_change_state(1)
      instance({
        url:'create/lstm',
        method:'get',
        headers: {
          // 'Authorization': "Bearer " + store.state.user.access,
        },
        params: {
          text: text.value,
          yan: yan.value ? 7 : 5,
          jue: jue.value ? 0 : 1,
          qi: qi.value ? 1 : 0,
          ru: ru.value ? 0 : 1,
          use_rhyme: use_rhyme.value,
          style: style.value,
        },
      })
      .then((resp) => {
        lstm_change_state(2)
        console.log(resp.data);
        lstmCreateList.value = resp.data.createList;
      })
      .catch((error) => {
        lstm_change_state(2)
        console.log(error);
      })
      console.log('完毕');
    };

    const gpt2_create = () => {
      if (!is_valid(text2.value, style2.value, yan2.value)) {
        console.log('输入字数不正确！')
        return false
      }
      gpt2_change_state(1)
      instance({
        url:'create/gpt2',
        method:'get',
        headers: {
          // 'Authorization': "Bearer " + store.state.user.access,
        },
        params: {
          text: text2.value,
          yan: yan2.value ? 7 : 5,
          jue: jue2.value ? 0 : 1,
          qi: qi2.value ? 1 : 0,
          ru: ru2.value ? 0 : 1,
          use_rhyme: use_rhyme2.value,
          style: style2.value,
        },
      })
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