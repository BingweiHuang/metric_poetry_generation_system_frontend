<template>

  <el-row justify="center" align="middle">
    <el-col :xl="2" :lg="2" :md="2" :sm="1" :xs="0">

    </el-col>
    <!-- 主体页面 -->
    <el-col :xl="20" :lg="20" :md="20" :sm="22" :xs="24">

      <!-- 检索条件1 -->
      <el-row justify="center" align="middle">

        <el-col :xl="11" :lg="11" :md="11" :sm="11" :xs="10">
          <el-input size="large" v-model="have_input" placeholder="含有(如有多关键字)" clearable>
<!--            <template #prefix>含:</template>-->
          </el-input >
        </el-col>

        <el-col :xl="11" :lg="11" :md="11" :sm="11" :xs="10">
          <el-input size="large" v-model="no_have_input" placeholder="不含(用空格隔开)" clearable>
<!--            <template #prefix>不含:</template>-->
          </el-input>
        </el-col>

        <el-col :xl="2" :lg="2" :md="2" :sm="2" :xs="3">
          <el-button size="large" :icon="Search" @click="poetry_search" />
        </el-col>

      </el-row>


      <el-row justify="center" align="middle" style="margin-bottom: 10px">
        <el-col :xl="8" :lg="8" :md="8" :sm="8" :xs="8">
          <el-select size="large" v-model="belong_value" @change="handleChange">
            <template #prefix>
              含有:
            </template>
            <el-option
                v-for="item in belong_options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-col>

        <el-col :xl="8" :lg="8" :md="8" :sm="8" :xs="8">
          <el-select size="large" v-model="not_belong_value" @change="handleChange">
            <template #prefix>
              不含:
            </template>
            <el-option
                v-for="item in not_belong_options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :xl="8" :lg="8" :md="8" :sm="8" :xs="8">
          <el-select size="large" v-model="poetry_value" @change="handleChange">
            <template #prefix>
              诗词:
            </template>
            <el-option
                v-for="item in poetry_options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-col>


      </el-row>

<!--      &lt;!&ndash; 检索条件2 &ndash;&gt;
      <el-row justify="center" align="middle">
        <el-col :xl="10" :lg="10" :md="10" :sm="11" :xs="12">
          <el-select size="large" v-model="belong_value" @change="handleChange">
            <template #prefix>
              含有:
            </template>
            <el-option
                v-for="item in belong_options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-col>

        <el-col :xl="10" :lg="10" :md="10" :sm="11" :xs="12">
          <el-select size="large" v-model="not_belong_value" @change="handleChange">
            <template #prefix>
              不含:
            </template>
            <el-option
                v-for="item in not_belong_options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-col>

      </el-row>

      &lt;!&ndash; 检索条件3 &ndash;&gt;
      <el-row justify="center" align="middle" style="margin-bottom: 10px">

        <el-col :xl="10" :lg="10" :md="10" :sm="11" :xs="12">
          <el-select size="large" v-model="poetry_value" @change="handleChange">
            <template #prefix>
              诗词:
            </template>
            <el-option
                v-for="item in poetry_options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :xl="10" :lg="10" :md="10" :sm="11" :xs="12">
          <el-button size="large" :icon="Search" @click="poetry_search" />
        </el-col>

      </el-row>-->

      <!-- 展示栏（如果没有搜索结果） -->
      <div v-if="flyList.length === 0" style="width: 100%;">
        <el-empty description="浅浅检索一下吧"/>
      </div>

      <!-- 展示栏（有搜索结果） -->
      <template v-else>

        <!-- 无限滑动 结果展示 -->
        <ul v-infinite-scroll="load" infinite-scroll-distance="1" class="infinite-list" style="overflow: auto; height: 600px" always>
          <li v-for="(item, index) in flyList" :key="index">
            <p  class="scrollbar-demo-item-shi" v-if="Object.keys(item).includes('title')">
              <!--            {{ item.content }} - {{item.author}} <span class="sheng_lue">《{{item.title}}》</span>-->
              {{index + 1}}.{{ item.content }}- {{item.author}} 《<template v-for="(word, index2) in item.title.slice(0,7)" :key="index + index2">{{word}}</template><template v-if="item.title.length > 7">...</template>》
            </p>
            <p  class="scrollbar-demo-item-ci" v-else>
              {{index + 1}}.{{ item.content }}- {{item.author}} 《{{item.rhythmic.split('·')[0]}}》
            </p>
          </li>
        </ul>

      </template>

    </el-col>

    <el-col :xl="2" :lg="2" :md="2" :sm="1" :xs="0">

    </el-col>
  </el-row>

