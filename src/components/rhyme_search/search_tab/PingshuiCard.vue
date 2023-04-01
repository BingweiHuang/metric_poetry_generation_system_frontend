<template>
  <div style="font-size: 18px; font-weight: bold; text-align: center; margin-top: 10px">平水韵&nbsp;{{rhyme[1]}}{{rhyme[0]}}</div>
  <el-space wrap size="small" class="yun" style="display: flex; align-items: baseline; justify-content: start" v-if="rhyme[2] && rhyme[2].length > 0">
                    <span v-for="(value, index) in (rhyme[2][0])" :key="index"
                          style="display: flex; align-items: baseline; justify-content: start">

                      <template v-if="searched_word === value[0]">
                        <el-link type="primary" :underline="false" style="font-size: 18px; border: 2px solid green;" @click="search_baidu(value[0])">{{value[0]}}</el-link>
                      </template>
                      <template v-else>
                        <el-link type="primary" :underline="false" style="font-size: 18px; " @click="search_baidu(value[0])">{{value[0]}}</el-link>
                      </template>

                      <span v-if="value[1] !== ''" class="detail">{{value[1]}}</span>
                    </span>

    <span>
                      <el-link :underline="false" style="color: #808080; font-size: 12px; margin: 0 5px" @click="ps_sp_word = true" v-if="ps_sp_word === false">其他生僻字</el-link>
                      <el-link :underline="false" style="color: #808080; font-size: 12px; margin: 0 5px" @click="ps_sp_word = false" v-if="ps_sp_word === true">收起生僻字</el-link>
                    </span>
    <template v-if="ps_sp_word">
                      <span v-for="(value, index) in (rhyme[2][1])" :key="'sp' + index"
                            style="display: flex; align-items: baseline; justify-content: start">

                        <template v-if="searched_word === value[0]">
                          <el-link type="primary" :underline="false" style="font-size: 18px; border: 2px solid green;" @click="search_baidu(value[0])">{{value[0]}}</el-link>
                        </template>
                        <template v-else>
                          <el-link type="primary" :underline="false" style="font-size: 18px; " @click="search_baidu(value[0])">{{value[0]}}</el-link>
                        </template>

                        <span v-if="value[1] !== ''" class="detail">{{value[1]}}</span>
                      </span>
    </template>
  </el-space>

</template>

<script lang="ts">
import {ref, watch} from "vue";

export default {
  name: "PingshuiCard",
  components: {},
  props: {
    activeName: {
      type: String,
      required: true,
    },
    rhyme: {
      type: Array,
      required: true,
    },
    searched_word: {
      type: String,
      required: true,
    },
  },
  setup(props) {

    const ps_sp_word = ref(false)

    watch(
        ()=>(props.activeName),
        (val,preVal)=>{
          if (val !== '搜索') {
            ps_sp_word.value = false
          }
        },
        {
          immediate:true,
          deep:false,
        }
    )

    const search_baidu = (word:string) => {
      let uri = 'https://hanyu.baidu.com/zici/s?wd=' + word

      window.open(uri) // 打开新页面跳转
      // location.href = uri

    }

    return {
      ps_sp_word,

      search_baidu,

    }
  }
}
</script>

<style lang="scss" scoped>

</style>