<template>
  <!-- 搜索输入栏 -->
  <el-row justify="center" align="middle" :gutter="0">
    <el-col :xl="8" :lg="8" :md="10" :sm="12" :xs="12">
      <el-input size="large" v-model="word_input" placeholder="请输入需要查的字" clearable></el-input>
    </el-col>

    <el-col :span="2">
      <el-button size="large" :icon="Search" @click="rhyme_search" />
    </el-col>

  </el-row>

  <!-- 搜索展示栏 -->
  <el-row>
    <el-col class="my">
      <!-- 平水韵展示 -->
      <!-- background-color: #F3F3F3 -->
      <el-card shadow="never" style="margin-top: 15px;"  v-if="ps_word2rhyme && ps_word2rhyme.length > 0">
        <template v-for="(rhyme, index) in ps_word2rhyme" :key="index">

          <PingshuiCard :rhyme="rhyme" :searched_word="searched_word" :activeName="activeName"/>

        </template>
      </el-card>

      <!-- 中华新韵展示 -->
      <el-card shadow="never" style="margin-top: 15px;" v-if="xin_word2rhyme && xin_word2rhyme.length > 0">
        <template v-for="(rhyme, index) in xin_word2rhyme" :key="index">

          <XinyunCard :rhyme="rhyme" :searched_word="searched_word" :activeName="activeName"/>

        </template>
      </el-card>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import {ref} from "vue";
import {ElMessage} from "element-plus";
import {Get, system_base_url} from "@/utils/request";

import {
  Search,
} from '@element-plus/icons-vue';
import PingshuiCard from "@/components/rhyme_search/search_tab/PingshuiCard.vue";
import XinyunCard from "@/components/rhyme_search/search_tab/XinyunCard.vue";

export default {
  name: "SearchTab",
  components: {
    PingshuiCard,
    XinyunCard,
  },
  props: {
    activeName: {
      type: String,
      required: true,
    },
  },
  setup() {

    const word_input = ref('')
    const searched_word = ref('')
    const ps_word2rhyme = ref()
    const xin_word2rhyme = ref()

    const reserved_chinese_word = (text:string) => {
      if (text === '') return '';
      let regEx = /[^\u4e00-\u9fa5\uf900-\ufa2d]/g;
      return text.replace(regEx, '');
    }

    const rhyme_search = () => {
      let word = reserved_chinese_word(word_input.value)
      if (word.length !== 1) {
        ElMessage({
          showClose: true,
          message: '请输入一个汉字。',
          type: 'error',
          duration: 3000,
        })
        return false
      } else {
        searched_word.value = word

        Get(system_base_url + 'rhyme/search_rhyme/', {
          'word': word,
        }, false)
            .then((resp) => {
              ps_word2rhyme.value = resp.data.ps_word2rhyme;
              xin_word2rhyme.value = resp.data.xin_word2rhyme;

            })
            .catch((error) => {
              console.log(error);
            })
      }
    }

    const search_baidu = (word:string) => {
      let uri = 'https://hanyu.baidu.com/zici/s?wd=' + word

      window.open(uri) // 打开新页面跳转
      // location.href = uri

    }

    return {
      Search,

      word_input,
      searched_word,
      ps_word2rhyme,
      xin_word2rhyme,

      rhyme_search,
      search_baidu,
    }
  }
}
</script>

<style lang="scss" scoped>
.my .el-card {
  border: none;
  background: none;
}
</style>