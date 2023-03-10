<template>
  <div class="block text-center">

    <el-carousel height="350px" style="margin-bottom: 50px">
      <el-carousel-item v-for="item in 4" :key="item">
        <h3 class="small justify-center" text="2xl">{{ item }}</h3>
      </el-carousel-item>
    </el-carousel>

    <el-row justify="center" align="middle">
      <el-col :xl="4" :lg="4" :md="2" :sm="0" :xs="0">

      </el-col>

      <el-col :xl="16" :lg="16" :md="20" :sm="23" :xs="23">
        <el-row justify="center" align="middle" :gutter="0">

          <el-col :xl="7" :lg="7" :md="8" :sm="9" :xs="9">
            <el-select size="large" v-model="dynasty_value">
              <template #prefix>
                诗词:
              </template>
              <el-option
                  v-for="item in dynasty_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </el-col>
          <el-col :xl="7" :lg="7" :md="8" :sm="9" :xs="9">
            <el-input size="large" v-model="author_num" placeholder="5~20 " clearable>
              <template #prefix>
                人数:&nbsp;
              </template>
            </el-input >
          </el-col>


          <el-col :xl="2" :lg="2" :md="2" :sm="2" :xs="3">
            <el-button size="large" :icon="Search" @click="author_output_search" />
          </el-col>

        </el-row>
        <div  ref="bar_echart" style="width:100%; height:600px;background-color: white;"></div>

        <el-row justify="center" align="middle" :gutter="0" style="margin-bottom: 10px">

          <el-col :xl="7" :lg="7" :md="6" :sm="6" :xs="6">
            <el-select size="large" v-model="dynasty2_value" @change="dynasty2_change">
<!--              <template #prefix>诗:</template>-->
              <el-option
                  v-for="item in dynasty2_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </el-col>

          <el-col :xl="7" :lg="7" :md="6" :sm="6" :xs="6">
            <el-input size="large" v-model="author_input" placeholder="诗人" clearable>
            </el-input >
          </el-col>

          <el-col :xl="7" :lg="7" :md="6" :sm="6" :xs="6">
            <el-input size="large" v-model="rhyme_num" placeholder="显示韵脚数" clearable>
<!--              <template #prefix>
                韵脚数:
              </template>-->
            </el-input >
          </el-col>


          <el-col :xl="2" :lg="2" :md="2" :sm="2" :xs="3">
            <el-button size="large" :icon="Search" @click="poetry_statistics_search" />
          </el-col>

        </el-row>
        <div  ref="pie_echart" style="width:100%; height:400px;background-color: white;"></div>
        <div  ref="pie2_echart" style="width:100%; height:400px;background-color: white;"></div>

        <el-row justify="center" align="middle" :gutter="0" style="margin-bottom: 10px">

          <el-col :xl="7" :lg="7" :md="6" :sm="6" :xs="6">
            <el-select size="large" v-model="dynasty3_value">
<!--              <template #prefix>诗:</template>-->
              <el-option
                  v-for="item in dynasty3_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </el-col>

          <el-col :xl="7" :lg="7" :md="6" :sm="6" :xs="6">
            <el-select size="large" v-model="phrase_value">
<!--              <template #prefix>诗:</template>-->
              <el-option
                  v-for="item in phrase_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </el-col>

          <el-col :xl="7" :lg="7" :md="6" :sm="6" :xs="6">
            <el-select size="large" v-model="word_num_value">
