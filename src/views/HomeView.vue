<template>
  <!-- 小窗隐藏 web端显示 -->
    <div class="hidden-xs-only" style="margin: 0 20px">
        <el-carousel height="640px" interval="4000">
            <el-carousel-item v-for="(url, idx) in images1" :key="idx">
                <el-image :src="url" style="height: 100%" fit="contain"/>
            </el-carousel-item>
        </el-carousel>
    </div>

  <!-- 大窗隐藏 移动端显示 -->
    <div class="hidden-sm-and-up" style="margin: 0 20px">
        <el-carousel height="700px" direction="vertical" interval="4000"
                     style="align-items: center; justify-content: center">
            <el-carousel-item v-for="(url, idx) in images2" :key="idx">
                <el-image :src="url" style="height: 100%; display: block" fit="contain"/>
            </el-carousel-item>
        </el-carousel>

        <!--    <el-carousel height="400px" style="width: 800px; margin-left: -200px; margin-top: 200px; transform: rotate(90deg); transform-origin: center;">
              <el-carousel-item v-for="item in 11" :key="item">
                <el-image :src="'/douyin/' + item + '.jpg'" fit="cover"/>
              </el-carousel-item>
            </el-carousel>-->
    </div>


</template>

<script lang="ts">


import {ref} from "vue";

export default {
    name: 'HomeView',
    components: {},
    setup() {
        const images1 = ref([
            'http://cdn.bwhlifetimelove.top/system/rotation_images1/0.jpg',
            'http://cdn.bwhlifetimelove.top/system/rotation_images1/1.jpg',
            'http://cdn.bwhlifetimelove.top/system/rotation_images1/2.jpg',
            'http://cdn.bwhlifetimelove.top/system/rotation_images1/3.jpg',
            'http://cdn.bwhlifetimelove.top/system/rotation_images1/5.jpg',
            'http://cdn.bwhlifetimelove.top/system/rotation_images1/6.jpg',
            'http://cdn.bwhlifetimelove.top/system/rotation_images1/7.jpg',
            'http://cdn.bwhlifetimelove.top/system/rotation_images1/8.jpg',
            'http://cdn.bwhlifetimelove.top/system/rotation_images1/9.jpg',
            'http://cdn.bwhlifetimelove.top/system/rotation_images1/10.jpg',
            'http://cdn.bwhlifetimelove.top/system/rotation_images1/11.jpg',
            'http://cdn.bwhlifetimelove.top/system/rotation_images1/12.jpg',
            'http://cdn.bwhlifetimelove.top/system/rotation_images1/13.jpg',
            'http://cdn.bwhlifetimelove.top/system/rotation_images1/14.jpg',
            'http://cdn.bwhlifetimelove.top/system/rotation_images1/15.jpg',
            'http://cdn.bwhlifetimelove.top/system/rotation_images1/16.jpg',
            'http://cdn.bwhlifetimelove.top/system/rotation_images1/17.jpg',
            'http://cdn.bwhlifetimelove.top/system/rotation_images1/18.jpg',
            'http://cdn.bwhlifetimelove.top/system/rotation_images1/19.jpg',
            'http://cdn.bwhlifetimelove.top/system/rotation_images1/20.jpg',
            'http://cdn.bwhlifetimelove.top/system/rotation_images1/21.jpg',
            'http://cdn.bwhlifetimelove.top/system/rotation_images1/22.jpg',
        ])

        const images2 = ref([
            'http://cdn.bwhlifetimelove.top/system/rotation_images2/0.jpg',
            'http://cdn.bwhlifetimelove.top/system/rotation_images2/1.jpg',
            'http://cdn.bwhlifetimelove.top/system/rotation_images2/2.jpg',
            'http://cdn.bwhlifetimelove.top/system/rotation_images2/3.jpg',
            'http://cdn.bwhlifetimelove.top/system/rotation_images2/5.jpg',
            'http://cdn.bwhlifetimelove.top/system/rotation_images2/6.jpg',
            'http://cdn.bwhlifetimelove.top/system/rotation_images2/7.jpg',
            'http://cdn.bwhlifetimelove.top/system/rotation_images2/8.jpg',
            'http://cdn.bwhlifetimelove.top/system/rotation_images2/9.jpg',
            'http://cdn.bwhlifetimelove.top/system/rotation_images2/10.jpg',
            'http://cdn.bwhlifetimelove.top/system/rotation_images2/11.jpg',
            'http://cdn.bwhlifetimelove.top/system/rotation_images2/12.jpg',
            'http://cdn.bwhlifetimelove.top/system/rotation_images2/13.jpg',
            'http://cdn.bwhlifetimelove.top/system/rotation_images2/14.jpg',
            'http://cdn.bwhlifetimelove.top/system/rotation_images2/15.jpg',
            'http://cdn.bwhlifetimelove.top/system/rotation_images2/16.jpg',
            'http://cdn.bwhlifetimelove.top/system/rotation_images2/17.jpg',
            'http://cdn.bwhlifetimelove.top/system/rotation_images2/18.jpg',
            'http://cdn.bwhlifetimelove.top/system/rotation_images2/19.jpg',
            'http://cdn.bwhlifetimelove.top/system/rotation_images2/20.jpg',
            'http://cdn.bwhlifetimelove.top/system/rotation_images2/21.jpg',
            'http://cdn.bwhlifetimelove.top/system/rotation_images2/22.jpg',
        ])

        return {
            images1,
            images2,
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
  //background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  //background-color: #d3dce6;
}

</style>
