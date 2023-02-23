<template>

  <div class="mt-4">
    <el-input
        v-model="input3"
        placeholder="Please input"
        class="input-with-select"
    >
      <template #prepend>
        <el-select v-model="select" placeholder="Select" style="width: 115px">
          <el-option label="Restaurant" value="1" />
          <el-option label="Order No." value="2" />
          <el-option label="Tel" value="3" />
        </el-select>
      </template>
      <template #append>
        <el-button :icon="Search" />
      </template>
    </el-input>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'

export default {
  name: 'TestView',
  components: {
  },
  setup() {
    const input3 = ref('')
    const select = ref('')

    return {
      input3,
      select,
      Search,
    }
  }
}


</script>

<style>
.input-with-select .el-input-group__prepend {
  background-color: var(--el-fill-color-blank);
}
</style>