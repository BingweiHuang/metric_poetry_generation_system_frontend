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
            <el-cascader size="large" v-model="poetry_dynasty_value" :options="poetry_dynasty_options" @change="handleChange"
                         placeholder="诗词和朝代" clearable/>
          </el-col>

          <el-col :span="8">
            <el-input size="large" v-model="author_input" placeholder="作者" clearable>

            </el-input >
          </el-col>

          <el-col :span="8">
            <el-input size="large" v-model="title_input" placeholder="诗名，词牌" clearable>
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

        <!-- 检索条件3（诗） -->
        <div  v-if="poetry_dynasty_value && poetry_dynasty_value[0] === 'shi'">

          <el-row justify="center" align="middle" :gutter="0">

            <el-col :span="8">
              <el-select v-model="metric_value" class="m-2" placeholder="Select">
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
              <el-select v-model="yan_value" class="m-2" placeholder="Select">
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
              <el-select v-model="jue_value" class="m-2" placeholder="Select">
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
      </el-col>

      <el-col :xl="2" :lg="2" :md="2" :sm="2" :xs="0">

      </el-col>
    </el-row>

    <!-- 检索结果展示栏 -->
    <div style="min-height: 600px">
      <el-space size="" wrap style="width: 100%; justify-content: center;">
        <template v-for="poetry in poetryList.slice((currentPage - 1) * pageSize, currentPage * pageSize)" :key="poetry.id">
          <ShiCard :poetry="poetry" v-if="shici === 'shi'" />
          <CiCard :poetry="poetry" v-else-if="shici === 'ci'"/>
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
import {instance} from "@/utils/utils";
import {ElMessage} from "element-plus";
import {Get} from "@/utils/request";
export default {
  name: "PoetrySearchView",
  components: {
    ShiCard,
    CiCard,
  },
  setup() {
    const poetry_dynasty_options = ref([
      {
        value: 'shi',
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
        value: 'ci',
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
    ])
    const poetry_dynasty_value = ref()

    const metric_options = ref([
      {
        value: 0,
        label: '古体诗',
      },
      {
        value: 1,
        label: '近体诗',
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

    const shici = ref('')
    const author_input = ref('')
    const title_input = ref('')
    const content_input = ref('')

    let poetryList = ref([])
    const currentPage = ref(1);
    const pageSize = ref(12);



    const handleChange = () => {
      if (poetry_dynasty_value.value) {
        console.log(poetry_dynasty_value.value[0])
        console.log(poetry_dynasty_value.value[1])
      }
    }

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
    let idx = 0
    let query_url = ''
    const poetry_search = async () => {
      if (!poetry_dynasty_value.value) {
        ElMessage({
          showClose: true,
          message: '请选择诗词和朝代',
          type: 'error',
          duration: 5000,
        })
        return false
      }

      shici.value = poetry_dynasty_value.value[0]
      const dynasty = poetry_dynasty_value.value[1]

      query_url = "poetry/" + shici.value // 需要发送axios请求的url
      kwargs = {};
      idx = 0
      kwargs['idx'] = idx

      if (dynasty === '三百首') {
        kwargs['three_hundred'] = 1
      } else if (dynasty !== '不限朝代') {
        kwargs['dynasty'] = dynasty
      }

      poetryList.value = [];


      if (shici.value === 'shi') { // 如果选的是诗

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


      let ret = await Get(query_url, kwargs, false)

      if (ret.data.poetryList.length === 0) {
        ElMessage({
          message:'喏哦~ 没有符合条件的诗词喔~ 换个条件戏一下的喔',
          duration: 5000
        })
      }
      poetryList.value = ret.data.poetryList
      console.log(ret.data.poetryList)
    }

    const have_more = ref(true)

    const load = () => {
      console.log('触发load')
      kwargs['idx'] = kwargs['idx'] + 1 // 下一页
      Get(query_url, kwargs, false)
      .then((resp) => {
        let result = resp.data.poetryList
        console.log('result:', result)
        if (result.length === 0) {
          have_more.value = false
          ElMessage({
            showClose: true,
            message: '已经没有数据咯~',
            type: 'warning',
            duration: 5000,
          })
        } else {
          poetryList.value = poetryList.value.concat(result)
        }
      })
      .catch((error) => {
        console.log(error);
        ElMessage({
          showClose: true,
          message: '刷新出错！',
          type: 'error',
          duration: 5000,
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

      shici,
      author_input,
      title_input,
      content_input,

      poetryList,
      currentPage,
      pageSize,



      handleSizeChange,
      handleCurrentChange,
      handleChange,
      poetry_search,

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