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
            children: [
              {
                value: 0,
                label: '绝句'
              },
              {
                value: 1,
                label: '律句'
              },
              {
                value: 2,
                label: '排律'
              },
              {
                value: 3,
                label: '不限'
              },
            ]
          },
          {
            value: 1,
            label: '宋朝',
            children: [
              {
                value: 0,
                label: '绝句'
              },
              {
                value: 1,
                label: '律句'
              },
              {
                value: 2,
                label: '排律'
              },
              {
                value: 3,
                label: '不限'
              },
            ]
          },
          {
            value: 2,
            label: '其他',
            children: [
              {
                value: 0,
                label: '绝句'
              },
              {
                value: 1,
                label: '律句'
              },
              {
                value: 2,
                label: '排律'
              },
              {
                value: 3,
                label: '不限'
              },
            ]
          },
          {
            value: 3,
            label: '不限',
            children: [
              {
                value: 0,
                label: '绝句'
              },
              {
                value: 1,
                label: '律句'
              },
              {
                value: 2,
                label: '排律'
              },
              {
                value: 3,
                label: '不限'
              },
            ]
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
        let jue = poetry_dynasty_value.value[2]
        if (jue !== 3) { // 如果选了诗体
          kwargs['jue'] = jue
          kwargs['rhyme_type'] = [1, 2]
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


    return {
      poetry_dynasty_options,
      poetry_dynasty_value,
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