<template>

  <el-row>
    <el-col :xl="2" :lg="2" :md="2" :sm="1" :xs="0"></el-col>

    <el-col :xl="20" :lg="20" :md="20" :sm="22" :xs="24">
      <!-- 标签页 -->
      <el-tabs type="border-card" @tab-change="tab_change">
        <!-- 平水韵 -->
        <el-tab-pane label="平水韵">

          <!-- 声部 -->
          <el-space size="large" class="yun" style="display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 20px; margin-bottom: 10px">
            <el-radio-group v-model="ps_sheng_select" size="small" @change="change_ps_sheng_select">
              <el-radio :label="'平声'" style="font-weight: bold; color: black"/>
              <el-radio :label="'上声'" style="font-weight: bold; color: black"/>
              <el-radio :label="'去声'" style="font-weight: bold; color: black"/>
              <el-radio :label="'入声'" style="font-weight: bold; color: black"/>
            </el-radio-group>
          </el-space>

          <!-- 韵部 -->
          <div class="yun" style="margin-bottom: 10px">
            <el-radio-group v-model="ps_yin_select" size="small" @change="change_ps_display">
              <span v-for="(value, index) in ps_yin_tag[ps_sheng_select]" :key="index + value" style="display: flex; align-items: baseline; justify-content: start">
                <el-radio :label="value" style="font-weight: bold; color: black"/>
              </span>
            </el-radio-group>
          </div>

          <!-- 字 -->
          <el-space wrap size="small" class="yun" style="display: flex; align-items: baseline; justify-content: start" v-if="ps_display && ps_display.length > 0">
            <span v-for="(value, index) in (ps_display[0])" :key="index" style="display: flex; align-items: baseline; justify-content: start">
              <el-link type="primary" :underline="false" style="font-size: 18px;" @click="search_baidu(value[0])">{{value[0]}}</el-link>
              <span v-if="value[1] !== ''" class="detail">{{value[1]}}</span>
            </span>

            <span>
              <el-link :underline="false" style="color: #808080; font-size: 12px; margin: 0 5px" @click="ps_display_sp_word" v-if="ps_sp_word === false">其他生僻字</el-link>
              <el-link :underline="false" style="color: #808080; font-size: 12px; margin: 0 5px" @click="ps_hide_sp_word" v-if="ps_sp_word === true">收起生僻字</el-link>
            </span>

            <template v-if="ps_sp_word === true">
              <span v-for="(value, index) in (ps_display[1])" :key="'sp' + index"
                    style="display: flex; align-items: baseline; justify-content: start">
                <el-link type="primary" :underline="false" style="font-size: 18px;" @click="search_baidu(value[0])">{{value[0]}}</el-link>
                <span v-if="value[1] !== ''" class="detail">{{value[1]}}</span>
              </span>
            </template>
          </el-space>

        </el-tab-pane>

        <!-- 中华新韵 -->
        <el-tab-pane label="中华新韵">

          <!-- 韵部 -->
          <div class="yun" style="margin-bottom: 10px">
            <el-radio-group v-model="xin_sheng_yin_select" size="small" @change="change_xin_display">
              <span v-for="(yun_tag, index) in xin_yin_tag" :key="index" style="display: flex; align-items: center">
                <el-radio :label="'平声' + yun_tag" style="font-weight: bold; color: black">{{yun_tag}}平</el-radio>
                <el-radio :label="'仄声' + yun_tag" style="font-weight: bold; color: black">{{yun_tag}}仄</el-radio>
              </span>
            </el-radio-group>
          </div>

          <!-- 字 -->
          <el-space wrap size="small" class="yun" style="display: flex; align-items: baseline; justify-content: start" v-if="xin_display && xin_display.length > 0">
            <span v-for="(value, index) in xin_display[0]" :key="'xin' + index + value[0]" style="display: flex; align-items: baseline; justify-content: start">
              <el-link type="primary" :underline="false" style="font-size: 18px;" @click="search_baidu(value[0])">{{value[0]}}</el-link>
            </span>

            <span>
              <el-link :underline="false" style="color: #808080; font-size: 12px; margin: 0 5px" @click="xin_display_sp_word" v-if="xin_sp_word === false">其他生僻字</el-link>
              <el-link :underline="false" style="color: #808080; font-size: 12px; margin: 0 5px" @click="xin_hide_sp_word" v-if="xin_sp_word === true">收起生僻字</el-link>
            </span>

            <template v-if="xin_sp_word === true">
              <span v-for="(value, index) in xin_display[1]" :key="'xin' + index + value[0] + 'sp'"
                    style="display: flex; align-items: baseline; justify-content: start">
                <el-link type="primary" :underline="false" style="font-size: 18px;" @click="search_baidu(value[0])">{{value[0]}}</el-link>
              </span>
            </template>

          </el-space>

        </el-tab-pane>

        <!-- 搜索 -->
        <el-tab-pane label="搜索">
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
            <el-col>
              <!-- 平水韵展示 -->
              <el-card shadow="never" style="margin-top: 15px; background-color: #F3F3F3" v-if="ps_word2rhyme && ps_word2rhyme.length > 0">
                <template v-for="(rhyme, index) in ps_word2rhyme" :key="index">

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
                      <el-link :underline="false" style="color: #808080; font-size: 12px; margin: 0 5px" @click="ps_display_sp_word" v-if="ps_sp_word === false">其他生僻字</el-link>
                      <el-link :underline="false" style="color: #808080; font-size: 12px; margin: 0 5px" @click="ps_hide_sp_word" v-if="ps_sp_word === true">收起生僻字</el-link>
                    </span>
                    <template v-if="ps_sp_word === true">
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
              </el-card>

              <!-- 中华新韵展示 -->
              <el-card shadow="never" style="margin-top: 15px; background-color: #F3F3F3" v-if="xin_word2rhyme && xin_word2rhyme.length > 0">
                <template v-for="(rhyme, index) in xin_word2rhyme" :key="index">

                  <div style="font-size: 18px; font-weight: bold; text-align: center; margin-top: 10px">中华新韵&nbsp;{{rhyme[1]}}{{rhyme[0]}}</div>
                  <el-space wrap size="small" class="yun" style="display: flex; align-items: baseline; justify-content: start" v-if="rhyme[2] && rhyme[2].length > 0">
                    <span v-for="(value, index) in (rhyme[2][0])" :key="index" style="display: flex; align-items: baseline; justify-content: start">

                      <template v-if="searched_word === value[0]">
                        <el-link type="primary" :underline="false" style="font-size: 18px; border: 2px solid green;" @click="search_baidu(value[0])">{{value[0]}}</el-link>
                      </template>
                      <template v-else>
                        <el-link type="primary" :underline="false" style="font-size: 18px; " @click="search_baidu(value[0])">{{value[0]}}</el-link>
                      </template>

                      <span v-if="value[1] !== ''" class="detail">{{value[1]}}</span>
                    </span>

                    <span>
                      <el-link :underline="false" style="color: #808080; font-size: 12px; margin: 0 5px" @click="xin_display_sp_word" v-if="xin_sp_word === false">其他生僻字</el-link>
                      <el-link :underline="false" style="color: #808080; font-size: 12px; margin: 0 5px" @click="xin_hide_sp_word" v-if="xin_sp_word === true">收起生僻字</el-link>
                    </span>
                    <template v-if="xin_sp_word === true">
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
              </el-card>
            </el-col>
          </el-row>

        </el-tab-pane>

      </el-tabs>
    </el-col>

    <el-col :xl="2" :lg="2" :md="2" :sm="1" :xs="0"></el-col>
  </el-row>

