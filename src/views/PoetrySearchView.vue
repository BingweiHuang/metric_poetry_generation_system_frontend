<template>

  <div>

    <!-- 检索条件输入 -->
    <el-row>
      <el-col :xl="2" :lg="2" :md="2" :sm="2" :xs="0">

      </el-col>

      <el-col :xl="20" :lg="20" :md="20" :sm="20" :xs="24">

        <!-- 检索条件1 -->
        <el-row justify="center" align="middle" :gutter="0">
          <el-col :span="8">
            <el-cascader size="large" v-model="poetry_dynasty_value" :options="poetry_dynasty_options"
                         placeholder="诗词和朝代" clearable @change="handle_change"/>
          </el-col>

          <el-col :span="8">
            <el-input size="large" v-model="author_input" placeholder="作者" clearable
                      :disabled="poetry_dynasty_value && poetry_dynasty_value[0] === 'shijings'">

            </el-input >
          </el-col>

          <el-col :span="8">
            <el-input size="large" v-model="title_input" placeholder="诗名，词牌" clearable
                      :disabled="poetry_dynasty_value && poetry_dynasty_value[0] === 'shijings'">
            </el-input>
          </el-col>

        </el-row>

        <!-- 检索条件2 -->
        <el-row justify="center" align="middle" :gutter="0">
          <el-col :xl="22" :lg="22" :md="22" :sm="20" :xs="20">
            <el-input size="large" v-model="content_input" placeholder="内容，多关键词用空格隔开" clearable>
            </el-input>
          </el-col>

          <el-col :xl="2" :lg="2" :md="2" :sm="4" :xs="4">
            <el-button size="large" :icon="Search" @click="poetry_search" />
          </el-col>

        </el-row>

        <!-- 检索条件3（诗、诗经） -->
        <div  v-if="poetry_dynasty_value && poetry_dynasty_value[0] === 'shis'">

          <el-row justify="center" align="middle" :gutter="0">

            <el-col :span="8">
              <el-select v-model="metric_value" class="m-2" placeholder="Select" size="large">
                <template #prefix>
                  <span>古近:</span>
                </template>
                <el-option
                    v-for="item in metric_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </el-col>

            <el-col :span="8">
              <el-select v-model="yan_value" class="m-2" placeholder="Select" size="large">
                <template #prefix>
                  <span>几言:</span>
                </template>
                <el-option
                    v-for="item in yan_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </el-col>

            <el-col :span="8">
              <el-select v-model="jue_value" class="m-2" placeholder="Select" size="large">
                <template #prefix>
                  <span>绝律:</span>
                </template>
                <el-option
                    v-for="item in jue_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </el-col>

          </el-row>
        </div>
        <div  v-else-if="poetry_dynasty_value && poetry_dynasty_value[0] === 'shijings'">

          <el-row justify="center" align="middle" :gutter="0">

            <el-col :span="8">
              <el-select v-model="chapter_value" class="m-2" placeholder="Select" size="large" @change="chapter_change">
<!--                <template #prefix>
                  <span>篇:</span>
                </template>-->
                <el-option
                    v-for="item in chapter_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </el-col>

            <el-col :span="8">
              <el-select v-model="section_value" class="m-2" placeholder="Select" size="large" @change="section_change"
                         :disabled="section_disable">
<!--                <template #prefix>
                  <span>部分:</span>
                </template>-->
                <el-option
                    v-for="item in section_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </el-col>

            <el-col :span="8">
              <el-select v-model="title_value" class="m-2" placeholder="Select" size="large"
                         :disabled="title_disable">