<!--              <template #prefix>诗:</template>-->
              <el-option
                  v-for="item in word_num_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </el-col>

          <el-col :xl="2" :lg="2" :md="2" :sm="2" :xs="3">
            <el-button size="large" :icon="Search" @click="word_frequency_search" />
          </el-col>

        </el-row>
        <div  ref="wc_echart" style="width:100%; height:600px;background-color: white; margin-bottom: 20px"></div>

        <el-row justify="center" align="middle" :gutter="0" style="margin-bottom: 10px">

          <el-col :xl="7" :lg="7" :md="6" :sm="6" :xs="6">
            <el-select size="large" v-model="dynasty4_value" @change="dynasty4_change">
              <!--              <template #prefix>诗:</template>-->
              <el-option
                  v-for="item in dynasty4_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </el-col>

          <el-col :xl="7" :lg="7" :md="6" :sm="6" :xs="6">
            <el-input size="large" v-model="author2_input" placeholder="词人" clearable>
            </el-input >
          </el-col>

          <el-col :xl="7" :lg="7" :md="6" :sm="6" :xs="6">
            <el-select size="large" v-model="rhythmic_num_value">
              <!--              <template #prefix>诗:</template>-->
              <el-option
                  v-for="item in rhythmic_num_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </el-col>

          <el-col :xl="2" :lg="2" :md="2" :sm="2" :xs="3">
            <el-button size="large" :icon="Search" @click="rhythmic_statistics_search" />
          </el-col>

        </el-row>
        <div  ref="wc2_echart" style="width:100%; height:600px;background-color: white; margin-bottom: 20px"></div>

      </el-col>

      <el-col :xl="4" :lg="4" :md="2" :sm="0" :xs="0">

      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import NavBar from '@/components/NavBar.vue';
import {onMounted, ref} from "vue";
import {instance} from "@/utils/utils";
import * as echarts from "echarts"; // @ is an alias to /src
import {
  Search,
  User,
  Folder,
  Document,
} from '@element-plus/icons-vue'
import {ElMessage} from "element-plus";

