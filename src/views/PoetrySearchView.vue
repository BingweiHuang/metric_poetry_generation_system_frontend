<template>

  <div>

    <div style="margin-bottom: 20px">

      <el-space wrap>
        <el-cascader size="large" v-model="poetry_dynasty_value" :options="poetry_dynasty_options" @change="handleChange"
                     style="width: 180px" placeholder="诗词和朝代" clearable/>
        <el-input size="large" v-model="author_input" style="width: 200px" placeholder="模糊搜索" clearable>
          <template #prefix>
            <el-icon class="el-input__icon"><User /></el-icon>
            <span>作者:</span>
          </template>
        </el-input >
        <el-input size="large" v-model="title_input" style="width: 200px" placeholder="模糊搜索" clearable>
          <template #prefix>
            <el-icon class="el-input__icon"><Folder /></el-icon>
            <span>标题:</span>
          </template>
        </el-input>
        <el-input size="large" v-model="content_input" style="width: 400px" placeholder="多关键词用空格隔开" clearable>
          <template #prefix>
            <el-icon class="el-input__icon"><Document /></el-icon>
            <span>内容:</span>
          </template>
        </el-input>
        <el-button size="large" :icon="Search" circle @click="poetry_search" />
      </el-space>
    </div>

    <div  v-if="poetry_dynasty_value && poetry_dynasty_value[0] === 0">
      <el-space style="justify-content: center; display: flex">

        <el-select v-model="yan_value" class="m-2" placeholder="Select" style="width: 150px">
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

        <el-select v-model="jue_value" class="m-2" placeholder="Select" style="width: 150px">
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

        <el-select v-model="qi_value" class="m-2" placeholder="Select" style="width: 150px">
          <template #prefix>
            <span>起调:</span>
          </template>
          <el-option
              v-for="item in qi_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>

        <el-select v-model="ru_value" class="m-2" placeholder="Select" style="width: 150px">
          <template #prefix>
            <span>入韵:</span>
          </template>
          <el-option
              v-for="item in ru_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"

          />
        </el-select>

        <el-button type="primary" @click="all_buxian">全不限</el-button>

      </el-space>
    </div>

    <el-space size="" wrap style="width: 100%; justify-content: center">
      <el-col v-for="poetry in poetryList.slice((currentPage - 1) * pageSize, currentPage * pageSize)" :key="poetry.id">

        <ShiCard :poetry="poetry" v-if="shici === 'shi'" />
        <CiCard :poetry="poetry" v-else-if="shici === 'ci'"/>
      </el-col>
      <div v-if="poetryList.length === 0" style="width: 100%;">
        <el-empty description="浅浅检索一下吧"/>
      </div>
    </el-space>

    <el-pagination
        class="my-el-pagination"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :pager-count="6"
        layout="total, prev, pager, next, jumper"
        :total="poetryList.length">
    </el-pagination>

  </div>



</template>