<!--                <template #prefix>
                  <span>标题:</span>
                </template>-->
                <el-option
                    v-for="item in title_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </el-col>

          </el-row>
        </div>
      </el-col>

      <el-col :xl="2" :lg="2" :md="2" :sm="2" :xs="0">

      </el-col>
    </el-row>

    <!-- 检索结果展示栏 -->
    <div style="min-height: 600px">
      <el-space size="" wrap style="width: 100%; justify-content: center;">
        <template v-for="poetry in poetryList.slice((currentPage - 1) * pageSize, currentPage * pageSize)" :key="poetry.id">
          <ShiCard :poetry="poetry" v-if="shici === 'shis'" />
          <CiCard :poetry="poetry" v-else-if="shici === 'cis'"/>
          <ShijingCard :poetry="poetry" v-else-if="shici === 'shijings'"/>
        </template>
        <template v-if="poetryList.length === 0">
          <el-empty description="浅浅检索一下吧"/>
        </template>
        <template v-else>
          <el-button type="primary" text size="large"
                     v-if="(currentPage >= (poetryList.length / pageSize)) && have_more"
                     @click="load" style="font-size: 20px; font-weight: bold">
            加载更多...
          </el-button>
        </template>
      </el-space>
    </div>

    <!-- web端分页码 -->
    <el-pagination
        class="my-el-pagination hidden-xs-only"
        background
        :small="false"
        :hide-on-single-page="true"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :pager-count="6"
        layout=" prev, pager, next"
        :total="poetryList.length">
    </el-pagination>

    <!-- 移动端分页码 -->
    <el-pagination
        class="my-el-pagination hidden-sm-and-up"
        background
        :small="true"
        :hide-on-single-page="true"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :pager-count="6"
        layout=" prev, pager, next"
        :total="poetryList.length">
    </el-pagination>

  </div>



</template>

