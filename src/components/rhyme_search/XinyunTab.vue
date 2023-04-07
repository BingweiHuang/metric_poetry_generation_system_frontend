<template>
  <!-- 韵部 -->
  <div class="yun" style="margin-bottom: 10px">
    <el-radio-group v-model="xin_sheng_yun_select" size="small" @change="change_xin_display">
              <span v-for="(yun_tag, index) in xin_yun_tag" :key="index" style="display: flex; align-items: center">
                <el-radio :label="'平声' + yun_tag" style="font-weight: bold; color: black">{{yun_tag}}平</el-radio>
                <el-radio :label="'仄声' + yun_tag" style="font-weight: bold; color: black">{{yun_tag}}仄</el-radio>
              </span>
    </el-radio-group>
  </div>

  <!-- 字 -->
  <el-space wrap size="small" class="word" style="display: flex; align-items: baseline; justify-content: start" v-if="xin_display && xin_display.length > 0">
            <span v-for="(value, index) in xin_display[0]" :key="'xin' + index + value[0]" style="display: flex; align-items: baseline; justify-content: start">
              <el-link type="primary" :underline="false" style="font-size: 18px;" @click="search_baidu(value[0])">{{value[0]}}</el-link>
            </span>

    <span>
              <el-link :underline="false" style="color: #808080; font-size: 12px; margin: 0 5px" @click="xin_sp_word = true" v-if="xin_sp_word === false">其他生僻字</el-link>
              <el-link :underline="false" style="color: #808080; font-size: 12px; margin: 0 5px" @click="xin_sp_word = false" v-if="xin_sp_word === true">收起生僻字</el-link>
            </span>

    <template v-if="xin_sp_word === true">
              <span v-for="(value, index) in xin_display[1]" :key="'xin' + index + value[0] + 'sp'"
                    style="display: flex; align-items: baseline; justify-content: start">
                <el-link type="primary" :underline="false" style="font-size: 18px;" @click="search_baidu(value[0])">{{value[0]}}</el-link>
              </span>
    </template>

  </el-space>
</template>

<script lang="ts">
import {ref, watch} from "vue";
import store from "@/store";

export default {
  name: "XinyunTab",
  components: {},
  props: {
    activeName: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const xin_yun_tag = ref(
        ['一麻', '二波', '三皆', '四开', '五微', '六豪', '七尤',
          '八寒', '九文', '十唐', '十一庚', '十二齐', '十三支', '十四姑']
    )
    const xin_sheng_yun_select = ref()
    let xin_display = ref()
    let xin_sp_word = ref(false)
    watch(
        ()=>(props.activeName),
        (val,preVal)=>{
          if (val !== '中华新韵') {
            xin_sp_word.value = false
          }
        },
        {
          immediate:true,
          deep:false,
        }
    )

    const change_xin_display = async () => {
      xin_sp_word.value = false

      let sheng_tag = xin_sheng_yun_select.value.substring(0, 2)
      let yun_tag = xin_sheng_yun_select.value.substring(2)
      let kwargs = {
        sheng_tag: sheng_tag, yun_tag: yun_tag
      }
      const res = store.getters.get_xinyun(kwargs)
      if (res.length === 0) {
        // store.dispatch 是异步
        await store.dispatch("updateRhyme", {
          success() {
            xin_display.value = store.getters.get_xinyun(kwargs);
          },
          error() {
            console.log("获取韵表失败");
          },
          kind: 2, ...kwargs
        })
      } else {
        xin_display.value = store.getters.get_xinyun(kwargs);
      }
    }

    const search_baidu = (word:string) => {
      let uri = 'https://hanyu.baidu.com/zici/s?wd=' + word

      window.open(uri) // 打开新页面跳转
      // location.href = uri

    }
    return {
      xin_yun_tag,
      xin_sheng_yun_select,
      xin_display,
      xin_sp_word,

      change_xin_display,
      search_baidu,

    }
  }
}
</script>

<style lang="scss" scoped>

</style>