</template>

<script lang="ts">
import {instance} from "@/utils/utils";
import {onMounted, ref} from "vue";
import {useStore} from "vuex";

import {
  Search,
} from '@element-plus/icons-vue'
import {ElMessage} from "element-plus";
import {Get} from "@/utils/request";
import store from "@/store";

export default {
  name: "RhymeSearchView",
  components: {},
  setup() {
    const xinyun2word = ref()
    const xin_yin_tag = ref(
        ['一麻', '二波', '三皆', '四开', '五微', '六豪', '七尤',
          '八寒', '九文', '十唐', '十一庚', '十二齐', '十三支', '十四姑']
    )

    const xin_sheng_yin_select = ref()
    let xin_display = ref()
    let xin_sp_word = ref(false)

    const xin_display_sp_word = () => {
      xin_sp_word.value = true
    }

    const xin_hide_sp_word = () => {
      xin_sp_word.value = false
    }

    const change_xin_display = () => {
      xin_sp_word.value = false
      let sheng_tag = xin_sheng_yin_select.value.substring(0, 2)
      let yun_tag = xin_sheng_yin_select.value.substring(2)
      xin_display.value = xinyun2word.value[sheng_tag][yun_tag]
    }



    const pingshui2word = ref()
    const ps_yin_tag = ref(
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
    const ps_yin_select = ref()
    let ps_display = ref()
    let ps_sp_word = ref(false)
    const ps_display_sp_word = () => {
      ps_sp_word.value = true
    }

    const ps_hide_sp_word = () => {
      ps_sp_word.value = false
    }

    const change_ps_sheng_select = () => {
      ps_sp_word.value = false
      ps_display.value = []
      ps_yin_select.value = ''
    }

    const change_ps_display = () => {
      
      ps_sp_word.value = false
      ps_display.value = pingshui2word.value[ps_sheng_select.value][ps_yin_select.value]


    }



    const search_baidu = (word:string) => {
      let uri = 'https://hanyu.baidu.com/zici/s?wd=' + word

      window.open(uri) // 打开新页面跳转
      // location.href = uri

    }

    const tab_change = () => {
      xin_sp_word.value = false
      ps_sp_word.value = false
    }


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

        Get('rhyme/search_rhyme/', {
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


    onMounted(async () => {
      if (Object.keys(store.getters.get_xinyun).length === 0 ||
          Object.keys(store.getters.get_pingshui).length === 0) {

        // store.dispatch 是异步
        await store.dispatch("updateAllRhyme", {
          success() {
            // xinyun2word.value = store.state.rhyme.xinyun2word;
            xinyun2word.value = store.getters.get_xinyun;
            // pingshui2word.value = store.state.rhyme.pingshui2word;
            pingshui2word.value = store.getters.get_pingshui;
          },
          error() {
            console.log("selectRhyme 失败");
          }
        })
      } else {
        xinyun2word.value = store.getters.get_xinyun;
        pingshui2word.value = store.getters.get_pingshui;
      }
    })


    return {
      xinyun2word,
      xin_yin_tag,
      xin_sheng_yin_select,
      xin_display,
      xin_sp_word,

      pingshui2word,
      ps_yin_tag,
      ps_sheng_select,
      ps_yin_select,
      ps_display,
      ps_sp_word,

      Search,
      word_input,
      searched_word,
      ps_word2rhyme,
      xin_word2rhyme,


      search_baidu,
      change_xin_display,
      xin_display_sp_word,
      xin_hide_sp_word,

      change_ps_sheng_select,
      change_ps_display,
      ps_display_sp_word,
      ps_hide_sp_word,


      tab_change,
      rhyme_search,
    }
  }
}
</script>

<style lang="scss">
.yun .el-radio__input {
  display: none !important;
}
.yun .el-radio__label {
  font-size: 16px !important;
}
.yun .el-radio {
  margin-right: 10px !important;
}
.yun .el-space__item {
  padding-bottom: 3px !important;
  margin-right: 2px !important;
}

.detail {
  font-size: 10px !important;
  color: #A4265F !important;
  margin-right: 2px;
}
</style>