<script lang="ts">
import {ref} from "vue";
import {
  Check,
  Delete,
  Edit,
  Message,
  Search,
  User,
  Folder,
  Document,
  Star,
} from '@element-plus/icons-vue'
import ShiCard from "@/components/ShiCard.vue";
import CiCard from "@/components/CiCard.vue";
import {instance} from "@/utils/utils";
import {all} from "axios";
import {ElMessage} from "element-plus";
export default {
  name: "PoetrySearchView",
  components: {
    ShiCard,
    CiCard,
  },
  setup() {
    const poetry_dynasty_options = ref([
      {
        value: 0,
        label: '诗',
        children: [
          {
            value: 0,
            label: '唐朝',
          },
          {
            value: 1,
            label: '宋朝',
          },
          {
            value: 2,
            label: '其他',
          },
          {
            value: 3,
            label: '不限',
          },
        ]
      },
      {
        value: 1,
        label: '词',
        children: [
          {
            value: 0,
            label: '五代',
          },
          {
            value: 1,
            label: '宋朝',
          },
          {
            value: 2,
            label: '其他',
          },
          {
            value: 3,
            label: '不限',
          }
        ]
      },
    ])
    const poetry_dynasty_value = ref()

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
        label: '不限',
      },
    ])
    const yan_value = ref(0)

    const jue_options = ref([
      {
        value: 0,
        label: '绝句',
      },
      {
        value: 1,
        label: '律句',
      },
      {
        value: 2,
        label: '排律',
      },
      {
        value: 3,
        label: '不限',
      },
    ])
    const jue_value = ref(3)

    const qi_options = ref([
      {
        value: 1,
        label: '平起',
      },
      {
        value: 0,
        label: '仄起',
      },
      {
        value: 2,
        label: '不限',
      },
    ])
    const qi_value = ref(2)

    const ru_options = ref([
      {
        value: 0,
        label: '首句入韵',
      },
      {
        value: 1,
        label: '首句不入',
      },
      {
        value: 2,
        label: '不限',
      },
    ])
    const ru_value = ref(2)

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
        if (poetry_dynasty_value.value[0] === 0) {
          console.log(poetry_dynasty_value.value[2])
        }

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

      shici.value = poetry_dynasty_value.value[0] === 0 ? 'shi' : 'ci'
      let dynasty = poetry_dynasty_value.value[1]

      console.log(shici.value, dynasty)

      let query_url = shici.value // 需要发送axios请求的url
      
      if (dynasty === 0) {
        if (shici.value === 'shi') { // 唐诗
          query_url += '/tangshi'
        } else if (shici.value === 'ci') { // 五代词
          query_url += '/wudaici'
        }
      } else if (dynasty === 1) { // 宋朝
        query_url += '/song' + shici.value
      } else if (dynasty === 2) { // 其他朝代
        query_url += '/other' + shici.value
      } else if (dynasty === 3) { // 所有朝代
        query_url += '/all' + shici.value
      }

      poetryList.value = [];

      let kwargs: any = {};

      if (shici.value === 'shi') { // 如果选的是诗

        if (yan_value.value !== 0) { // 如果选了几言
          kwargs['yan'] = yan_value.value
        }

        if (jue_value.value !== 3) { // 如果选了绝律
          kwargs['jue'] = jue_value.value
        }

        if (qi_value.value !== 2) { // 如果选了起调
          kwargs['qi'] = qi_value.value
        }

        if (ru_value.value !== 2) { // 如果选了入韵
          kwargs['ru'] = ru_value.value
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

      // let all_poetryList:any = []

      let ret = await instance({
        url: query_url,
        method:'get',
        headers: {
          // 'Authorization': "Bearer " + store.state.user.access,
        },
        params: kwargs,
      })
      /*.then((resp) => {
        console.log(resp.data.poetryList);
        poetryList.value = resp.data.poetryList;
      })
      .catch((error) => {
        console.log(error);
      })*/

      if (ret.data.poetryList.length === 0) {
        ElMessage({
          message:'喏哦~ 没有符合条件的诗词喔~ 换个条件戏一下的喔',
          duration: 5000
        })
      }
      poetryList.value = ret.data.poetryList
    }

    const all_buxian = () => { // 所有格律诗筛选条件变成 不限
      yan_value.value = 0
      jue_value.value = 3
      qi_value.value = 2
      ru_value.value = 2
    }


    return {
      poetry_dynasty_options,
      poetry_dynasty_value,
      yan_options,
      yan_value,
      jue_options,
      jue_value,
      qi_options,
      qi_value,
      ru_options,
      ru_value,

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
      all_buxian,

      Search,
      User,
      Folder,
      Document,
    }
  }
}
</script>

<style lang="scss" scoped>
.my-el-pagination {
  align-items: center; /*竖直居中*/
  justify-content: center; /*水平居中*/
  margin-top: 20px;
}
</style>