<template>

  <div  ref="bar_echart" style="width:800px; height:500px;background-color: white;"></div>
  
  <div  ref="pie_echart" style="width:800px; height:500px;background-color: white;"></div>

</template>

<script lang="ts">
import { ref, onMounted } from 'vue'
import {instance} from "@/utils/utils";
import * as echarts from 'echarts';
import {useStore} from "vuex";

export default {
  name: 'TestView',
  components: {
  },
  setup() {

    // const test_echart = ref<HTMLElement | null>(null);
    /*(function() { // 自执行函数

    }());*/

    const bar_echart = ref()
    const pie_echart = ref()


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
          axisPointer: { type: 'cross' }
        },
        xAxis: {
          type: 'category',
          axisTick: {
            alignWithLabel: true
          },
          data: x_list
        },
        yAxis: [
          {
            type: 'value',
            name: '诗数量',
            // min: 0,
            // max: 250,
            position: 'left',
            axisLabel: {
              formatter: '{value}首'
            }
          },
        ],
        series: [
          {
            data: y1_list,
            type: 'bar',
            stack: '诗'
          },
          {
            data: y2_list,
            type: 'bar',
            stack: '诗'
          }
        ]
      });
      
    });

    onMounted(async() => {
      // let myEchartDiv = document.getElementById('test_echart')
      let res_list = []
      let x_list = []
      let y_list = []

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
          'mode': 1,
        },
      })
          .then((resp) => {
            console.log(resp.data.res_list)
            res_list = resp.data.res_list
            for (let i = 0; i < res_list.length; i++) {
              x_list.push(res_list[i][0])
              y_list.push(res_list[i][1])
            }

          })
          .catch((error) => {
            console.log(error);
          })

      const my_echart = echarts.init(pie_echart.value, 'white', {renderer: 'canvas'})

      my_echart.setOption({
        title: {
          text: '作诗用韵',
          left: 'center',
          top: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {type: 'cross'}
        },
        series: [
          {
            type: 'pie',
            /*data: [
              {
                value: 335,
                name: 'A'
              },
              {
                value: 234,
                name: 'B'
              },
              {
                value: 1548,
                name: 'C'
              }
            ],*/
            data: res_list,
            radius: ['40%', '70%']
          }
        ]

      });

    });
    return {
      bar_echart,
      pie_echart,
    }
  },

}


</script>

<style>
.input-with-select .el-input-group__prepend {
  background-color: var(--el-fill-color-blank);
}
</style>