export default {
  name: 'HomeView',
  components: {
  },
  setup() {

    const reserved_chinese_word = (text:string) => {
      if (text === '') return '';
      let regEx = /[^\u4e00-\u9fa5\uf900-\ufa2d]/g;
      return text.replace(regEx, '');
    }

    const dynasty_options = ref([
      {
        value: '唐诗',
        label: '唐诗',
      },
      {
        value: '宋词',
        label: '宋词',
      },
      {
        value: '宋诗',
        label: '宋诗',
      },
    ])
    const dynasty_value = ref('唐诗')
    const search_dynasty_value = ref('唐诗')
    const author_num = ref(10)
    const bar_echart = ref()
    const author_output_search = async() => {
      let num = Number(author_num.value);
      if (!(num >= 5 && num <= 20)) {
        ElMessage({
          showClose: true,
          message: '请输入人数[5,20]',
          type: 'error',
          duration: 5000,
        })
        return false
      }

      search_dynasty_value.value = dynasty_value.value
      let x_list = []
      let y1_list = []
      let y2_list = []
      await instance({
        url: 'analyze/author_output',
        method:'get',
        headers: {
          // 'Authorization': "Bearer " + store.state.user.access,
        },
        params: {
          'num': author_num.value,
          'dynasty': dynasty_value.value,
        },
      })
      .then((resp) => {
        console.log(resp.data.res_list)
        let res_list = resp.data.res_list
        for (let i = 0; i < res_list[0].length; i ++) {
          x_list.push(res_list[0][i][0])
          y1_list.push(res_list[0][i][1])
          y2_list.push(res_list[1][i][1])
        }
      })
      .catch((error) => {
        console.log(error);
      })

      const my_echart = echarts.init(bar_echart.value, 'white', {renderer: 'canvas'})

      my_echart.setOption({
        title: {
          text: search_dynasty_value.value + '作者产量',
          left: 'center',
          top: '3%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // Use axis to trigger tooltip
            type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
          }
        },
        grid: {
          // left: '1%',
          // right: '4%',
          // bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          // name: '诗数量',
          // min: 0,
          // max: 250,
          // position: 'left',
          axisLabel: {
            formatter: '{value}'
          }
        },
        yAxis: [
          {
            type: 'category',
            // axisTick: {
            //   alignWithLabel: true
            // },
            axisLabel: {
              interval: 0,
              rotate: 30
            },
            data: x_list
          },
        ],
        series: [
          {
            name: search_dynasty_value.value === '宋词' ?  '完整词作' : '近体诗',
            data: y1_list,
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
          },
          {
            name: search_dynasty_value.value === '宋词' ?  '缺字词作' : '古体诗',
            data: y2_list,
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
          }
        ]
      });

    }


    const dynasty2_options = ref([
      {
        value: '唐代',
        label: '唐代',
      },
      {
        value: '宋代',
        label: '宋代',
      },
      {
        value: '近现代',
        label: '毛泽东',
      },
    ])
    const dynasty2_value = ref('近现代')
    const author_input = ref('')
    const search_value = ref('毛泽东')
    const rhyme_num = ref(10)
    const pie_echart = ref()
    const pie2_echart = ref()

    const dynasty2_change = () => {
      if (dynasty2_value.value === '近现代') {
        author_input.value = '毛泽东'
      } else {
        author_input.value = ''
      }
    }
    const poetry_statistics_search = async() => {
      let num = Number(rhyme_num.value);
      if (!(num >= 5 && num <= 15)) {
        ElMessage({
          showClose: true,
          message: '请输入韵脚数[5，15]',
          type: 'error',
          duration: 5000,
        })
        return false
      }
      let kwargs: any = {};
      kwargs['rhyme_num'] = num


      let author = reserved_chinese_word(author_input.value)
      if (author !== author_input.value) {
        ElMessage({
          showClose: true,
          message: '非汉字部分不识别哦~',
          type: 'warning',
          duration: 5000,
        })
      }

      kwargs['dynasty'] = dynasty2_value.value
      if (dynasty2_value.value === '近现代') {
        search_value.value = '毛泽东'
        kwargs['author'] = '毛泽东'
      } else {
        if (author !== '') {
          kwargs['author'] = author
          search_value.value = author
        } else {
          search_value.value = dynasty2_value.value
        }
      }

      let res_list = []
      await instance({
        // /analyze/poetry_statistics?author=苏轼&dynasty=宋代&num=10&mode=1
        url: 'analyze/poetry_statistics',
        method: 'get',
        headers: {
          // 'Authorization': "Bearer " + store.state.user.access,
        },
        params: kwargs,
      })
      .then((resp) => {
        console.log(resp.data.res_list)
        res_list = resp.data.res_list
      })
      .catch((error) => {
        console.log(error);
      })

      if (res_list[0][0]['value'] === 0 && res_list[0][1]['value'] === 0) {
        ElMessage({
          message:'喏哦~ 诗人不存在的喔~ 换个人戏一下的喔',
          duration: 5000
        })
        return false
      }

      const my_echart = echarts.init(pie_echart.value, 'white', {renderer: 'canvas'})

      const my_echart2 = echarts.init(pie2_echart.value, 'white', {renderer: 'canvas'})

      my_echart.setOption({
        title: {
          text: search_value.value + '诗作用韵',
          left: 'center',
          top: '37%'
        },
        tooltip: {
          // trigger: 'axis',
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
          axisPointer: {type: 'cross'}
        },
        legend: {
          top: '80%',
          left: 'center'
        },
        series: [
          {
            left: 'center',
            top: 'center',
            width: '100%',
            height: '100%',
            center: ['50%', '40%'],
            name: '用韵偏好',
            type: 'pie',
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            data: res_list[1],
            radius: ['40%', '70%']
          }
        ]

      });

      my_echart2.setOption( {
        title: {
          text: search_value.value + '诗作种类',
          left: 'center',
          top: '1%'
        },
        tooltip: {
          // trigger: 'axis',
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
          axisPointer: {type: 'cross'}
        },
        legend: {
          top: '80%',
          left: 'center',
          data: [
            '古体诗',
            '七言绝句',
            '七言律诗',
            '七言排律',
            '五言绝句',
            '五言律诗',
            '五言排律',
          ]
        },
        series: [
          {
            left: 'center',
            top: 'center',
            width: '100%',
            height: '100%',
            center: ['50%', '45%'],
            name: '诗种类',
            type: 'pie',
            // selectedMode: 'single',
            radius: [0, '30%'],
            label: {
              position: 'inner',
              fontSize: 14
            },
            labelLine: {
              show: false
            },
            data: res_list[0]
          },
          {
            left: 'center',
            top: 'center',
            width: '100%',
            height: '100%',
            center: ['50%', '45%'],
            name: '诗种类',
            type: 'pie',
            radius: ['45%', '60%'],
            labelLine: {
              length: 20
            },
            data: res_list[2]
          }
        ]
      });

    }


    const dynasty3_options = ref([
      {
        value: 0,
        label: '毛泽东诗词',
      },
      {
        value: 1,
        label: '纳兰性德词',
      },
      {
        value: 2,
        label: '宋词',
      },
      {
        value: 3,
        label: '五代词',
      },
      {
        value: 4,
        label: '宋诗',
      },
      {
        value: 5,
        label: '唐诗',
      },
      {
        value: -1,
        label: '不限',
      },
    ])
    const dynasty3_value = ref(0)
    const phrase_options = ref([
      {
        value: 0,
        label: '单字',
      },
      {
        value: 1,
        label: '多字',
      },
      {
        value: 2,
        label: '动词',
      },
      {
        value: 3,
        label: '形容词',
      },
      {
        value: 4,
        label: '地名',
      },
      {
        value: -1,
        label: '不限',
      },
    ])
    const phrase_value = ref(1)
    const word_num_options = ref([
      {
        value: 50,
        label: 50,
      },
      {
        value: 100,
        label: 100,
      },
      {
        value: 150,
        label: 150,
      },
      {
        value: 200,
        label: 200,
      },
    ])
    const word_num_value = ref(200)
    const wc_echart = ref()

    let avi_l = [
      ['n', 's', 'nr', 'ns', 'nt', 'nl', 'ng', 'nz', 'm'], // 单字 多字
      ['n', 's', 'nr', 'ns', 'nt', 'nl', 'ng', 'nz', 'm'], // 单字 多字
      ['v', 'vg', 'vd', 'vn', 'vf', 'vx', 'vi'], // 动词
      ['a', 'ag', 'ad', 'al', 'an'], // 形容词
      ['ns', 'nsf'], // 地名
    ]

    const word_frequency_search = async() => {
      let word_list = []
      let kwargs: any = {};
      if (phrase_value.value !== -1) {
        kwargs['phrase'] = avi_l[phrase_value.value].join(' ')
      }
      kwargs['num'] = word_num_value.value
      if (dynasty3_value.value !== -1) {
        kwargs['dynasty'] = dynasty3_value.value
      }
      if (phrase_value.value === 0) kwargs['word_len'] = 1
      else if (phrase_value.value === 1) kwargs['word_len'] = 2

      await instance({
        // /analyze/poetry_statistics?author=苏轼&dynasty=宋代&num=10&mode=1
        url: 'analyze/word_frequency',
        method: 'get',
        headers: {
          // 'Authorization': "Bearer " + store.state.user.access,
        },
        params: kwargs,
      })
      .then((resp) => {
        console.log(resp.data.word_list)
        word_list = resp.data.word_list
      })
      .catch((error) => {
        console.log(error);
      })

      console.log('word_list',word_list)
      const my_echart = echarts.init(wc_echart.value, 'white', {renderer: 'canvas'})

      my_echart.setOption({
        /*title: {
          text: '词频词云',
          left: '0%',
          top: '0%'
        },*/
        tooltip: {
          // trigger: 'axis',
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c}',
          axisPointer: {type: 'cross'}
        },
        series: [{
          name: '用词频率',
          type: 'wordCloud',
          //maskImage: maskImage,
          sizeRange: [13, 80],
          rotationRange: [-90, 90],
          rotationStep: 45,
          gridSize: 8,
          shape: 'circle',
          // shape: 'pentagon',
          left: 'center',
          top: 'center',
          width: '100%',
          height: '100%',

          // set to true to allow word being draw partly outside of the canvas.
          // Allow word bigger than the size of the canvas to be drawn
          drawOutOfBound: false,

          // if the font size is too large for the text to be displayed,
          // whether to shrink the text. If it is set to false, the text will
          // not be rendered. If it is set to true, the text will be shrinked.
          shrinkToFit: false,

          // If perform layout animation.
          // NOTE disable it will lead to UI blocking when there is lots of words.
          layoutAnimation: true,

          textStyle: {
            // normal: {},
            color: function () {
              return 'rgb(' + [
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160)
              ].join(',') + ')';
            },
            fontFamily: 'sans-serif',
            fontWeight: 'normal'
          },
          emphasis: {
            shadowBlur: 10,
            shadowColor: '#333'
          },
          data: word_list
        }]

      });

    }

    const dynasty4_options = ref([
      {
        value: '五代',
        label: '五代',
      },
      {
        value: '宋代',
        label: '宋代',
      },
      {
        value: '近现代',
        label: '毛泽东',
      },
      {
        value: '清代',
        label: '纳兰性德',
      },
    ])
    const dynasty4_value = ref('近现代')
    const author2_input = ref('毛泽东')
    const rhythmic_num_options = ref([
      {
        value: 20,
        label: 20,
      },
      {
        value: 50,
        label: 50,
      },
      {
        value: 80,
        label: 80,
      },
      {
        value: 100,
        label: 100,
      },
      {
        value: 150,
        label: 150,
      },
    ])
    const rhythmic_num_value = ref(150)
    const wc2_echart = ref()


    const dynasty4_change = () => {
      if (dynasty4_value.value === '近现代') {
        author2_input.value = '毛泽东'
      } else if (dynasty4_value.value === '清代') {
        author2_input.value = '纳兰性德'
      } else {
        author2_input.value = ''
      }
    }
    const rhythmic_statistics_search = async() => {
      let word_list = []
      let kwargs: any = {};
      let author = reserved_chinese_word(author2_input.value)
      if (author !== author2_input.value) {
        ElMessage({
          showClose: true,
          message: '非汉字部分不识别哦~',
          type: 'warning',
          duration: 5000,
        })
      }

      kwargs['num'] = rhythmic_num_value.value
      kwargs['dynasty'] = dynasty4_value.value
      if (dynasty4_value.value === '近现代') {
        kwargs['author'] = '毛泽东'
      } else if (dynasty4_value.value === '清代') {
        kwargs['author'] = '纳兰性德'
      } else if (author !== '') {
        kwargs['author'] = author
      }

      await instance({
        // /analyze/rhythmic_statistics?author=苏轼&dynasty=宋代&num=10
        url: 'analyze/rhythmic_statistics',
        method: 'get',
        headers: {
          // 'Authorization': "Bearer " + store.state.user.access,
        },
        params: kwargs,
      })
      .then((resp) => {
        console.log(resp.data.word_list)
        word_list = resp.data.word_list
      })
      .catch((error) => {
        console.log(error);
      })

      if (word_list.length === 0) {
        ElMessage({
          message:'喏哦~ 词人不存在的喔~ 换个人戏一下的喔',
          duration: 5000
        })
        return false
      }

      const my_echart = echarts.init(wc2_echart.value, 'white', {renderer: 'canvas'})

      my_echart.setOption({
        /*title: {
          text: '词频词云',
          left: '0%',
          top: '0%'
        },*/
        tooltip: {
          // trigger: 'axis',
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c}',
          axisPointer: {type: 'cross'}
        },
        series: [{
          name: '用词频率',
          type: 'wordCloud',
          //maskImage: maskImage,
          sizeRange: [13, 65],
          rotationRange: [-90, 90],
          rotationStep: 45,
          gridSize: 8,
          shape: 'circle',
          // shape: 'pentagon',
          left: 'center',
          top: 'center',
          width: '100%',
          height: '100%',

          // set to true to allow word being draw partly outside of the canvas.
          // Allow word bigger than the size of the canvas to be drawn
          drawOutOfBound: false,

          // if the font size is too large for the text to be displayed,
          // whether to shrink the text. If it is set to false, the text will
          // not be rendered. If it is set to true, the text will be shrinked.
          shrinkToFit: false,

          // If perform layout animation.
          // NOTE disable it will lead to UI blocking when there is lots of words.
          layoutAnimation: true,

          textStyle: {
            // normal: {},
            color: function () {
              return 'rgb(' + [
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160)
              ].join(',') + ')';
            },
            fontFamily: 'sans-serif',
            fontWeight: 'normal'
          },
          emphasis: {
            shadowBlur: 10,
            shadowColor: '#333'
          },
          data: word_list
        }]

      });

    }


    onMounted(async() => {
      let x_list = []
      let y1_list = []
      let y2_list = []
      await instance({
        url: 'analyze/author_output',
        method:'get',
        headers: {
          // 'Authorization': "Bearer " + store.state.user.access,
        },
        params: {
          'num': 10,
          'dynasty': '唐诗',
        },
      })
      .then((resp) => {
        console.log(resp.data.res_list)
        let res_list = resp.data.res_list
        for (let i = 0; i < res_list[0].length; i ++) {
          x_list.push(res_list[0][i][0])
          y1_list.push(res_list[0][i][1])
          y2_list.push(res_list[1][i][1])
        }
      })
      .catch((error) => {
        console.log(error);
      })

      const my_echart = echarts.init(bar_echart.value, 'white', {renderer: 'canvas'})

      my_echart.setOption({
        title: {
          text: '唐诗作者产量',
          left: 'center',
          top: '3%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // Use axis to trigger tooltip
            type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
          }
        },
        grid: {
          left: '1%',
          // right: '4%',
          // bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          // name: '诗数量',
          // min: 0,
          // max: 250,
          // position: 'left',
          axisLabel: {
            formatter: '{value}'
          }
        },
        yAxis: [
          {
            type: 'category',
            // axisTick: {
            //   alignWithLabel: true
            // },
            axisLabel: {
              interval: 0,
              rotate: 30
            },
            data: x_list
          },
        ],
        series: [
          {
            name: '近体诗',
            data: y1_list,
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
          },
          {
            name: '古体诗',
            data: y2_list,
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
          }
        ]
      });

    });

    onMounted(async() => {
      // let myEchartDiv = document.getElementById('test_echart')
      let res_list = []

      await instance({
        // /analyze/poetry_statistics?author=苏轼&dynasty=宋代&num=10&mode=1
        url: 'analyze/poetry_statistics',
        method: 'get',
        headers: {
          // 'Authorization': "Bearer " + store.state.user.access,
        },
        params: {
          'author': '毛泽东',
          'dynasty': '近现代',
          'rhyme_num': 10,
          // 'mode': 1,
        },
      })
      .then((resp) => {
        console.log(resp.data.res_list)
        res_list = resp.data.res_list
      })
      .catch((error) => {
        console.log(error);
      })

      const my_echart = echarts.init(pie_echart.value, 'white', {renderer: 'canvas'})

      const my_echart2 = echarts.init(pie2_echart.value, 'white', {renderer: 'canvas'})

      my_echart.setOption({
        title: {
          text: '毛泽东诗作用韵',
          left: 'center',
          top: '37%'
        },
        tooltip: {
          // trigger: 'axis',
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
          axisPointer: {type: 'cross'}
        },
        legend: {
          top: '80%',
          left: 'center'
        },
        series: [
          {
            left: 'center',
            top: 'center',
            width: '100%',
            height: '100%',
            center: ['50%', '40%'],
            name: '用韵偏好',
            type: 'pie',
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            data: res_list[1],
            radius: ['40%', '70%']
          }
        ]

      });

      my_echart2.setOption( {
        title: {
          text: '毛泽东诗作种类',
          left: 'center',
          top: '1%'
        },
        tooltip: {
          // trigger: 'axis',
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
          axisPointer: {type: 'cross'}
        },
        legend: {
          top: '80%',
          left: 'center',
          data: [
              '古体诗',
              '七言绝句',
              '七言律诗',
              '七言排律',
              '五言绝句',
              '五言律诗',
              '五言排律',
          ]
        },
        series: [
          {
            left: 'center',
            top: 'center',
            width: '100%',
            height: '100%',
            center: ['50%', '45%'],
            name: '诗分类',
            type: 'pie',
            // selectedMode: 'single',
            radius: [0, '30%'],
            label: {
              position: 'inner',
              fontSize: 14
            },
            labelLine: {
              show: false
            },
            data: res_list[0]
          },
          {
            left: 'center',
            top: 'center',
            width: '100%',
            height: '100%',
            center: ['50%', '45%'],
            name: '诗分类',
            type: 'pie',
            radius: ['45%', '60%'],
            labelLine: {
              length: 20
            },
            // label: {
            //   // formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
            //   formatter: ' {b|{b}：}{c}  {per|{d}%}  ',
            //   backgroundColor: '#F6F8FC',
            //   borderColor: '#8C8D8E',
            //   borderWidth: 1,
            //   borderRadius: 4,
            //   rich: {
            //     a: {
            //       color: '#6E7079',
            //       lineHeight: 22,
            //       align: 'center'
            //     },
            //     hr: {
            //       borderColor: '#8C8D8E',
            //       width: '100%',
            //       borderWidth: 1,
            //       height: 0
            //     },
            //     b: {
            //       color: '#4C5058',
            //       fontSize: 14,
            //       fontWeight: 'bold',
            //       lineHeight: 33
            //     },
            //     per: {
            //       color: '#fff',
            //       backgroundColor: '#4C5058',
            //       padding: [3, 4],
            //       borderRadius: 4
            //     }
            //   }
            // },
            data: res_list[2]
          }
        ]
      });

    });

    onMounted(async() => {
      let word_list = []

      await instance({
        // /analyze/poetry_statistics?author=苏轼&dynasty=宋代&num=10&mode=1
        url: 'analyze/word_frequency',
        method: 'get',
        headers: {
          // 'Authorization': "Bearer " + store.state.user.access,
        },
        params: {
          'num': 200,
          'dynasty': 0,
          'phrase': avi_l[1].join(' '),
          'word_len': 2,
        },
      })
          .then((resp) => {
            console.log(resp.data.word_list)
            word_list = resp.data.word_list
          })
          .catch((error) => {
            console.log(error);
          })

      console.log('word_list',word_list)
      const my_echart = echarts.init(wc_echart.value, 'white', {renderer: 'canvas'})

      my_echart.setOption({
        /*title: {
          text: '词频词云',
          left: '0%',
          top: '0%'
        },*/
        tooltip: {
          // trigger: 'axis',
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c}',
          axisPointer: {type: 'cross'}
        },
        series: [{
          name: '用词频率',
          type: 'wordCloud',
          //maskImage: maskImage,
          sizeRange: [13, 80],
          rotationRange: [-90, 90],
          rotationStep: 45,
          gridSize: 8,
          shape: 'circle',
          // shape: 'pentagon',
          left: 'center',
          top: 'center',
          width: '100%',
          height: '100%',

          // set to true to allow word being draw partly outside of the canvas.
          // Allow word bigger than the size of the canvas to be drawn
          drawOutOfBound: false,

          // if the font size is too large for the text to be displayed,
          // whether to shrink the text. If it is set to false, the text will
          // not be rendered. If it is set to true, the text will be shrinked.
          shrinkToFit: false,

          // If perform layout animation.
          // NOTE disable it will lead to UI blocking when there is lots of words.
          layoutAnimation: true,

          textStyle: {
            // normal: {},
            color: function () {
              return 'rgb(' + [
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160)
              ].join(',') + ')';
            },
            fontFamily: 'sans-serif',
            fontWeight: 'normal'
          },
          emphasis: {
            shadowBlur: 10,
            shadowColor: '#333'
          },
          data: word_list
        }]

      });

    });

    return {
      dynasty_options,
      dynasty_value,
      author_num,
      bar_echart,
      author_output_search,

      dynasty2_options,
      dynasty2_value,
      author_input,
      rhyme_num,
      pie_echart,
      pie2_echart,
      dynasty2_change,
      poetry_statistics_search,

      dynasty3_options,
      dynasty3_value,
      phrase_options,
      phrase_value,
      word_num_options,
      word_num_value,
      wc_echart,
      word_frequency_search,

      dynasty4_options,
      dynasty4_value,
      author2_input,
      rhythmic_num_options,
      rhythmic_num_value,
      wc2_echart,
      dynasty4_change,
      rhythmic_statistics_search,


      Search,
    }
  },

}
</script>

<style lang="scss">

.home {
  height: 1000px;
}

.demonstration {
  color: var(--el-text-color-secondary);
}

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

</style>