</template>

<script lang="ts">
import {onMounted, ref} from "vue";
import { ElScrollbar } from 'element-plus'
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
  name: "FlyingOrderView",
  components: {
    // ShiCard,
    // CiCard,
  },
  setup() {

    let next_url = ''
    let kwargs
    let default_limit = 24; // 一页多少条数据

    const have_input = ref('')
    let search_have_list = []
    const no_have_input = ref('')
    let search_no_have_list = []

    const poetry_options = ref([
      {
        value: 0,
        label: '诗',
      },
      {
        value: 1,
        label: '词',
      },
      {
        value: -1,
        label: '不限',
      },
    ])
    const poetry_value = ref(-1)
    let search_poetry_value = -1

    const belong_options = ref([
      {
        value: 'bu_xian',
        label: '不限',
      },
      {
        value: 'fly_number',
        label: '数字',
      },
      {
        value: 'fly_season',
        label: '季节',
      },
      {
        value: 'fly_position',
        label: '方位',
      },
      {
        value: 'fly_weather',
        label: '天气',
      },
      {
        value: 'fly_color',
        label: '颜色',
      },
      {
        value: 'fly_wine_vessel',
        label: '酒器',
      },
      {
        value: 'fly_reduplicate',
        label: '叠词',
      },
    ])
    const belong_value = ref('bu_xian')
    let search_belong_value = 'bu_xian'

    const not_belong_options = ref([
      {
        value: 'bu_xian',
        label: '不限',
      },
      {
        value: 'fly_number',
        label: '数字',
      },
      {
        value: 'fly_season',
        label: '季节',
      },
      {
        value: 'fly_position',
        label: '方位',
      },
      {
        value: 'fly_weather',
        label: '天气',
      },
      {
        value: 'fly_color',
        label: '颜色',
      },
      {
        value: 'fly_wine_vessel',
        label: '酒器',
      },
      {
        value: 'fly_reduplicate',
        label: '叠词',
      },
    ])
    const not_belong_value = ref('bu_xian')
    let search_not_belong_value = 'bu_xian'

    const author_input = ref('')
    const title_input = ref('')
    const content_input = ref('')

    const flyList = ref([])
    const currentPage = ref(1);
    const pageSize = ref(12);

    const handleChange = () => {
      console.log(poetry_value.value)
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

    const reserved_chinese_word = (text:string) => {
      if (text === '') return '';
      let regEx = /[^\u4e00-\u9fa5\uf900-\ufa2d]/g;
      return text.replace(regEx, '');
    }



    const poetry_search = async () => {
      let have_str = have_input.value
      let no_have_str = no_have_input.value
      search_have_list = []
      search_no_have_list = []

      search_poetry_value = poetry_value.value
      search_belong_value = belong_value.value

      search_not_belong_value = not_belong_value.value

      if (have_str !== '' && no_have_str !== '') { // 同一个字出现在"含"和"不含"条件中
        let tmp1 = reserved_chinese_word(have_str)
        let tmp2 = reserved_chinese_word(no_have_str)
        for (let i=0,len=tmp1.length; i<len; i++) {
          for (let j=0,len1=tmp2.length; j<len1; j++) {
            if (tmp1[i] === tmp2[j]) {
              ElMessage({
                showClose: true,
                message: '一个字不能同时出现在"含有"和"不含"条件中~',
                type: 'error',
                duration: 5000,
              })
              return false
            }
          }
        }
      }

      if (search_belong_value !== 'bu_xian' && (search_belong_value === search_not_belong_value)) { // 含和不含种类相同
        ElMessage({
          showClose: true,
          message: '"含有"和"不含"的种类不能相同哦~',
          type: 'error',
          duration: 5000,
        })
        return false
      }


      flyList.value = []

      if (have_str !== '') { // 如果 含 输入了
        let tmp_list = have_str.split(' ')
        for (let i=0,len=tmp_list.length; i<len; i++) {
          let word = reserved_chinese_word(tmp_list[i])
          if (word !== '') {
            search_have_list.push(word)
          }
        }
      }

      if (no_have_str !== '') { // 如果 不含 输入了
        let tmp_list = no_have_str.split(' ')
        for (let i=0,len=tmp_list.length; i<len; i++) {
          let word = reserved_chinese_word(tmp_list[i])
          if (word !== '') {
            search_no_have_list.push(word)
          }
        }
      }
      // console.log(have_str, search_have_list)
      // console.log(no_have_str, search_no_have_list)
      if (have_str !== '' && search_have_list.length === 0 ||
          no_have_str !== '' && search_no_have_list.length === 0) {
        ElMessage({
          showClose: true,
          message: '非汉字不识别，请输入汉字哦~',
          type: 'warning',
          duration: 5000,
        })
      }

      if (search_belong_value === 'bu_xian' && search_have_list.length === 0) {
        ElMessage({
          showClose: true,
          message: '请至少输入或选择一个有效的"含有"条件',
          type: 'error',
          duration: 5000,
        })
        return false
      }

      kwargs = {
        limit: default_limit,
      };
      // console.log('诗词:', search_poetry_value)
      if (search_poetry_value !== -1) {
        kwargs['kind'] = search_poetry_value
        console.log('诗词:', search_poetry_value)
      }

      if (search_have_list.length !== 0) { // 含
        kwargs['have'] = search_have_list.join(' '); // 数组元素加起来转str
      }
      if (search_no_have_list.length !== 0) { // 不含
        kwargs['no_have'] = search_no_have_list.join(' '); // 数组元素加起来转str
      }

      if (search_belong_value !== 'bu_xian') { // 含
        kwargs[search_belong_value] = 1;
      }
      if (search_not_belong_value !== 'bu_xian') { // 不含
        kwargs[search_not_belong_value] = 0;
      }


      let ret = await Get('search/flys/', kwargs, true)
          .then((resp) => {
            let result = resp.data.results
            next_url = resp.data.next
            flyList.value = flyList.value.concat(result)
            if (resp.data.results.length === 0) {
              ElMessage({
                message:'喏哦~ 条件太复杂，飞不出来了喔~ 换个条件飞一下的喔',
                duration: 3000
              })
            } else flyList.value = resp.data.results;
          })
          .catch((error) => {
            console.log(error);
          })


    }

    const load = () => {

      if (next_url === null || next_url === '') {
        ElMessage({
          showClose: true,
          message: '已经没有数据咯~',
          type: 'warning',
          duration: 5000,
        })
        return false
      }

      Get(next_url, kwargs, true)
      .then((resp) => {
        let result = resp.data.results
        next_url = resp.data.next
        flyList.value = flyList.value.concat(result)
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


      have_input,
      no_have_input,

      poetry_options,
      poetry_value,

      belong_options,
      belong_value,

      not_belong_options,
      not_belong_value,


      author_input,
      title_input,
      content_input,

      flyList,
      currentPage,
      pageSize,


      handleSizeChange,
      handleCurrentChange,
      handleChange,
      poetry_search,
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

.infinite-list {
  height: 300px;
  padding: 0;
  margin: 0;
  list-style: none;
}
.infinite-list .infinite-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  background: var(--el-color-primary-light-9);
  margin: 10px;
  color: var(--el-color-primary);
}
.infinite-list .infinite-list-item + .list-item {
  margin-top: 10px;
}

.scrollbar-demo-item-shi {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 30px;
  margin: 8px;
  padding: 3px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
  //background: var(--el-color-danger-light-9);
  color: var(--el-color-primary);
  //color: var(--el-color-danger);
}

.scrollbar-demo-item-ci {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 30px;
  margin: 8px;
  padding: 3px;
  text-align: center;
  border-radius: 4px;
  //background: var(--el-color-primary-light-9);
  background: var(--el-color-danger-light-9);
  //color: var(--el-color-primary);
  color: var(--el-color-danger);
}

.sheng_lue {
  /*文本超出 省略*/
  max-width:100px;
  overflow:hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow:ellipsis;
}

</style>