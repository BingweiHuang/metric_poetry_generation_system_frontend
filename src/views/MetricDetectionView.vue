<template>

  <el-row>
    <el-col :xl="5" :lg="4" :md="2" :sm="1" :xs="0"></el-col>
    <el-col :xl="14" :lg="16" :md="20" :sm="22" :xs="24">

      <!-- 规则-作品栏 -->
      <div class="my">
        <el-card >

          <!-- 头部 -->
          <el-row style="margin-top: 5px">
            <el-col :span="11">
              <div style="text-align: center; font-size: 18px; font-weight: bold">规则</div>
            </el-col>

            <el-col :span="13">
              <div style="text-align: center; font-size: 18px; font-weight: bold">{{detect_text === '' ? '例子' : '作品'}}</div>
            </el-col>

          </el-row>

          <!-- 身体 -->
          <el-row style="font-size: 20px; height: 220px">
            <!-- 平仄规则展示 -->
            <el-col :span="11" style="text-align: center;">
              <div v-for="(tone_sen, index1) in tones.split('/')" :key="index1">
              <span v-for="(tone, index2) in tone_sen" :key="index1-index2">
                <span v-if="tone === '0' && index2 === (yan ? 7 : 5) - 1">
                  <span style="color: #EA3323">平</span>
                </span>
                <span v-else-if="tone === '0'">
                  <span style="color: black">平</span>
                </span>
                <span v-else-if="tone === '1'">
                  <span style="color: black">仄</span>
                </span>
                <span v-else-if="tone === 'x'">
                  <span style="color: #AAAAAA">平</span>
                </span>
                <span v-else-if="tone === 'y'">
                  <span style="color: #AAAAAA">仄</span>
                </span>
              </span>
                <span>{{(index1 % 2) === 1 ? '。' : '，'}}</span>
              </div>
            </el-col>


            <el-col :span="13">
              <!-- 格律诗例子 -->
              <div style="font-size: 20px; text-align: center" v-if="detect_text === ''">
                <div v-for="(sen, index) in example_poetry" :key="index">
                  {{sen}}
                </div>
                <!--              <div>剑外忽传收蓟北</div>
                              <div>初闻涕泪满衣裳</div>
                              <div>却看妻子愁何在</div>
                              <div>漫卷诗书喜欲狂</div>
                              <div>白日放歌须纵酒</div>
                              <div>青春作伴好还乡</div>
                              <div>即从巴峡穿巫峡</div>
                              <div>便下襄阳向洛阳</div>-->
              </div >

              <!-- 检测的作品 -->
              <el-space  style="align-items: start;">
                <div style="font-size: 20px; width: 400px">
                  <div v-for="jue_id in jue_list" :key="jue_id">
                  <span v-for="yan_id in yan_list" :key="yan_id">

                    <!--如果该字有平仄错误-->
                    <span v-if="(jue_id * (detect_yan ? 7 : 5) + yan_id) in pz_err_dict">

                      <!--应为仄-->
                      <span v-if="pz_err_dict[jue_id * (detect_yan ? 7 : 5) + yan_id] === 1" style="color: red">{{detect_text[jue_id * (detect_yan ? 7 : 5) + yan_id]}}
                      </span>

                      <!--应为平-->
                      <span v-else style="color: blue">{{detect_text[jue_id * (detect_yan ? 7 : 5) + yan_id]}}
                      </span>
                    </span>

                    <!--该字是平仄多音字-->
                    <span v-else-if="duo_yin_pos.includes(jue_id * (detect_yan ? 7 : 5) + yan_id)" style="font-weight: bold">{{detect_text[jue_id * (detect_yan ? 7 : 5) + yan_id]}}
                    </span>

                    <!--没什么特殊，那就黑色-->
                    <span v-else>{{detect_text[jue_id * (detect_yan ? 7 : 5) + yan_id]}}
                    </span>

                    <!--如果该字是韵脚-->
                    <span v-if="(jue_id * (detect_yan ? 7 : 5) + yan_id) in yun_pos_dict">
                      <span>&nbsp;[</span>
                      <span style="color: #EA3323">
                        {{yun_pos_dict[jue_id * (detect_yan ? 7 : 5) + yan_id][0]}}
                      </span>
                      <span v-for="(yun, index) in yun_pos_dict[jue_id * (detect_yan ? 7 : 5) + yan_id].slice(1)" :key="index">,
                        <span style="color: #EA3323">
                          {{yun}}
                        </span>
                      </span>
                      <span>]</span>
                    </span>
                  </span>
                  </div>
                </div>

              </el-space>
            </el-col>

          </el-row>

          <!-- 输入作品栏   -->
          <el-row>
            <el-col>
              <!-- 输入框 -->
              <el-row justify="center" align="middle">
                <el-col :span="20">
                  <el-input style=" font-size: 18px; margin-right:20px"
                            type="textarea" :autosize="{ minRows: 5, maxRows: 5 }"
                            v-model="text" placeholder="不用管换行">
                  </el-input>
                </el-col>
              </el-row>

              <!-- 选择格律诗种类 -->
              <el-row justify="center" align="middle" :gutter="30">
                <el-col :span="5">
                  <el-switch v-model="yan" size="large" inline-prompt
                             style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                             active-text="七言" inactive-text="五言" @change="metric_type_change"/>
                </el-col>
                <el-col :span="5">
                  <el-switch v-model="jue" size="large" inline-prompt
                             style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                             active-text="绝句" inactive-text="律句" @change="metric_type_change"/>
                </el-col>
                <el-col :span="5">
                  <el-switch v-model="qi" size="large" inline-prompt
                             style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                             active-text="平起" inactive-text="仄起" @change="metric_type_change"/>
                </el-col>
                <el-col :span="5">
                  <el-tooltip content="首句是否押(入)韵" placement="top">
                    <el-switch v-model="ru" size="large" inline-prompt
                               active-text="入韵" inactive-text="不入" @change="metric_type_change"/>
                  </el-tooltip>
                </el-col>
              </el-row>
              <el-row justify="center" align="middle" :gutter="30">
                <el-col :span="9">
                  <el-select v-model="use_rhyme" class="m-2" placeholder="选韵表" style="width: 100px">
                    <el-option :key="1" :label="'平水韵'" :value="1"/>
                    <el-option :key="2" :label="'中华新韵'" :value="2"/>
                  </el-select>
                </el-col>
                <el-col :span="7">
                  <el-button type="primary" id="lstm_create_button" @click="metric_detection">开始检测</el-button>
                </el-col>

                <el-col :span="4">
                  <el-button link @click="clear_input">清空</el-button>
                </el-col>


              </el-row>
            </el-col>
          </el-row >

          <!-- 检测结果展示栏 -->
          <div v-show="detect_text">
            <div style="display: flex; justify-content: center">
              <h3 style="margin: 0">检测结果 · {{detect_use_rhyme === 1 ? '平水韵' : '中华新韵'}}</h3>
            </div>

            <div style="display: flex; justify-content: center; margin-top: 5px">
          <span v-if="rhyme_foot === ''">
            押韵存在问题。
          </span>
              <span v-if="pz_err_dict && Object.keys(pz_err_dict).length">
            平仄存在{{Object.keys(pz_err_dict).length}}个问题：
          </span>
              <span v-if="rhyme_foot !== '' && Object.keys(pz_err_dict).length === 0">
            平仄押韵都符合规则，押韵:<span style="color: #EA3323">{{rhyme_foot}}</span>
          </span>
            </div>

            <div style="display: flex; justify-content: center; margin-top: 5px">
              <el-space wrap style="display: flex; justify-content: center;">

                <div v-for="(value,key) in pz_err_dict" :key="key">第{{key}}字
                  <span v-if="value === 1" style="color: red">
                {{detect_text[key]}}
              </span>

                  <span v-else style="color: blue">
                {{detect_text[key]}}
              </span>应{{value === 1 ? '仄' : '平'}}&nbsp;
                </div>

              </el-space>
            </div>

            <div style="width: 100%; justify-content: center; display: flex; margin-top: 5px" v-if="duo_yin_pos.length">
              多音字：
              <span v-for="duo_id in duo_yin_pos" :key="duo_id" style="font-weight: bold">
            {{detect_text[duo_id]}}&nbsp;
          </span>
              ，请根据词意判断平仄。
            </div>

            <div style="width: 100%; text-align: center; font-size: 16px; margin-top: 5px; color: darkorange" v-if="Object.keys(pz_err_dict).length === 0 && rhyme_foot !== ''">{{arr[arr_idx]}}</div>
          </div>

          <el-card style="width: 100%; margin-top: 20px" shadow="never" v-show="detect_text">



          </el-card>

        </el-card>
      </div>

      <!-- 打开韵表 和 说明 -->
      <el-card style="--el-card-padding: 20px; margin: 10px 0">
        <div style="width: 100%; justify-content: center; display: flex; margin-bottom: 10px">
          <div style="font-size: 14px; color: #99a9bf">
            说明：本系统只提供标准句式的检测。特殊句式、拗救、可变通处请自行判断。
          </div>
        </div>

        <div style="width: 100%; justify-content: center; display: flex; ">
          <el-button type="primary" @click="open_rhyme_table" v-if="!rhyme_table_show">打开韵表</el-button>
          <el-button type="primary" @click="close_rhyme_table" v-else>关闭韵表</el-button>
        </div>
      </el-card>

      <!-- 韵表 -->
      <template v-if="rhyme_table_show">
        <el-tabs type="border-card" @tab-change="tab_change">
          <el-tab-pane label="平水韵">

            <el-space size="large" class="yun" style="display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 20px; margin-bottom: 10px">
              <el-radio-group v-model="ps_sheng_select" size="small" @change="change_ps_sheng_select">
                <el-radio :label="'平声'" style="font-weight: bold; color: black"/>
                <el-radio :label="'上声'" style="font-weight: bold; color: black"/>
                <el-radio :label="'去声'" style="font-weight: bold; color: black"/>
                <el-radio :label="'入声'" style="font-weight: bold; color: black"/>
              </el-radio-group>
            </el-space>

            <div class="yun" style="margin-bottom: 10px">
              <el-radio-group v-model="ps_yin_select" size="small" @change="change_ps_display">
              <span v-for="(value, index) in ps_yin_tag[ps_sheng_select]" :key="index + value" style="display: flex; align-items: baseline; justify-content: start">
                <el-radio :label="value" style="font-weight: bold; color: black"/>
              </span>
              </el-radio-group>
            </div>

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

          <el-tab-pane label="中华新韵">

            <div class="yun" style="margin-bottom: 10px">
              <el-radio-group v-model="xin_sheng_yin_select" size="small" @change="change_xin_display">
              <span v-for="(yun_tag, index) in xin_yin_tag" :key="index" style="display: flex; align-items: center">
                <el-radio :label="'平声' + yun_tag" style="font-weight: bold; color: black">{{yun_tag}}平</el-radio>
                <el-radio :label="'仄声' + yun_tag" style="font-weight: bold; color: black">{{yun_tag}}仄</el-radio>
              </span>
              </el-radio-group>
            </div>


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

          <el-tab-pane label="搜索">
            <el-row justify="center" align="middle" :gutter="0">
              <el-col :xl="8" :lg="8" :md="10" :sm="12" :xs="12">
                <el-input size="large" v-model="word_input" placeholder="请输入需要查的字" clearable></el-input>
              </el-col>

              <el-col :span="2">
                <el-button size="large" :icon="Search" @click="rhyme_search" />
              </el-col>

            </el-row>

            <el-row>
              <el-col>
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
      </template>

    </el-col>
    <el-col :xl="5" :lg="4" :md="2" :sm="1" :xs="0"></el-col>
  </el-row>

