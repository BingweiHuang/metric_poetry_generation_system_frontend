<template>

  <div>

  </div>

</template>

<script lang="ts">
import { ref, onMounted } from 'vue'
import {instance} from "@/utils/utils";
import * as echarts from 'echarts';
import 'echarts-wordcloud';

export default {
  name: 'TestView',
  components: {
  },
  setup() {

    const bar_echart = ref()
    const pie_echart = ref()
    const pie2_echart = ref()
    const wc_echart = ref()
    
    let avi_l = [
      ['n', 's', 'nr', 'ns', 'nt', 'nl', 'ng', 'nz', 'm'], // 单字 多字
      ['v', 'vg', 'vd', 'vn', 'vf', 'vx', 'vi'], // 动词
      ['a', 'ag', 'ad', 'al', 'an'], // 形容词
      ['ns', 'nsf'], // 地名
    ]


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
          'dynasty': '唐代',
          'shici': 'shi',
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
          text: '唐诗作者产量'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // Use axis to trigger tooltip
            type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          // name: '诗数量',
          // min: 0,
          // max: 250,
          // position: 'left',
          axisLabel: {
            formatter: '{value}首'
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
          'author': '苏轼',
          'dynasty': '宋代',
          'num': 10,
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
          text: '作诗用韵',
          left: 'center',
          top: 'center'
        },
        tooltip: {
          // trigger: 'axis',
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
          axisPointer: {type: 'cross'}
        },
        legend: {
          top: '90%',
          left: 'center'
        },
        series: [
          {
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
          text: '诗作品种类',
          left: 'center',
          top: 'top'
        },
        legend: {
          top: '90%',
          left: 'center',
        },
        series: [
          {
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
            name: '诗分类',
            type: 'pie',
            radius: ['45%', '60%'],
            labelLine: {
              length: 30
            },
            label: {
              // formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
              formatter: ' {b|{b}：}{c}  {per|{d}%}  ',
              backgroundColor: '#F6F8FC',
              borderColor: '#8C8D8E',
              borderWidth: 1,
              borderRadius: 4,
              rich: {
                a: {
                  color: '#6E7079',
                  lineHeight: 22,
                  align: 'center'
                },
                hr: {
                  borderColor: '#8C8D8E',
                  width: '100%',
                  borderWidth: 1,
                  height: 0
                },
                b: {
                  color: '#4C5058',
                  fontSize: 14,
                  fontWeight: 'bold',
                  lineHeight: 33
                },
                per: {
                  color: '#fff',
                  backgroundColor: '#4C5058',
                  padding: [3, 4],
                  borderRadius: 4
                }
              }
            },
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
          'num': 50,
          'dynasty': 2,
          'phrase': avi_l[0].join(' '),
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
        title: {
          text: '词频词云',
          left: 'center',
          top: '5%'
        },
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
          sizeRange: [15, 90],
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
      bar_echart,
      pie_echart,
      pie2_echart,
      wc_echart,
    }
  },

}


</script>

<style>
.input-with-select .el-input-group__prepend {
  background-color: var(--el-fill-color-blank);
}
</style>