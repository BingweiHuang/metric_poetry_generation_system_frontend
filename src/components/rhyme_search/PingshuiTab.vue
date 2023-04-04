<template>
  <!-- 声部 -->
  <el-space size="large" class="sheng" style="display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 20px; margin-bottom: 10px">
    <el-radio-group v-model="ps_sheng_select" size="small" @change="change_ps_sheng_select">
      <el-radio :label="'平声'" style="font-weight: bold; color: black"/>
      <el-radio :label="'上声'" style="font-weight: bold; color: black"/>
      <el-radio :label="'去声'" style="font-weight: bold; color: black"/>
      <el-radio :label="'入声'" style="font-weight: bold; color: black"/>
    </el-radio-group>
  </el-space>

  <!-- 韵部 -->
  <div class="yun" style="margin-bottom: 10px">
    <el-radio-group v-model="ps_yun_select" size="small" @change="change_ps_display">
              <span v-for="(value, index) in ps_yun_tag[ps_sheng_select]" :key="index + value" style="display: flex; align-items: baseline; justify-content: start">
                <el-radio :label="value" style="font-weight: bold; color: black"/>
              </span>
    </el-radio-group>
  </div>

  <!-- 字 -->
  <el-space wrap size="small" class="word" style="display: flex; align-items: baseline; justify-content: start" v-if="ps_display && ps_display.length > 0">
            <span v-for="(value, index) in (ps_display[0])" :key="index" style="display: flex; align-items: baseline; justify-content: start">
              <el-link type="primary" :underline="false" style="font-size: 18px;" @click="search_baidu(value[0])">{{value[0]}}</el-link>
              <span v-if="value[1] !== ''" class="detail">{{value[1]}}</span>
            </span>

    <span>
              <el-link :underline="false" style="color: #808080; font-size: 12px; margin: 0 5px" @click="ps_sp_word = true" v-if="ps_sp_word === false">其他生僻字</el-link>
              <el-link :underline="false" style="color: #808080; font-size: 12px; margin: 0 5px" @click="ps_sp_word = false" v-if="ps_sp_word === true">收起生僻字</el-link>
            </span>

    <template v-if="ps_sp_word === true">
              <span v-for="(value, index) in (ps_display[1])" :key="'sp' + index"
                    style="display: flex; align-items: baseline; justify-content: start">
                <el-link type="primary" :underline="false" style="font-size: 18px;" @click="search_baidu(value[0])">{{value[0]}}</el-link>
                <span v-if="value[1] !== ''" class="detail">{{value[1]}}</span>
              </span>
    </template>
  </el-space>

</template>

<script lang="ts">
import {ref, watch} from "vue";
import store from "@/store";

export default {
  name: "PingshuiTab",
  components: {},
  props: {
    activeName: {
      type: String,
      required: true,
    },
  },
  setup(props) {




    const ps_yun_tag = ref(
        {
          '平声': [
            "一东", "二冬", "三江", "四支", "五微", "六鱼", "七虞", "八齐", "九佳", "十灰", "十一真", "十二文", "十三元", "十四寒", "十五删",
            "一先", "二萧", "三肴", "四豪", "五歌", "六麻", "七阳", "八庚", "九青", "十蒸", "十一尤", "十二侵", "十三覃", "十四盐", "十五咸",
          ],
          '上声': [
            "一董", "二肿", "三讲", "四纸", "五尾", "六语", "七麌", "八荠", "九蟹", "十贿", "十一轸", "十二吻", "十三阮", "十四旱", "十五潸",
            "十六铣", "十七筱", "十八巧", "十九皓", "二十哿", "二十一马", "二十二养",  "二十三梗", "二十四迥", "二十五有", "二十六寝", "二十七感", "二十八琰", "二十九豏"
          ],
          '去声': [
            "一送", "二宋", "三绛", "四寘", "五未", "六御", "七遇", "八霁", "九泰", "十卦", "十一队", "十二震", "十三问", "十四愿", "十五翰",
            "十六谏", "十七霰", "十八啸", "十九效", "二十号", "二十一个", "二十二祃", "二十三漾", "二十四敬", "二十五径", "二十六宥", "二十七沁",
            "二十八勘", "二十九艳", "三十陷"
          ],
          '入声': [
            "一屋", "二沃", "三觉", "四质", "五物", "六月", "七曷", "八黠", "九屑", "十药", "十一陌", "十二锡", "十三职", "十四缉", "十五合",
            "十六叶", "十七洽"
          ],
        }
    )
    const ps_sheng_select = ref('平声')
    const ps_yun_select = ref()
    const ps_display = ref()
    const ps_sp_word = ref(false)

    watch(
        ()=>(props.activeName),
        (val,preVal)=>{
          if (val !== '平水韵') {
            ps_sp_word.value = false
          }
        },
        {
          immediate:true,
          deep:false,
        }
    )

    const change_ps_sheng_select = () => {
      ps_sp_word.value = false
      ps_display.value = []
      ps_yun_select.value = ''
    }

    const change_ps_display = async () => {

      ps_sp_word.value = false
      let kwargs = {
        sheng_tag: ps_sheng_select.value, yun_tag: ps_yun_select.value
      }
      const res = store.getters.get_pingshui(kwargs)
      if (res.length === 0) {
        // store.dispatch 是异步
        await store.dispatch("updateRhyme", {
          success() {
            ps_display.value = store.getters.get_pingshui(kwargs);

          },
          error() {

            console.log("getRhyme 失败");
          },
          kind: 1, ...kwargs
        })
      } else {
        ps_display.value = store.getters.get_pingshui(kwargs);
      }

    }

    const search_baidu = (word:string) => {
      let uri = 'https://hanyu.baidu.com/zici/s?wd=' + word

      window.open(uri) // 打开新页面跳转
      // location.href = uri

    }

    return {
      ps_yun_tag,
      ps_sheng_select,
      ps_yun_select,
      ps_display,
      ps_sp_word,

      change_ps_sheng_select,
      change_ps_display,
      search_baidu,
    }
  }
}
</script>

<style lang="scss" scoped>



</style>