</template>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 10px;
}

.my .el-card {
  --el-card-padding: 0px;
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

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}



.mx-card {
  height: 220px;
}
.mx-card div {
  margin: 10px auto;
  width: 100%;
  text-align: center;
}
.ai_create_poetry {
  font-family: '华文楷体';
  font-size: 20px;
}

</style>

<script lang="ts">
import {ref} from "vue";
import {instance} from "@/utils/utils";
import {ElMessage, ElMessageBox} from "element-plus";
import {
  Search,
} from '@element-plus/icons-vue'
import {useStore} from "vuex";
import {Get} from "@/utils/request";
import store from "@/store";
export default {
  name: "MetricDetectionView",
  components: {},
  setup() {

    const text = ref('')
    const detect_text = ref('')
    const yan = ref(true)
    const detect_yan = ref(true)
    const jue = ref(true)
    const detect_jue = ref(true)
    const qi = ref(true)
    const detect_qi = ref(true)
    const ru = ref(true)
    const detect_ru = ref(true)
    const use_rhyme = ref(1)
    const detect_use_rhyme = ref(1)

    const yan_list = ref()
    const jue_list = ref()

    const yun_pos_dict = ref({})
    const pz_err_dict = ref({})
    const duo_yin_pos = ref([])
    const rhyme_foot = ref('')

    const clear_input = () => { // 清空输入框
      text.value = '';
    }

    const reserved_chinese_word = (text:string) => { // 只留汉字
      let regEx = /[^\u4e00-\u9fa5\uf900-\ufa2d]/g;
      return text.replace(regEx, '');
    }

    const should_num = () => { // 应该多少字
      let num:number = (yan.value ? 7 : 5) * 4 * ((jue.value ? 0 : 1) + 1)
      return num
    }

    const random = (min:any,max:any) => Math.floor(Math.random() * (max - min + 1) + min)
    const arr = ref(["这诗真美，和你的人生一样！","你好啊，大诗人！","意味深长。。。","真乃仙才也！","是苏仙转世了吗？","真可谓在世李太白！"])

    const arr_idx = ref(random(0,arr.value.length - 1))

    const metric_detection = async () => { // 格律检测

      let text_filter = reserved_chinese_word(text.value)
      let num:number = should_num()

      if (num != text_filter.length) {
        ElMessage({
          showClose: true,
          message: '您输入的字数为' + text_filter.length + '，不正确。应输入' + num + '字。',
          type: 'error',
          duration: 3000,
        })
        return false
      }


      const ret = await Get('rhyme/metric_poetry/', {
        text: text_filter,
        yan: yan.value ? 7 : 5,
        jue: jue.value ? 0 : 1,
        qi: qi.value ? 1 : 0,
        ru: ru.value ? 0 : 1,
        use_rhyme: use_rhyme.value,
      }, false)


      // console.log("text", ret.data.text)
      // console.log("yun_pos_dict", ret.data.yun_pos_dict)
      // console.log("pz_err_dict", ret.data.pz_err_dict)
      // console.log("duo_yin_pos", ret.data.duo_yin_pos)
      // console.log("rhyme_foot", ret.data.rhyme_foot)

      detect_text.value = ret.data.text;
      yun_pos_dict.value = ret.data.yun_pos_dict;
      pz_err_dict.value = ret.data.pz_err_dict;
      duo_yin_pos.value = ret.data.duo_yin_pos;
      rhyme_foot.value = ret.data.rhyme_foot;
      yan_list.value = ret.data.yan_list;
      jue_list.value = ret.data.jue_list;

      detect_yan.value = yan.value;
      detect_jue.value = jue.value;
      detect_qi.value = qi.value;
      detect_ru.value = ru.value;
      detect_use_rhyme.value = use_rhyme.value;

      arr_idx.value = random(0,arr.value.length - 1)
      // console.log(arr_idx.value)

      if (Object.keys(pz_err_dict.value).length > 5) { //平仄错了多于5个
        // console.log('平仄错了多于5个')
        ElMessageBox.alert('平仄错误太多，请确认<strong>格律诗种类</strong>和<strong>韵表</strong>是否选对。', '提示', {
          // if you want to disable its autofocus
          // autofocus: false,
          confirmButtonText: '好的',
          dangerouslyUseHTMLString: true,
          /*callback: (action: Action) => {
            ElMessage({
              type: 'info',
              message: `action: ${action}`,
            })
          },*/
        })
      }

    }

    const flat_oblique_tone_table = [
      [  // 七言
        [  // 七绝
          [  // 首句押韵
            'y100y10/x0y1100/x0y1x01/y100y10',  // 仄起
            'x0y1100/y100y10/y1x0011/x0y1100',  // 平起
          ],
          [  // 首句不押韵
            'y1x0011/x0y1100/x0y1x01/y100y10',  // 仄起
            'x0y1x01/y100y10/y1x0011/x0y1100',  // 平起
          ]
        ],
        [  // 七律
          [  // 首句押韵
            'y100y10/x0y1100/x0y1x01/y100y10/y1x0011/x0y1100/x0y1x01/y100y10',  // 仄起
            'x0y1100/y100y10/y1x0011/x0y1100/x0y1x01/y100y10/y1x0011/x0y1100',  // 平起
          ],
          [  // 首句不押韵
            'y1x0011/x0y1100/x0y1x01/y100y10/y1x0011/x0y1100/x0y1x01/y100y10',  // 仄起
            'x0y1x01/y100y10/y1x0011/x0y1100/x0y1x01/y100y10/y1x0011/x0y1100',  // 平起
          ]
        ]
      ],
      [  // 五言
        [  // 五绝
          [  // 首句押韵
            'y1100/00y10/x0011/y1100',  // 仄起
            '00y10/y1100/y1x01/00y10',  // 平起
          ],
          [  // 首句不押韵
            'y1x01/00y10/x0011/y1100',  // 仄起
            'x0011/y1100/y1x01/00y10',  // 平起
          ]
        ],
        [  // 五律
          [  // 首句押韵
            'y1100/00y10/x0011/y1100/y1x01/00y10/x0011/y1100',  // 仄起
            '00y10/y1100/y1x01/00y10/x0011/y1100/y1x01/00y10',  // 平起
          ],
          [  // 首句不押韵
            'y1x01/00y10/x0011/y1100/y1x01/00y10/x0011/y1100',  // 仄起
            'x0011/y1100/y1x01/00y10/x0011/y1100/y1x01/00y10',  // 平起
          ]
        ]
      ]
    ]
    const tones = ref(flat_oblique_tone_table[yan.value ? 0 : 1][jue.value ? 0 : 1][ru.value ? 0 : 1][qi.value ? 1 : 0])
    
    const example_poetry_table = [
      [  // 七言
        [  // 七绝
          [  // 首句押韵
            ['扬子江头杨柳春', '杨花愁杀渡江人', '数声风笛离亭晚', '君向潇湘我向秦'], // 仄起 唐 郑谷 淮上与友人别
            ['朝辞白帝彩云间', '千里江陵一日还', '两岸猿声啼不住', '轻舟已过万重山'], // 平起 唐 李白 早发白帝城
          ],
          [  // 首句不押韵
            ['荷尽已无擎雨盖', '菊残犹有傲霜枝', '一年好景君须记', '最是橙黄橘绿时'],  // 仄起 宋 苏轼 赠刘景文
            ['扶风乔木夏阴合', '斜谷铃声秋夜深', '人到愁来无处会', '不关情处总伤心'],  // 平起 宋 黄庭坚 和陈君仪读太真外传
          ]
        ],
        [  // 七律
          [  // 首句押韵
            ['昨夜星辰昨夜风', '画楼西畔桂堂东', '身无彩凤双飞翼', '心有灵犀一点通', '隔座送钩春酒暖', '分曹射覆蜡灯红', '嗟余听鼓应官去', '走马兰台类转蓬'],  // 仄起 唐 李商隐 无题二首 一
            ['少年离别意非轻', '老去相逢亦怆情', '草草杯盘供笑语', '昏昏灯火话平生', '自怜湖海三年隔', '又作尘沙万里行', '欲问后期何日是', '寄书应见雁南征'],  // 平起 宋 王安石 示长安君
          ],
          [  // 首句不押韵
            ['昔日戏言身后意', '今朝都到眼前来', '衣裳已施行看尽', '针线犹存未忍开', '尚想旧情怜婢仆', '也曾因梦送钱财', '诚知此恨人人有', '贫贱夫妻百事哀'],  // 仄起 唐 元稹 遣悲怀三首 其二

            ['同为懒慢园林客', '共对萧条雨雪天', '小酌酒巡销永夜', '大开口笑送残年', '久将时背成遗老', '多被人呼作散仙', '呼作散仙应有以', '曾看东海变桑田'],  // 平起 唐 白居易 雪夜小饮赠梦得
          ]
        ]
      ],
      [  // 五言
        [  // 五绝
          [  // 首句押韵
            ['墙角数枝梅', '凌寒独自开', '遥知不是雪', '为有暗香来'],  // 仄起 宋 王安石 梅花
            ['花明绮陌春', '柳拂御沟新', '为报辽阳客', '流芳不待人'],  // 平起 宋 王涯 闺人赠远五首 一

          ],
          [  // 首句不押韵
            ['红豆生南国', '春来发几枝', '愿君多采撷', '此物最相思'],  // 仄起 唐 王维 相思
            ['山中相送罢', '日暮掩柴扉', '春草年年绿', '王孙归不归'],  // 平起 唐 王维 送别
          ]
        ],
        [  // 五律
          [  // 首句押韵
            ['戍鼓断人行', '秋边一雁声', '露从今夜白', '月是故乡明', '有弟皆分散', '无家问死生', '寄书长不达', '况乃未休兵'],  // 仄起 唐 杜甫 月夜忆舍弟
            ['凭高送所亲', '久坐惜芳辰', '远水非无浪', '他山自有春', '野花随处发', '官柳著行新', '天际伤愁别', '离筵何太频'],  // 平起 唐 杜甫 郪城西原送李判官兄武判官弟赴成都府
          ],
          [  // 首句不押韵
            ['珍重神和子', '闻名五十年', '童颜终不改', '绿发尚依然', '酒里消闲日', '人间作散仙', '长生如可慕', '相逐隐林泉'],  // 仄起 唐 王毂 逢道者神和子
            ['故关衰草遍', '离别正堪悲', '路出寒云外', '人归暮雪时', '少孤为客早', '多难识君迟', '掩泣空相向', '风尘何所期'],  // 平起 唐 卢纶 送李端
          ]
        ]
      ]
    ]
    const example_poetry = ref(example_poetry_table[yan.value ? 0 : 1][jue.value ? 0 : 1][ru.value ? 0 : 1][qi.value ? 1 : 0])

    const metric_type_change = () => {
      tones.value = flat_oblique_tone_table[yan.value ? 0 : 1][jue.value ? 0 : 1][ru.value ? 0 : 1][qi.value ? 1 : 0];
      example_poetry.value = example_poetry_table[yan.value ? 0 : 1][jue.value ? 0 : 1][ru.value ? 0 : 1][qi.value ? 1 : 0];
    }



    /*以下为韵表检索页面的数据*/

    const rhyme_table_show = ref(false)
    const xinyun2word = ref()
    const pingshui2word = ref()

    const store = useStore();
    const open_rhyme_table = async () => {
      ps_sp_word.value = false;
      xin_sp_word.value = false;
      if (Object.keys(store.getters.get_xinyun).length === 0 ||
          Object.keys(store.getters.get_pingshui).length === 0) {

        // store.dispatch 是异步
        await store.dispatch("updateAllRhyme", {
          args: { // 参数

          },
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

      rhyme_table_show.value = true
    }
    const close_rhyme_table = () => {
      rhyme_table_show.value = false
      ps_sp_word.value = false;
      xin_sp_word.value = false;
    }



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


    return {
      text,
      detect_text,
      yan,
      detect_yan,
      jue,
      detect_jue,
      qi,
      detect_qi,
      ru,
      detect_ru,
      use_rhyme,
      detect_use_rhyme,

      yan_list,
      jue_list,
      yun_pos_dict,
      pz_err_dict,
      duo_yin_pos,
      rhyme_foot,

      arr,
      arr_idx,
      tones,
      example_poetry,

      clear_input,
      metric_detection,
      metric_type_change,


      /*以下为韵表检索页面的数据*/
      rhyme_table_show,
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

      open_rhyme_table,
      close_rhyme_table,

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