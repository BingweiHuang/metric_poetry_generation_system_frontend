<template>

  <el-space wrap style="align-items: start; justify-content: center;">

    <!-- 规则-作品栏 -->
    <el-card style="width: 620px">

      <!-- 头部 -->
      <template #header>
        <div class="card-header">
          <div style="text-align: center; width: 40%">规则</div>
          <div style="text-align: center; width: 60%">{{detect_text === '' ? '例子' : '作品'}}</div>
        </div>
      </template>

      <!-- 身体 -->
      <div style="width: 100%; display: flex; justify-content: center">

        <!-- 平仄规则展示 -->
        <el-card style=" height: 260px;font-size: 20px; width: 240px; justify-content: center; display: flex; margin-right: 20px" shadow="never">
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

        </el-card>

        <!-- 格律诗例子 -->
        <el-card style=" height: 260px; width: 320px; justify-content: center; display: flex;" shadow="never" v-if="detect_text === ''">
          <div style="font-size: 20px;">
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
          </div>
        </el-card>

        <!-- 检测的作品 -->
        <el-card style=" height: 260px; width: 320px; display: flex;" shadow="never" v-else>
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
        </el-card>

      </div>

      <!-- 检测结果展示栏 -->
      <el-card style="width: 100%; margin-top: 20px" shadow="never" v-show="detect_text">

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
          <el-space wrap>

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

      </el-card>

      <!-- 打开韵表 和 说明 -->
      <el-card style="width: 100%; margin-top: 20px" shadow="never">

        <div style="width: 100%; justify-content: center; display: flex; margin-bottom: 10px">
          <el-button type="primary" id="lstm_create_button">打开韵表</el-button>
        </div>

        <div style="width: 100%; justify-content: center; display: flex">
          <div style="font-size: 14px; color: #99a9bf">
            说明：本系统只提供标准句式的检测。特殊句式、拗救、可变通处请自行判断。
          </div>
        </div>

      </el-card>

    </el-card>

    <!-- 输入作品栏   -->
    <el-card style="width: 400px">

      <!-- 头部 -->
      <template #header>
        <div class="card-header">
          <div style="text-align: center; width: 100%">请输入您的作品</div>
        </div>
      </template>

      <!-- 输入框 -->
      <el-input style="width: 100%; font-size: 20px; font-family: 华文楷体"
                type="textarea" :autosize="{ minRows: 8, maxRows: 8 }"
                v-model="text" placeholder="不用管换行">
      </el-input>

      <!-- 选择格律诗种类 -->
      <el-card style="width: 100%; margin-top: 20px" shadow="never">

        <div style="width: 100%; justify-content: center; display: flex">
          <el-space wrap size="large">
            <el-switch v-model="yan" size="large" inline-prompt
                       style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                       active-text="七言" inactive-text="五言" @change="metric_type_change"/>
            <el-switch v-model="jue" size="large" inline-prompt
                       style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                       active-text="绝句" inactive-text="律句" @change="metric_type_change"/>
            <el-switch v-model="qi" size="large" inline-prompt
                       style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                       active-text="平起" inactive-text="仄起" @change="metric_type_change"/>
            <el-tooltip content="首句是否押(入)韵" placement="top">
              <el-switch v-model="ru" size="large" inline-prompt
                         active-text="入韵" inactive-text="不入" @change="metric_type_change"/>
            </el-tooltip>
          </el-space>
        </div>

        <div style="width: 100%; justify-content: center; display: flex">
          <el-space wrap size="large">
            <el-select v-model="use_rhyme" class="m-2" placeholder="选韵表" style="width: 100px">
              <el-option :key="1" :label="'平水韵'" :value="1"/>
              <el-option :key="2" :label="'中华新韵'" :value="2"/>
            </el-select>
            <el-button type="primary" id="lstm_create_button" @click="metric_detection">开始检测</el-button>
            <el-button :type="'plain'" link @click="clear_input">清空</el-button>
          </el-space>
        </div>


      </el-card>
    </el-card>
  </el-space>

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
  width: 500px;
  //width: 50%;
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
import type { Action } from 'element-plus'

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


      const ret = await instance({
        url: 'detection/metric_poetry',
        method:'get',
        headers: {
          // 'Authorization': "Bearer " + store.state.user.access,
        },
        params: {
          text: text_filter,
          yan: yan.value ? 7 : 5,
          jue: jue.value ? 0 : 1,
          qi: qi.value ? 1 : 0,
          ru: ru.value ? 0 : 1,
          use_rhyme: use_rhyme.value,
        },
      })
      /*.then((resp) => {
        console.log("text", resp.data.text)
        console.log("yun_pos_dict", resp.data.yun_pos_dict)
        console.log("pz_err_dict", resp.data.pz_err_dict)
        console.log("duo_yin_pos", resp.data.duo_yin_pos)
        console.log("rhyme_foot", resp.data.rhyme_foot)

        detect_text.value = resp.data.text;
        yun_pos_dict.value = resp.data.yun_pos_dict;
        pz_err_dict.value = resp.data.pz_err_dict;
        duo_yin_pos.value = resp.data.duo_yin_pos;
        rhyme_foot.value = resp.data.rhyme_foot;
        yan_list.value = resp.data.yan_list;
        jue_list.value = resp.data.jue_list;

        detect_yan.value = yan.value;
        detect_jue.value = jue.value;
        detect_qi.value = qi.value;
        detect_ru.value = ru.value;
        detect_use_rhyme.value = use_rhyme.value;
      })
      .catch((error) => {
        console.log(error);
      })*/


      console.log("text", ret.data.text)
      console.log("yun_pos_dict", ret.data.yun_pos_dict)
      console.log("pz_err_dict", ret.data.pz_err_dict)
      console.log("duo_yin_pos", ret.data.duo_yin_pos)
      console.log("rhyme_foot", ret.data.rhyme_foot)

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

      if (Object.keys(pz_err_dict.value).length > 5) { //平仄错了多于5个
        console.log('平仄错了多于5个')
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
            ['君问归期未有期', '巴山夜雨涨秋池', '何当共剪西窗烛', '却话巴山夜雨时'], // 仄起
            ['朝辞白帝彩云间', '千里江陵一日还', '两岸猿声啼不住', '轻舟已过万重山'], // 平起
          ],
          [  // 首句不押韵
            ['独在异乡为异客', '每逢佳节倍思亲', '遥知兄弟登高处', '遍插茱萸少一人'],  // 仄起
            ['伤心欲问前朝事', '惟见江流去不回', '日暮东风春草绿', '鹧鸪飞上越王台'],  // 平起
          ]
        ],
        [  // 七律
          [  // 首句押韵
            ['早岁那知世事艰', '中原北望气如山', '楼船夜雪瓜洲渡', '铁马秋风大散关', '塞上长城空自许', '镜中衰鬓已先斑', '出师一表真名世', '千载谁堪伯仲间'],  // 仄起
            ['一封朝奏九重天', '夕贬潮州路八千', '欲为圣明除弊事', '肯将衰朽惜残年', '云横秦岭家何在', '雪拥蓝关马不前', '知汝远来应有意', '好收吾骨瘴江边'],  // 平起
          ],
          [  // 首句不押韵
            ['剑外忽传收蓟北', '初闻涕泪满衣裳', '却看妻子愁何在', '漫卷诗书喜欲狂', '白日放歌须纵酒', '青春作伴好还乡', '即从巴峡穿巫峡', '便下襄阳向洛阳'],  // 仄起
            ['舍南舍北皆春水', '但见群鸥日日来', '花径不曾缘客扫', '蓬门今始为君开', '盘飧市远无兼味', '樽酒家贫只旧醅', '肯与邻翁相对饮', '隔篱呼取尽余杯'],  // 平起
          ]
        ]
      ],
      [  // 五言
        [  // 五绝
          [  // 首句押韵
            ['北斗七星高', '哥舒夜带刀', '至今窥牧马', '不敢过临洮'],  // 仄起
            ['花明绮陌春', '柳拂御沟新', '为报辽阳客', '流芳不待人'],  // 平起
          ],
          [  // 首句不押韵
            ['白日依山尽', '黄河入海流', '欲穷千里目', '更上一层楼'],  // 仄起
            ['鸣筝金粟柱', '素手玉房前', '欲得周郎顾', '时时误拂弦'],  // 平起
          ]
        ],
        [  // 五律
          [  // 首句押韵
            ['太乙近天都', '连山接海隅', '白云回望合', '青霭入看无', '分野中峰变', '阴晴众壑殊', '欲投人处宿', '隔水问樵夫'],  // 仄起
            ['凄凉宝剑篇', '羁泊欲穷年', '黄叶仍风雨', '青楼自管弦', '新知遭薄俗', '旧好隔良缘', '心断新丰酒', '消愁斗几千'],  // 平起
          ],
          [  // 首句不押韵
            ['国破山河在', '城春草木深', '感时花溅泪', '恨别鸟惊心', '烽火连三月', '家书抵万金', '白头搔更短', '浑欲不胜簪'],  // 仄起
            ['空山新雨后', '天气晚来秋', '明月松间照', '清泉石上流', '竹喧归浣女', '莲动下渔舟', '随意春芳歇', '王孙自可留'],  // 平起
          ]
        ]
      ]
    ]
    const example_poetry = ref(example_poetry_table[yan.value ? 0 : 1][jue.value ? 0 : 1][ru.value ? 0 : 1][qi.value ? 1 : 0])

    const metric_type_change = () => {
      tones.value = flat_oblique_tone_table[yan.value ? 0 : 1][jue.value ? 0 : 1][ru.value ? 0 : 1][qi.value ? 1 : 0];
      example_poetry.value = example_poetry_table[yan.value ? 0 : 1][jue.value ? 0 : 1][ru.value ? 0 : 1][qi.value ? 1 : 0];
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

      tones,
      example_poetry,

      clear_input,
      metric_detection,
      metric_type_change,
    }
  }
}
</script>