<script lang="ts">
import {ref} from "vue";
import {
  Search,
  User,
  Folder,
  Document,
} from '@element-plus/icons-vue'
import ShiCard from "@/components/ShiCard.vue";
import CiCard from "@/components/CiCard.vue";
import ShijingCard from "@/components/ShijingCard.vue";
import {instance} from "@/utils/utils";
import {ElMessage} from "element-plus";
import {Get} from "@/utils/request";
export default {
  name: "PoetrySearchView",
  components: {
    ShiCard,
    CiCard,
    ShijingCard,
  },
  setup() {
    const poetry_dynasty_options = ref([
      {
        value: 'shis',
        label: '诗',
        children: [
          {
            value: '唐代',
            label: '唐代',
          },
          {
            value: '三百首',
            label: '唐诗三百首',
          },
          {
            value: '宋代',
            label: '宋代',
          },
          {
            value: '近现代',
            label: '近现代',
          },
          {
            value: '不限朝代',
            label: '不限朝代',
          },
        ]
      },
      {
        value: 'cis',
        label: '词',
        children: [
          {
            value: '五代',
            label: '五代',
          },
          {
            value: '宋代',
            label: '宋代',
          },
          {
            value: '三百首',
            label: '宋词三百首',
          },
          {
            value: '清代',
            label: '清代',
          },
          {
            value: '近现代',
            label: '近现代',
          },
          {
            value: '不限朝代',
            label: '不限朝代',
          }
        ]
      },
      {
        value: 'shijings',
        label: '诗经',
        children: []
      }
    ])
    const poetry_dynasty_value = ref()

    const metric_options = ref([
      {
        value: 0,
        label: '古体',
      },
      {
        value: 1,
        label: '近体',
      },
      {
        value: -1,
        label: '不限',
      },
    ])
    const metric_value = ref(-1)
    const yan_options = ref([
      {
        value: 5,
        label: '五言',
      },
      {
        value: 7,
        label: '七言',
      },
      {
        value: 0,
        label: '杂言',
      },
      {
        value: -1,
        label: '不限',
      },
    ])
    const yan_value = ref(-1)
    const jue_options = ref([
      {
        value: 0,
        label: '绝句',
      },
      {
        value: 1,
        label: '律诗',
      },
      {
        value: 2,
        label: '排律',
      },
      {
        value: 3,
        label: '其他',
      },
      {
        value: -1,
        label: '不限',
      },
    ])
    const jue_value = ref(-1)

    const shijing_dict = {
      "国风": {
        "周南": [
          "关雎",
          "葛覃",
          "卷耳",
          "樛木",
          "螽斯",
          "桃夭",
          "兔罝",
          "芣苡",
          "汉广",
          "汝坟",
          "麟之趾"
        ],
        "召南": [
          "鹊巢",
          "采蘩",
          "草虫",
          "采蘋",
          "甘棠",
          "行露",
          "羔羊",
          "殷其雷",
          "摽有梅",
          "小星",
          "江有汜",
          "野有死麕",
          "何彼襛矣",
          "驺虞"
        ],
        "邶风": [
          "柏舟",
          "绿衣",
          "燕燕",
          "日月",
          "终风",
          "击鼓",
          "凯风",
          "雄雉",
          "匏有苦叶",
          "谷风",
          "式微",
          "旄丘",
          "简兮",
          "泉水",
          "北门",
          "北风",
          "静女",
          "新台",
          "二子乘舟"
        ],
        "鄘风": [
          "柏舟",
          "墙有茨",
          "君子偕老",
          "桑中",
          "鹑之奔奔",
          "定之方中",
          "蝃蝀",
          "相鼠",
          "干旄",
          "载驰"
        ],
        "卫风": [
          "淇奥",
          "考槃",
          "硕人",
          "氓",
          "竹竿",
          "芄兰",
          "河广",
          "伯兮",
          "有狐",
          "木瓜"
        ],
        "王风": [
          "黍离",
          "君子于役",
          "君子阳阳",
          "扬之水",
          "中谷有蓷",
          "兔爰",
          "葛藟",
          "采葛",
          "大车",
          "丘中有麻"
        ],
        "郑风": [
          "缁衣",
          "将仲子",
          "叔于田",
          "大叔于田",
          "清人",
          "羔裘",
          "遵大路",
          "女曰鸡鸣",
          "有女同车",
          "山有扶苏",
          "萚兮",
          "狡童",
          "褰裳",
          "丰",
          "东门之墠",
          "风雨",
          "子衿",
          "扬之水",
          "出其东门",
          "野有蔓草",
          "溱洧"
        ],
        "齐风": [
          "鸡鸣",
          "还",
          "着",
          "东方之日",
          "东方未明",
          "南山",
          "甫田",
          "卢令",
          "敝笱",
          "载驱",
          "猗嗟"
        ],
        "魏风": [
          "葛屦",
          "汾沮洳",
          "园有桃",
          "陟岵",
          "十亩之间",
          "伐檀",
          "硕鼠"
        ],
        "唐风": [
          "蟋蟀",
          "山有枢",
          "扬之水",
          "椒聊",
          "绸缪",
          "杕杜",
          "羔裘",
          "鸨羽",
          "无衣",
          "有杕之杜",
          "葛生",
          "采苓"
        ],
        "秦风": [
          "车邻",
          "驷驖",
          "小戎",
          "蒹葭",
          "终南",
          "黄鸟",
          "晨风",
          "无衣",
          "渭阳",
          "权舆"
        ],
        "陈风": [
          "宛丘",
          "东门之枌",
          "衡门",
          "东门之池",
          "东门之杨",
          "墓门",
          "防有鹊巢",
          "月出",
          "株林",
          "泽陂"
        ],
        "桧风": [
          "羔裘",
          "素冠",
          "隰有苌楚",
          "匪风"
        ],
        "曹风": [
          "蜉蝣",
          "候人",
          "鳲鸠",
          "下泉"
        ],
        "豳风": [
          "七月",
          "鸱鸮",
          "东山",
          "破斧",
          "伐柯",
          "九罭",
          "狼跋"
        ]
      },
      "小雅": {
        "鹿鸣之什": [
          "鹿鸣",
          "四牡",
          "皇皇者华",
          "棠棣",
          "伐木",
          "天保",
          "采薇",
          "出车",
          "杕杜",
          "鱼丽"
        ],
        "南有嘉鱼之什": [
          "南有嘉鱼",
          "南山有台",
          "蓼萧",
          "湛露",
          "彤弓",
          "菁菁者莪",
          "六月",
          "采芑",
          "车攻",
          "吉日"
        ],
        "鸿雁之什": [
          "鸿雁",
          "庭燎",
          "沔水",
          "鹤鸣",
          "祈父",
          "白驹",
          "黄鸟",
          "我行其野",
          "斯干",
          "无羊"
        ],
        "节南山之什": [
          "节南山",
          "正月",
          "十月之交",
          "雨无正",
          "小旻",
          "小宛",
          "小弁",
          "巧言",
          "何人斯",
          "巷伯"
        ],
        "谷风之什": [
          "谷风",
          "蓼莪",
          "大东",
          "四月",
          "北山",
          "无将大车",
          "小明",
          "鼓钟",
          "楚茨",
          "信南山"
        ],
        "甫田之什": [
          "甫田",
          "大田",
          "瞻彼洛矣",
          "裳裳者华",
          "桑扈",
          "鸳鸯",
          "頍弁",
          "车舝",
          "青蝇",
          "宾之初筵"
        ],
        "鱼藻之什": [
          "鱼藻",
          "采菽",
          "角弓",
          "菀柳",
          "都人士",
          "采绿",
          "黍苗",
          "隰桑",
          "白华",
          "绵蛮",
          "瓠叶",
          "渐渐之石",
          "苕之华",
          "何草不黄"
        ]
      },
      "大雅": {
        "文王之什": [
          "文王",
          "大明",
          "绵",
          "棫朴",
          "旱麓",
          "思齐",
          "皇矣",
          "灵台",
          "下武",
          "文王有声"
        ],
        "生民之什": [
          "生民",
          "行苇",
          "既醉",
          "凫鹥",
          "假乐",
          "公刘",
          "泂酌",
          "卷阿",
          "民劳",
          "板"
        ],
        "荡之什": [
          "荡",
          "抑",
          "桑柔",
          "云汉",
          "崧高",
          "烝民",
          "韩奕",
          "江汉",
          "常武",
          "瞻卬",
          "召旻"
        ]
      },
      "周颂": {
        "清庙之什": [
          "清庙",
          "维天之命",
          "维清",
          "烈文",
          "天作",
          "昊天有成命",
          "我将",
          "时迈",
          "执竞",
          "思文"
        ],
        "臣工之什": [
          "臣工",
          "噫嘻",
          "振鹭",
          "丰年",
          "有瞽",
          "潜",
          "雝",
          "载见",
          "有客",
          "武"
        ],
        "闵予小子之什": [
          "闵予小子",
          "访落",
          "敬之",
          "小毖",
          "载芟",
          "良耜",
          "丝衣",
          "酌",
          "桓",
          "赉",
          "般"
        ]
      },
      "鲁颂": {
        "駉之什": [
          "駉",
          "有駜",
          "泮水",
          "閟宫"
        ]
      },
      "商颂": {
        "那之什": [
          "那",
          "烈祖",
          "玄鸟",
          "长发",
          "殷武"
        ]
      }
    }

    const chapter_options = ref([
      {
        value: '国风',
        label: '国风',
      },
      {
        value: '小雅',
        label: '小雅',
      },
      {
        value: '大雅',
        label: '大雅',
      },
      {
        value: '周颂',
        label: '周颂',
      },
      {
        value: '鲁颂',
        label: '鲁颂',
      },
      {
        value: -1,
        label: '不限',
      },
    ])
    const chapter_value = ref(-1)
    const chapter_change = (chapter) => {
      section_value.value = -1
      title_value.value = -1
      if (chapter === -1) {
        section_disable.value = true
      } else {
        const the = []
        the.push({
          value: -1,
          label: '不限'
        })
        for (const section in shijing_dict[chapter]) {
          the.push({
            value: section,
            label: section
          })
        }
        section_options.value = the
        section_disable.value = false
      }
    }
    const section_disable = ref(true)
    const section_options = ref([
      {
        value: -1,
        label: '不限',
      },
    ])
    const section_value = ref(-1)
    const section_change = (section) => {
      title_value.value = -1
      if (section === -1) {
        title_disable.value = true
      } else {
        const the = []
        the.push({
          value: -1,
          label: '不限'
        })
        for (const title in shijing_dict[chapter_value.value][section]) {
          the.push({
            value: shijing_dict[chapter_value.value][section][title],
            label: shijing_dict[chapter_value.value][section][title]
          })
        }
        title_options.value = the
        title_disable.value = false
      }
    }
    const title_disable = ref(true)
    const title_options = ref([
      {
        value: -1,
        label: '不限',
      },
    ])
    const title_value = ref(-1)

    const shici = ref('')
    const author_input = ref('')
    const title_input = ref('')
    const content_input = ref('')

    let poetryList = ref([])
    const currentPage = ref(1);
    const pageSize = ref(12);


    // @size-change页码展示数量点击事件
    const handleSizeChange = (val: number) => {
      // 更新每页展示数据size
      pageSize.value = val
    };
    // @current-change页码点击事件
    const handleCurrentChange = (val: number) => {
      // 更新当前页数是第几页
      currentPage.value = val
    };

    let kwargs = {};
    let default_limit = 24; // 一页多少条数据
    let next_url = ''
    let query_url = ''

    const handle_change = (val) => {
      if (val[0] === 'shijings') {
        author_input.value = ''
        title_input.value = ''
      }
    }

    const poetry_search = async () => {
      if (!poetry_dynasty_value.value) {
        ElMessage({
          showClose: true,
          message: '请选择诗词和朝代',
          type: 'error',
          duration: 3000,
        })
        return false
      }

      shici.value = poetry_dynasty_value.value[0]
      const dynasty = poetry_dynasty_value.value[1]

      query_url = "search/" + shici.value + '/' // 需要发送axios请求的url
      kwargs = {
        limit: default_limit,
      };

      if (shici.value !== 'shijings') { // 选的词或者诗
        if (dynasty === '三百首') {
          kwargs['three_hundred'] = 1
        } else if (dynasty !== '不限朝代') {
          kwargs['dynasty'] = dynasty
        }
        if (author_input.value != '') {
          kwargs['author'] = author_input.value;
        }
        if (title_input.value != '') {
          kwargs['title'] = title_input.value;
          kwargs['rhythmic'] = title_input.value;
        }
        if (content_input.value != '') {
          kwargs['content'] = content_input.value;
        }

        if (shici.value === 'shis') { // 如果选的是诗

          if (metric_value.value !== -1) { // 如果选了古近体
            kwargs['metric'] = metric_value.value
          }

          if (yan_value.value !== -1) { // 如果选了几言
            kwargs['yan'] = yan_value.value
          }

          if (jue_value.value !== -1) { // 如果选了绝律
            kwargs['jue'] = jue_value.value
            // kwargs['rhyme_type'] = '1,2'
          }
        }
      } else { // 选的诗经
        if (chapter_value.value !== -1) {
          kwargs['chapter'] = chapter_value.value
        }

        if (section_value.value !== -1) {
          kwargs['section'] = section_value.value
        }

        if (title_value.value !== -1) {
          kwargs['title'] = title_value.value
        }

      }

      poetryList.value = [];

      let ret = await Get(query_url, kwargs, false)
          .then((resp) => {
            let result = resp.data.results
            if (result.length === 0) {
              ElMessage({
                message:'喏哦~ 没有符合条件的诗词喔~ 换个条件戏一下的喔',
                duration: 3000
              })
            } else {
              poetryList.value = result
              next_url = resp.data.next
              if (result.length < default_limit) have_more.value = false
            }
          })
          .catch((error) => {
            console.log(error);
          })


    }

    const have_more = ref(true)

    const load = () => {
      console.log('触发load')

      if (next_url === null || next_url === '') {
        have_more.value = false
        ElMessage({
          showClose: true,
          message: '已经没有数据咯~',
          type: 'warning',
          duration: 3000,
        })
        return false
      }

      Get(next_url, kwargs, false)
      .then((resp) => {
        let result = resp.data.results
        next_url = resp.data.next
        if (result.length < default_limit) have_more.value = false
        poetryList.value = poetryList.value.concat(result)

      })
      .catch((error) => {
        console.log(error);
        ElMessage({
          showClose: true,
          message: '刷新出错！',
          type: 'error',
          duration: 3000,
        })
      })
    }

    return {
      poetry_dynasty_options,
      poetry_dynasty_value,

      metric_options,
      metric_value,
      yan_options,
      yan_value,
      jue_options,
      jue_value,

      chapter_options,
      chapter_value,
      chapter_change,
      section_disable,
      section_options,
      section_value,
      section_change,
      title_disable,
      title_options,
      title_value,

      shici,
      author_input,
      title_input,
      content_input,

      poetryList,
      currentPage,
      pageSize,


      handleSizeChange,
      handleCurrentChange,
      poetry_search,
      handle_change,

      have_more,
      load,

      Search,
      User,
      Folder,
      Document,
    }
  }
}
</script>

<style lang="scss" scoped>

.el-row {
  margin-bottom: 10px;
}

.my-el-pagination {
  align-items: center; /*竖直居中*/
  justify-content: center; /*水平居中*/
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>