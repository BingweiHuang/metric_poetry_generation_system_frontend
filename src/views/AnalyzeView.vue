<template>
    <div class="block text-center">

        <el-row justify="center" align="middle">
            <el-col :xl="4" :lg="4" :md="2" :sm="0" :xs="0"></el-col>

            <el-col :xl="16" :lg="16" :md="20" :sm="24" :xs="24" class="my">
                <!-- 1.作者产量排行 柱状图分析 -->
                <!-- 检索条件1 -->
                <el-row justify="center" align="middle" :gutter="0">

                    <el-col :xl="10" :lg="10" :md="10" :sm="10" :xs="10">
                        <el-cascader style="border: none" size="large" v-model="dynasty_value"
                                     :options="dynasty_options" placeholder="诗词" @change="dynasty_change"/>

                    </el-col>
                    <el-col :xl="9" :lg="9" :md="9" :sm="9" :xs="9">
                        <el-select size="large" v-model="author_num_value">
                            <el-option
                                    v-for="item in author_num_options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                            />
                            <template #prefix>
                                人数:
                            </template>
                        </el-select>
                    </el-col>

                    <el-col :xl="2" :lg="2" :md="2" :sm="2" :xs="3">
                        <el-button size="large" :icon="Search" @click="author_output_search"/>
                    </el-col>

                </el-row>
                <!-- 检索条件2 -->
                <el-row justify="center" align="middle" :gutter="0"
                        v-if="dynasty_value && (dynasty_value[0] === '唐诗' || dynasty_value[0] === '宋诗')">

                    <el-col :xl="7" :lg="7" :md="7" :sm="7" :xs="7">
                        <el-select size="large" v-model="metric_value" @change="metric_value_change">
                            <el-option
                                    v-for="item in metric_options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                            />
                        </el-select>

                    </el-col>
                    <el-col :xl="8" :lg="8" :md="8" :sm="8" :xs="8">

                        <el-select size="large" v-model="yan_value" @change="yan_value_change">
                            <el-option
                                    v-for="item in yan_options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                    :disabled="((item.value === 4 || item.value === 6 || item.value === 0) && metric_value === 1)"
                            />
                        </el-select>

                    </el-col>


                    <el-col :xl="7" :lg="7" :md="7" :sm="7" :xs="7">

                        <el-select size="large" v-model="jue_value">
                            <el-option
                                    v-for="item in jue_options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                    :disabled="((item.value === 2 && metric_value === 0) || (item.value === 3 && metric_value === 1)) || (([0, 1, 2, -1].includes(item.value)) && !([5, 7, -1].includes(yan_value)))"
                            />
                        </el-select>

                    </el-col>

                </el-row>
                <!-- 作者产量排行柱状图 -->
                <el-card shadow="none">
                    <div ref="bar_echart" style="width:100%; height:600px;"></div>
                </el-card>


                <!-- 2.朝代、诗人 诗作用韵和种类 饼图分析 -->
                <!-- 检索条件 -->
                <el-row justify="center" align="middle" :gutter="0">

                    <el-col :xl="7" :lg="7" :md="7" :sm="7" :xs="7">
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

                    <el-col :xl="7" :lg="7" :md="7" :sm="7" :xs="7">
                        <el-input size="large" v-model="author2_input" :disabled="author2_input_disable"
                                  placeholder="诗人(选填)" clearable>
                        </el-input>
                    </el-col>

                    <el-col :xl="7" :lg="7" :md="7" :sm="7" :xs="6">
                        <el-select size="large" v-model="rhyme_num_value">
                            <!--              <template #prefix>韵脚数:</template>-->
                            <el-option
                                    v-for="item in rhyme_num_options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                            />
                        </el-select>
                    </el-col>


                    <el-col :xl="2" :lg="2" :md="2" :sm="2" :xs="3">
                        <el-button size="large" :icon="Search" @click="poetry_statistics_search"/>
                    </el-col>

                </el-row>
                <!-- 诗作用韵分析饼图 -->
                <el-card shadow="none" style="margin-bottom: 0;">
                    <div ref="pie_echart" style="width:100%; height:420px;"></div>
                </el-card>
                <!-- 诗作种类分析饼图 -->
                <el-card shadow="none">
                    <div ref="pie2_echart" style="width:100%; height:380px;"></div>
                </el-card>


                <!-- 3.朝代、作者 诗词用词 饼图分析 -->
                <!-- 检索条件1 -->
                <el-row justify="center" align="middle" :gutter="0">

                    <el-col :xl="10" :lg="10" :md="10" :sm="10" :xs="10">
                        <el-select size="large" v-model="dynasty3_value" @change="dynasty3_change">
                            <!--              <template #prefix>诗:</template>-->
                            <el-option
                                    v-for="item in dynasty3_options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                            />
                        </el-select>
                    </el-col>

                    <el-col :xl="11" :lg="11" :md="11" :sm="11" :xs="10" v-if="dynasty3_value === 1">
                        <el-select size="large" v-model="author3_input">
                            <el-option label="纳兰性德" value="纳兰性德"/>
                            <el-option label="王国维" value="王国维"/>
                        </el-select>
                    </el-col>

                    <el-col :xl="11" :lg="11" :md="11" :sm="11" :xs="10" v-else>
                        <el-input size="large" v-model="author3_input" :disabled="author3_input_disable"
                                  placeholder="诗人(选填)" clearable>
                        </el-input>
                    </el-col>


                    <el-col :xl="2" :lg="2" :md="2" :sm="2" :xs="3">
                        <el-button size="large" :icon="Search" @click="word_list_search"/>
                    </el-col>

                </el-row>
                <!-- 检索条件2 -->
                <el-row justify="center" align="middle" :gutter="0">

                    <el-col :xl="23" :lg="23" :md="23" :sm="23" :xs="23">
                        <el-input size="large" v-model="word_list_str" placeholder="词组(1~6个,空格隔开)" clearable>
                        </el-input>
                    </el-col>

                </el-row>
                <!-- 诗词用词饼图 -->
                <el-card shadow="none">
                    <div ref="pie3_echart" style="width:100%; height:380px;"></div>
                </el-card>


                <!-- 4.朝代、作者 用词 词云分析 -->
                <!-- 检索条件1 -->
                <el-row justify="center" align="middle" :gutter="0">

                    <el-col :xl="8" :lg="8" :md="8" :sm="8" :xs="8">
                        <el-select size="large" v-model="dynasty4_value">
                            <!--              <template #prefix>诗:</template>-->
                            <el-option
                                    v-for="item in dynasty4_options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                            />
                        </el-select>
                    </el-col>

                    <el-col :xl="7" :lg="7" :md="7" :sm="7" :xs="7">
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

                    <el-col :xl="6" :lg="6" :md="6" :sm="6" :xs="5">
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
                        <el-button size="large" :icon="Search" @click="word_frequency_search"/>
                    </el-col>

                </el-row>
                <!-- 用词词云 -->
                <el-card shadow="none">
                    <div ref="wc_echart" style="width:100%; height:600px; margin-bottom: 20px"></div>
                </el-card>


                <!-- 5.词牌名 词云分析 -->
                <!-- 检索条件1 -->
                <el-row justify="center" align="middle" :gutter="0">

                    <el-col :xl="8" :lg="8" :md="8" :sm="8" :xs="8">
                        <el-select size="large" v-model="dynasty5_value" @change="dynasty5_change">
                            <!--              <template #prefix>诗:</template>-->
                            <el-option
                                    v-for="item in dynasty5_options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                            />
                        </el-select>
                    </el-col>

                    <el-col :xl="7" :lg="7" :md="7" :sm="7" :xs="7">
                        <el-input size="large" v-model="author5_input" :disabled="author5_input_disable"
                                  placeholder="词人" clearable>
                        </el-input>
                    </el-col>

                    <el-col :xl="6" :lg="6" :md="6" :sm="6" :xs="5">
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
                        <el-button size="large" :icon="Search" @click="rhythmic_statistics_search"/>
                    </el-col>

                </el-row>
                <!-- 词牌名词云 -->
                <el-card shadow="none">
                    <div ref="wc2_echart" style="width:100%; height:600px; margin-bottom: 20px"></div>
                </el-card>


            </el-col>

            <el-col :xl="4" :lg="4" :md="2" :sm="0" :xs="0"></el-col>
        </el-row>

    </div>
</template>


<script lang="ts">
import {onMounted, ref} from "vue";
import {ElMessage} from "element-plus";
import * as echarts from "echarts";
import 'echarts-wordcloud';

import {
    Search,
} from '@element-plus/icons-vue'
import {useStore} from "vuex";
import {authGet, system_base_url} from "@/utils/request";

export default {
    name: "AnalyzeView",
    components: {},
    setup() {

        const reserved_chinese_word = (text: string) => {
            if (text === '') return '';
            let regEx = /[^\u4e00-\u9fa5\uf900-\ufa2d]/g;
            return text.replace(regEx, '');
        }

        const dynasty_options = ref([
            {
                value: '唐诗',
                label: '唐诗',
                children: [
                    {
                        value: '三百首',
                        label: '三百首'
                    },
                    {
                        value: '所有',
                        label: '所有'
                    },
                ]
            },
            {
                value: '宋词',
                label: '宋词',
                children: [
                    {
                        value: '三百首',
                        label: '三百首'
                    },
                    {
                        value: '所有',
                        label: '所有'
                    },
                ]
            },
            {
                value: '宋诗',
                label: '宋诗',
            },
        ])
        const dynasty_value = ref(['唐诗', '所有'])

        const metric_options = ref([
            {
                value: 1,
                label: '近体',
            },
            {
                value: 0,
                label: '古体',
            },
            {
                value: -1,
                label: '不限古近',
            },
        ])
        const metric_value = ref(1)

        const yan_options = ref([
            {
                value: 4,
                label: '四言',
            },
            {
                value: 5,
                label: '五言',
            },
            {
                value: 6,
                label: '六言',
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
                label: '不限几言',
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
                label: '不限绝律',
            },
        ])
        const jue_value = ref(-1)

        const author_num_value = ref(10)
        const author_num_options = ref([
            {
                value: 10,
                label: 10,
            },
            {
                value: 20,
                label: 20,
            },
        ])
        const bar_echart = ref()

        const dynasty_change = () => {
            if (dynasty_value.value && dynasty_value.value[0] === '宋词') {
                metric_value.value = -1
                yan_value.value = -1
                jue_value.value = -1
            }
        }

        const metric_value_change = () => {
            yan_value.value = -1
            jue_value.value = -1
        }
        const yan_value_change = () => {
            if ([4, 6, 0].includes(yan_value.value)) jue_value.value = 3
            else jue_value.value = -1
        }
        const author_output_search = async () => {
            let three_hundred = 0
            if (dynasty_value.value.length > 1 && dynasty_value.value[1] === '三百首') three_hundred = 1

            let res_list = []

            let kwargs = {
                'num': author_num_value.value,
                'dynasty': dynasty_value.value[0],
                'metric': metric_value.value,
                'yan': yan_value.value,
                'jue': jue_value.value,
                'three_hundred': three_hundred,
            }


            let ret = await authGet(system_base_url + 'analyze/author_output/', kwargs)
            if (ret.status == 401) return false

            res_list = ret.data.res_list

            let x_list = []
            let y1_list = []
            let y2_list = []
            let y3_list = []
            let y4_list = []
            let y5_list = []
            let y6_list = []

            let the_series = []

            const obj_series = {
                name: '柱状图',
                data: [],
                type: 'bar',
                stack: 'total',
                label: {
                    // show: true
                },
                emphasis: {
                    focus: 'series'
                },
            }

            if (res_list.length === 0) return false

            for (let i = 0; i < res_list[0].length; i++) {
                x_list.push(res_list[0][i][0])
            }


            let tran = ['杂', '', '', '', '四', '五', '六', '七']
            let tran2 = ['绝句', '律诗', '排律', '其他']
            let metric = metric_value.value === 0 ? '古体' : (metric_value.value === 1 ? '近体' : '不限古近')
            let ji = tran[yan_value.value]
            let yan = yan_value.value === -1 ? '不限几言' : (ji + '言')
            let jue = jue_value.value === -1 ? '不限绝律' : tran2[jue_value.value]
            let search = dynasty_value.value[0] +
                ((dynasty_value.value.length > 1) && (dynasty_value.value[1] === '三百首') ? '三百首 ' : ' ') +
                ((dynasty_value.value[0] !== '宋词' ? (metric + ' ' + yan + ' ' + jue) : ''))

            if (metric_value.value === -1 && yan_value.value === -1 && jue_value.value === -1) { // 全不限
                const copy1 = JSON.parse(JSON.stringify(obj_series)) as typeof obj_series;
                const copy2 = JSON.parse(JSON.stringify(obj_series)) as typeof obj_series;
                y1_list = []
                y2_list = []
                for (let i = 0; i < res_list[0].length; i++) {
                    y1_list.push(res_list[0][i][1])
                    y2_list.push(res_list[1][i][1])
                }
                copy1.data = y1_list;
                copy2.data = y2_list;
                if (dynasty_value.value[0] === '宋词') {
                    copy1.name = '完整词作';
                    copy2.name = '缺字词作';

                } else {
                    copy1.name = '近体诗';
                    copy2.name = '古体诗';
                }
                the_series = []
                the_series.push(copy1);
                the_series.push(copy2);
            } else if (yan_value.value === -1 && jue_value.value === -1) { // 只选格律诗

                const copy1 = JSON.parse(JSON.stringify(obj_series)) as typeof obj_series;
                const copy2 = JSON.parse(JSON.stringify(obj_series)) as typeof obj_series;
                const copy3 = JSON.parse(JSON.stringify(obj_series)) as typeof obj_series;
                const copy4 = JSON.parse(JSON.stringify(obj_series)) as typeof obj_series;
                const copy5 = JSON.parse(JSON.stringify(obj_series)) as typeof obj_series;
                const copy6 = JSON.parse(JSON.stringify(obj_series)) as typeof obj_series;
                y1_list = []
                y2_list = []
                y3_list = []
                y4_list = []
                y5_list = []
                y6_list = []
                for (let i = 0; i < res_list[0].length; i++) {
                    y1_list.push(res_list[0][i][1])
                    y2_list.push(res_list[1][i][1])
                    y3_list.push(res_list[2][i][1])
                    y4_list.push(res_list[3][i][1])
                    y5_list.push(res_list[4][i][1])
                    y6_list.push(res_list[5][i][1])
                }
                copy1.data = y1_list;
                copy2.data = y2_list;
                copy3.data = y3_list;
                copy4.data = y4_list;
                copy5.data = y5_list;
                copy6.data = y6_list;
                the_series = []

                if (metric_value.value === 1) { // 选了近体诗

                    copy1.name = '近体' + '七绝';
                    copy2.name = '近体' + '七律';
                    copy3.name = '近体' + '七排';
                    copy4.name = '近体' + '五绝';
                    copy5.name = '近体' + '五律';
                    copy6.name = '近体' + '五排';

                    the_series.push(copy1);
                    the_series.push(copy2);
                    the_series.push(copy3);
                    the_series.push(copy4);
                    the_series.push(copy5);
                    the_series.push(copy6);

                } else if (metric_value.value === 0) { // 选了古体诗

                    copy1.name = '古体' + '七绝';
                    copy2.name = '古体' + '七律';
                    copy3.name = '古体' + '五绝';
                    copy4.name = '古体' + '五律';
                    copy5.name = '古体' + '其他';

                    the_series.push(copy1);
                    the_series.push(copy2);
                    the_series.push(copy3);
                    the_series.push(copy4);
                    the_series.push(copy5);

                }
            } else if (metric_value.value === -1 && jue_value.value === -1) { // 只选几言
                const copy1 = JSON.parse(JSON.stringify(obj_series)) as typeof obj_series;
                const copy2 = JSON.parse(JSON.stringify(obj_series)) as typeof obj_series;
                const copy3 = JSON.parse(JSON.stringify(obj_series)) as typeof obj_series;
                const copy4 = JSON.parse(JSON.stringify(obj_series)) as typeof obj_series;
                const copy5 = JSON.parse(JSON.stringify(obj_series)) as typeof obj_series;
                const copy6 = JSON.parse(JSON.stringify(obj_series)) as typeof obj_series;
                y1_list = []
                y2_list = []
                y3_list = []
                y4_list = []
                y5_list = []
                y6_list = []
                for (let i = 0; i < res_list[0].length; i++) {
                    y1_list.push(res_list[0][i][1])
                    y2_list.push(res_list[1][i][1])
                    y3_list.push(res_list[2][i][1])
                    y4_list.push(res_list[3][i][1])
                    y5_list.push(res_list[4][i][1])
                    y6_list.push(res_list[5][i][1])
                }
                copy1.data = y1_list;
                copy2.data = y2_list;
                copy3.data = y3_list;
                copy4.data = y4_list;
                copy5.data = y5_list;
                copy6.data = y6_list;

                copy1.name = '近体' + ji + '绝'
                copy2.name = '近体' + ji + '律'
                copy3.name = '近体' + ji + '排'
                copy4.name = '古体' + ji + '绝'
                copy5.name = '古体' + ji + '律'
                copy6.name = '古体其他'

                the_series.push(copy1);
                the_series.push(copy2);
                the_series.push(copy3);
                the_series.push(copy4);
                the_series.push(copy5);
                the_series.push(copy6);

            } else if (metric_value.value === -1 && yan_value.value === -1) { // 只选诗体
                const copy1 = JSON.parse(JSON.stringify(obj_series)) as typeof obj_series;
                const copy2 = JSON.parse(JSON.stringify(obj_series)) as typeof obj_series;
                const copy3 = JSON.parse(JSON.stringify(obj_series)) as typeof obj_series;
                const copy4 = JSON.parse(JSON.stringify(obj_series)) as typeof obj_series;
                y1_list = []
                y2_list = []
                y3_list = []
                y4_list = []
                for (let i = 0; i < res_list[0].length; i++) {
                    y1_list.push(res_list[0][i][1])
                    y2_list.push(res_list[1][i][1])
                    y3_list.push(res_list[2][i][1])
                    y4_list.push(res_list[3][i][1])
                }
                copy1.data = y1_list;
                copy2.data = y2_list;
                copy3.data = y3_list;
                copy4.data = y4_list;

                the_series = []
                if (jue_value.value === 2) { // 排律
                    copy1.name = '近体七言'
                    copy2.name = '近体五言'

                    the_series.push(copy1);
                    the_series.push(copy2);
                } else if (jue_value.value === 3) { // 其他
                    copy1.name = '古体六言'
                    copy2.name = '古体四言'
                    copy3.name = '古体杂言'

                    the_series.push(copy1);
                    the_series.push(copy2);
                    the_series.push(copy3);
                } else { // 绝句或律诗
                    copy1.name = '近体七言'
                    copy2.name = '近体五言'
                    copy3.name = '古体七言'
                    copy4.name = '古体五言'

                    the_series.push(copy1);
                    the_series.push(copy2);
                    the_series.push(copy3);
                    the_series.push(copy4);
                }

            } else if (metric_value.value === -1) { // 只没选格律
                const copy1 = JSON.parse(JSON.stringify(obj_series)) as typeof obj_series;
                const copy2 = JSON.parse(JSON.stringify(obj_series)) as typeof obj_series;
                y1_list = []
                y2_list = []
                for (let i = 0; i < res_list[0].length; i++) {
                    y1_list.push(res_list[0][i][1])
                    y2_list.push(res_list[1][i][1])
                }
                copy1.data = y1_list;
                copy2.data = y2_list;

                copy1.name = '近体诗'
                copy2.name = '古体诗'

                if (jue_value.value === 3) {
                    copy2.name = '古体诗'
                    the_series.push(copy2);
                } else if (jue_value.value === 2) {
                    copy1.name = '近体诗'
                    the_series.push(copy1);
                } else {
                    copy1.name = '近体诗'
                    copy2.name = '古体诗'
                    the_series.push(copy1);
                    the_series.push(copy2);
                }

            } else if (yan_value.value === -1) { // 只没选几言
                const copy1 = JSON.parse(JSON.stringify(obj_series)) as typeof obj_series;
                const copy2 = JSON.parse(JSON.stringify(obj_series)) as typeof obj_series;
                const copy3 = JSON.parse(JSON.stringify(obj_series)) as typeof obj_series;
                const copy4 = JSON.parse(JSON.stringify(obj_series)) as typeof obj_series;
                const copy5 = JSON.parse(JSON.stringify(obj_series)) as typeof obj_series;
                y1_list = []
                y2_list = []
                y3_list = []
                y4_list = []
                y5_list = []
                for (let i = 0; i < res_list[0].length; i++) {
                    y1_list.push(res_list[0][i][1])
                    y2_list.push(res_list[1][i][1])
                    y3_list.push(res_list[2][i][1])
                    y4_list.push(res_list[3][i][1])
                    y5_list.push(res_list[4][i][1])
                }
                copy1.data = y1_list;
                copy2.data = y2_list;
                copy3.data = y3_list;
                copy4.data = y4_list;
                copy5.data = y5_list;

                copy1.name = '七言'
                copy2.name = '五言'

                the_series = []
                the_series.push(copy1);
                the_series.push(copy2);

                if (metric_value.value === 0 && jue_value.value === 3) { // 古体诗 其他诗体
                    copy3.name = '六言'
                    copy4.name = '四言'
                    copy5.name = '杂言'
                    the_series.push(copy3);
                    the_series.push(copy4);
                    the_series.push(copy5);
                }
            } else if (jue_value.value === -1) { // 只没选诗体
                const copy1 = JSON.parse(JSON.stringify(obj_series)) as typeof obj_series;
                const copy2 = JSON.parse(JSON.stringify(obj_series)) as typeof obj_series;
                const copy3 = JSON.parse(JSON.stringify(obj_series)) as typeof obj_series;
                const copy4 = JSON.parse(JSON.stringify(obj_series)) as typeof obj_series;
                y1_list = []
                y2_list = []
                y3_list = []
                y4_list = []
                for (let i = 0; i < res_list[0].length; i++) {
                    y1_list.push(res_list[0][i][1])
                    y2_list.push(res_list[1][i][1])
                    y3_list.push(res_list[2][i][1])
                    y4_list.push(res_list[3][i][1])
                }
                copy1.data = y1_list;
                copy2.data = y2_list;
                copy3.data = y3_list;
                copy4.data = y4_list;

                copy1.name = '绝句'
                copy2.name = '律诗'
                copy3.name = '排律'
                copy4.name = '其他'

                the_series = []
                if (metric_value.value === 1) { // 近体诗
                    the_series.push(copy1);
                    the_series.push(copy2);
                    the_series.push(copy3);
                } else if ([4, 6, 0].includes(yan_value.value)) { // 古体诗 四、六、杂言
                    the_series.push(copy4);
                } else if ([5, 7].includes(yan_value.value)) { // 古体诗 五、七言
                    the_series.push(copy1);
                    the_series.push(copy2);
                    the_series.push(copy4);
                }
            } else { // 全选了
                const copy1 = JSON.parse(JSON.stringify(obj_series)) as typeof obj_series;
                y1_list = []
                for (let i = 0; i < res_list[0].length; i++) {
                    y1_list.push(res_list[0][i][1])
                }
                copy1.data = y1_list;
                copy1.name = (metric + yan + jue)

                the_series = []
                the_series.push(copy1);
            }
            echarts.dispose(bar_echart.value)
            const my_echart = echarts.init(bar_echart.value, 'white', {renderer: 'canvas'})
            my_echart.clear()

            my_echart.setOption({
                title: {
                    text: search + ' 产量',
                    left: 'center',
                    top: '3%'
                },
                toolbox: {
                    show: true,
                    feature: {
                        dataView: {show: true, readOnly: true},
                        // restore: { show: true },
                        saveAsImage: {show: true}
                    }
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
                    right: '4%',
                    bottom: '5%',
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
                series: the_series
            });

        }


        const dynasty2_options = ref([
            {
                value: '唐代',
                label: '唐诗',
            },
            {
                value: '宋代',
                label: '宋诗',
            },
            {
                value: '近现代',
                label: '近现代诗',
            },
            {
                value: '不限朝代',
                label: '不限朝代',
            },
        ])
        const dynasty2_value = ref('近现代')
        const author2_input = ref('毛泽东')
        const author2_input_disable = ref(true)
        const rhyme_num_options = ref([
            {
                value: 8,
                label: 8,
            },
            {
                value: 15,
                label: 15,
            },
        ])
        const rhyme_num_value = ref(8)
        const pie_echart = ref()
        const pie2_echart = ref()

        const dynasty2_change = () => {
            if (dynasty2_value.value === '近现代') {
                author2_input.value = '毛泽东'
                author2_input_disable.value = true
            } else if (dynasty2_value.value === '不限朝代') {
                author2_input.value = ''
                author2_input_disable.value = true
            } else {
                author2_input.value = ''
                author2_input_disable.value = false
            }
        }


        const poetry_statistics_search = async () => {
            let author = reserved_chinese_word(author2_input.value)
            if (author !== author2_input.value) {
                ElMessage({
                    showClose: true,
                    message: '非汉字部分不识别哦~',
                    type: 'warning',
                    duration: 3000,
                })
            }

            let count_pairs = []
            let res_list = []

            await authGet(system_base_url + 'analyze/poetry_rhyme_statistics/', {
                'rhyme_num': rhyme_num_value.value,
                'dynasty': dynasty2_value.value,
                'author': author,
            })
                .then((resp) => {
                    if (resp.status === 200) {

                        count_pairs = resp.data.count_pairs;
                    }
                })
                .catch((error) => {
                    console.log(error)
                })

            await authGet(system_base_url + 'analyze/poetry_style_statistics/', {
                'dynasty': dynasty2_value.value,
                'author': author,
            })
                .then((resp) => {
                    if (resp.status === 200) {
                        res_list = resp.data.res_list;
                    }
                })
                .catch((error) => {
                    console.log(error)
                })

            if (res_list[0][0]['value'] === 0 && res_list[0][1]['value'] === 0) {
                ElMessage({
                    showClose: true,
                    message: '喏哦~ 诗人不存在的喔~ 换个人戏一下的喔',
                    duration: 3000
                })
                return false
            }

            let search = (author === '' ? dynasty2_value.value : author)
            echarts.dispose(pie_echart.value)
            const my_echart = echarts.init(pie_echart.value, 'white', {renderer: 'canvas'})
            // const my_echart = pie_echart.value

            echarts.dispose(pie2_echart.value)
            const my_echart2 = echarts.init(pie2_echart.value, 'white', {renderer: 'canvas'})
            // const my_echart2 = pie2_echart.value

            my_echart.setOption({
                title: {
                    text: search + '诗作用韵',
                    left: 'center',
                    top: '38%'
                },
                toolbox: {
                    show: true,
                    feature: {
                        dataView: {show: true, readOnly: true},
                        // restore: { show: true },
                        saveAsImage: {show: true}
                    }
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
                        center: ['50%', '42%'],
                        name: '用韵偏好',
                        type: 'pie',
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        emphasis: {
                            itemStyle: {
                                borderRadius: 10,
                                borderColor: '#fff',
                                borderWidth: 2,
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)',
                            },
                        },
                        data: count_pairs,
                        radius: ['40%', '70%']
                    }
                ]

            });

            let legend_data = []
            for (let i = 0, len = res_list[1].length; i < len; i++) {
                if (res_list[1][i] !== '近体诗') legend_data.push(res_list[1][i])
            }
            my_echart2.setOption({
                title: {
                    text: search + '诗作种类',
                    left: 'center',
                    top: '1%'
                },
                toolbox: {
                    show: true,
                    feature: {
                        dataView: {show: true, readOnly: true},
                        // restore: { show: true },
                        saveAsImage: {show: true}
                    }
                },
                tooltip: {
                    // trigger: 'axis',
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)',
                    axisPointer: {type: 'cross'}
                },
                legend: {
                    top: '87%',
                    left: 'center',
                    data: legend_data
                },
                series: [
                    {
                        left: 'center',
                        top: 'center',
                        width: '100%',
                        height: '100%',
                        center: ['50%', '48%'],
                        name: '古近体',
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
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
                        data: res_list[0]
                    },
                    {
                        left: 'center',
                        top: 'center',
                        width: '100%',
                        height: '100%',
                        center: ['50%', '48%'],
                        name: '诗种类',
                        type: 'pie',
                        radius: ['45%', '60%'],
                        labelLine: {
                            length: 20
                        },
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            },
                        },
                        data: res_list[1]
                    }
                ]
            });

        }


        const dynasty3_options = ref([
            {
                value: 0,
                label: '近现代诗词',
            },
            {
                value: 1,
                label: '清代词',
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
                value: 6,
                label: '诗经',
            },
            {
                value: 7,
                label: '不限(很耗时)',
            },
        ])
        let trans = [
            {
                'dynasty': '近现代',
                'shici': 'shici',
            },
            {
                'dynasty': '清代',
                'shici': 'ci',
            },
            {
                'dynasty': '宋代',
                'shici': 'ci',
            },
            {
                'dynasty': '五代',
                'shici': 'ci',
            },
            {
                'dynasty': '宋代',
                'shici': 'shi',
            },
            {
                'dynasty': '唐代',
                'shici': 'shi',
            },
            {
                'dynasty': '',
                'shici': 'shijing',
            },
            {
                'dynasty': '不限',
                'shici': 'shici',
            },
        ]
        const dynasty3_value = ref(0)
        const author3_input = ref('毛泽东')
        const author3_input_disable = ref(true)
        const word_list_str = ref('春 夏 秋 冬')
        const pie3_echart = ref()

        const dynasty3_change = () => {
            if (dynasty3_value.value === 0) {
                author3_input.value = '毛泽东'
                author3_input_disable.value = true
            } else if (dynasty3_value.value === 1) {
                author3_input.value = '纳兰性德'
            } else if (dynasty3_value.value >= 6) {
                author3_input.value = ''
                author3_input_disable.value = true
            } else {
                author3_input.value = ''
                author3_input_disable.value = false
            }
        }

        const word_list_search = async () => {
            let word_list = word_list_str.value.split(' ')
            let the_word_list = []
            for (let i = 0, len = word_list.length; i < len; i++) {
                let the_word = reserved_chinese_word(word_list[i])
                if (the_word !== '') the_word_list.push(the_word)
            }

            if (the_word_list.length === 0) {
                ElMessage({
                    showClose: true,
                    message: '请输入至少一个词。只识别汉字部分~',
                    type: 'error',
                    duration: 3000,
                })
                return false
            } else if (the_word_list.length > 6) {
                ElMessage({
                    showClose: true,
                    message: '不得超过六个词~',
                    type: 'error',
                    duration: 3000,
                })
                return false
            }

            let author = reserved_chinese_word(author3_input.value)
            if (author !== author3_input.value) {
                ElMessage({
                    showClose: true,
                    message: '非汉字部分不识别哦~',
                    type: 'warning',
                    duration: 3000,
                })
            }

            let res_list = []

            let ret = await authGet(system_base_url + 'analyze/word_list/', {
                'word_list': the_word_list.join(' '),
                'dynasty': trans[dynasty3_value.value]['dynasty'],
                'shici': trans[dynasty3_value.value]['shici'],
                'author': author,
            })

            if (ret.status == 401) return false
            res_list = ret.data.word_list

            let search = ''
            if (dynasty3_value.value == 0) search = '毛泽东诗词';
            else if (dynasty3_value.value == 7) search = '所有诗词';
            else search = dynasty3_options.value[dynasty3_value.value]['label'] + author;


            echarts.dispose(pie3_echart.value)
            const my_echart = echarts.init(pie3_echart.value, 'white', {renderer: 'canvas'},)
            // my_echart.clear()
            my_echart.setOption({
                title: {
                    text: search + '用词分析',
                    left: 'center',
                    top: '1%'
                },
                toolbox: {
                    show: true,
                    feature: {
                        dataView: {show: true, readOnly: true},
                        // restore: { show: true },
                        saveAsImage: {show: true}
                    }
                },
                tooltip: {
                    // trigger: 'axis',
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)',
                    axisPointer: {type: 'cross'}
                },
                legend: {
                    top: '82%',
                    left: 'center'
                },
                series: [
                    {
                        name: '用词偏好',
                        left: 'center',
                        top: 'center',
                        width: '80%',
                        height: '80%',
                        center: ['50%', '40%'],
                        type: 'pie',
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
                        data: res_list,
                    }
                ]

            });
        }


        const dynasty4_options = ref([
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
                value: 6,
                label: '王国维词',
            },
            {
                value: 7,
                label: '诗经',
            },
            {
                value: -1,
                label: '不限',
            },
        ])
        const dynasty4_value = ref(0)
        const phrase_options = ref([
            {
                value: -2,
                label: '单字',
            },
            {
                value: -3,
                label: '多字',
            },
            {
                value: 0,
                label: '名词',
            },
            {
                value: 1,
                label: '动词',
            },
            {
                value: 2,
                label: '形容词',
            },
            {
                value: 3,
                label: '地名',
            },
            {
                value: -1,
                label: '不限',
            },
        ])
        const phrase_value = ref(-3)
        const word_num_options = ref([
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
            ['n', 's', 'nr', 'ns', 'nt', 'nl', 'ng', 'nz', 'm'], // 名词
            ['v', 'vg', 'vd', 'vn', 'vf', 'vx', 'vi'], // 动词
            ['a', 'ag', 'ad', 'al', 'an'], // 形容词
            ['ns', 'nsf'], // 地名
        ]

        const word_frequency_search = async () => {
            let word_list = []
            let kwargs: any = {};
            if (phrase_value.value >= 0) {
                kwargs['phrase'] = avi_l[phrase_value.value].join(' ')
            }
            kwargs['num'] = word_num_value.value
            if (dynasty4_value.value !== -1) {
                kwargs['dynasty'] = dynasty4_value.value
            }
            if (phrase_value.value === -2) kwargs['word_len'] = 1 // 单字
            else if (phrase_value.value === -3) kwargs['word_len'] = 2 // 多字


            let ret = await authGet(system_base_url + 'analyze/word_frequency/', kwargs)

            if (ret.status == 401) return false
            word_list = ret.data.word_list

            echarts.dispose(wc_echart.value)
            const my_echart = echarts.init(wc_echart.value, 'white', {renderer: 'canvas'})

            my_echart.setOption({
                /*title: {
                  text: '词频词云',
                  left: '0%',
                  top: '0%'
                },*/
                toolbox: {
                    show: true,
                    feature: {
                        dataView: {show: true, readOnly: true},
                        // restore: { show: true },
                        saveAsImage: {show: true}
                    }
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


        const dynasty5_options = ref([
            {
                value: '近现代',
                label: '近现代词',
            },
            {
                value: '清代',
                label: '清代词',
            },
            {
                value: '五代',
                label: '五代词',
            },
            {
                value: '宋代',
                label: '宋词',
            },
            {
                value: '不限',
                label: '不限',
            },
        ])
        const dynasty5_value = ref('近现代')
        const author5_input = ref('毛泽东')
        const author5_input_disable = ref(true)
        const rhythmic_num_options = ref([
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
        ])
        const rhythmic_num_value = ref(150)
        const wc2_echart = ref()


        const dynasty5_change = () => {
            if (dynasty5_value.value === '近现代') {
                author5_input.value = '毛泽东'
                author5_input_disable.value = true
            } else if (dynasty5_value.value === '清代') {
                author5_input.value = ''
                author5_input_disable.value = false
            } else if (dynasty5_value.value === '不限') {
                author5_input.value = ''
                author5_input_disable.value = true
            } else {
                author5_input.value = ''
                author5_input_disable.value = false
            }
        }

        const rhythmic_statistics_search = async () => {
            let word_list = []
            let author = reserved_chinese_word(author5_input.value)
            if (author !== author5_input.value) {
                ElMessage({
                    showClose: true,
                    message: '非汉字部分不识别哦~',
                    type: 'warning',
                    duration: 3000,
                })
            }

            let ret = await authGet(system_base_url + 'analyze/rhythmic_statistics/', {
                'num': rhythmic_num_value.value,
                'dynasty': dynasty5_value.value,
                'author': author,
            })

            if (ret.status == 401) return false
            word_list = ret.data.word_list

            if (word_list.length === 0) {
                ElMessage({
                    showClose: true,
                    message: '喏哦~ 词人不存在的喔~ 换个人戏一下的喔',
                    duration: 3000
                })
                return false
            }

            echarts.dispose(wc2_echart.value)
            const my_echart = echarts.init(wc2_echart.value, 'white', {renderer: 'canvas'})

            my_echart.setOption({
                /*title: {
                  text: '词频词云',
                  left: '0%',
                  top: '0%'
                },*/
                toolbox: {
                    show: true,
                    feature: {
                        dataView: {show: true, readOnly: true},
                        // restore: { show: true },
                        saveAsImage: {show: true}
                    }
                },
                tooltip: {
                    // trigger: 'axis',
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c}',
                    axisPointer: {type: 'cross'}
                },
                series: [{
                    name: '词牌作品',
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


        onMounted(async () => {

            let the_series = []

            const obj_series = {
                name: '柱状图',
                data: [],
                type: 'bar',
                stack: 'total',
                label: {
                    // show: true
                },
                emphasis: {
                    focus: 'series'
                },
            }

            let x_list = ['杜牧', '姚合', '贯休', '许浑', '李商隐', '元稹', '刘禹锡', '齐己', '杜甫', '白居易']
            let y1_list = [181, 40, 40, 54, 195, 236, 172, 54, 77, 681]
            let y2_list = [98, 60, 106, 196, 105, 93, 171, 193, 110, 533]
            let y3_list = [1, 1, 3, 0, 1, 6, 0, 0, 4, 22]
            let y4_list = [26, 13, 3, 6, 34, 27, 32, 2, 31, 86]
            let y5_list = [97, 279, 280, 218, 136, 159, 159, 422, 602, 369]
            let y6_list = [29, 48, 16, 21, 43, 32, 32, 9, 103, 156]

            const copy1 = JSON.parse(JSON.stringify(obj_series)) as typeof obj_series;
            const copy2 = JSON.parse(JSON.stringify(obj_series)) as typeof obj_series;
            const copy3 = JSON.parse(JSON.stringify(obj_series)) as typeof obj_series;
            const copy4 = JSON.parse(JSON.stringify(obj_series)) as typeof obj_series;
            const copy5 = JSON.parse(JSON.stringify(obj_series)) as typeof obj_series;
            const copy6 = JSON.parse(JSON.stringify(obj_series)) as typeof obj_series;
            copy1.data = y1_list;
            copy2.data = y2_list;
            copy3.data = y3_list;
            copy4.data = y4_list;
            copy5.data = y5_list;
            copy6.data = y6_list;

            copy1.name = '近体' + '七绝';
            copy2.name = '近体' + '七律';
            copy3.name = '近体' + '七排';
            copy4.name = '近体' + '五绝';
            copy5.name = '近体' + '五律';
            copy6.name = '近体' + '五排';

            the_series.push(copy1);
            the_series.push(copy2);
            the_series.push(copy3);
            the_series.push(copy4);
            the_series.push(copy5);
            the_series.push(copy6);


            const my_echart = echarts.init(bar_echart.value, 'white', {renderer: 'canvas'})
            my_echart.clear()

            my_echart.setOption({
                title: {
                    text: '唐诗 近体 不限几言 不限绝律 产量',
                    left: 'center',
                    top: '3%'
                },
                toolbox: {
                    show: true,
                    feature: {
                        dataView: {show: true, readOnly: true},
                        // // restore: { show: true },
                        saveAsImage: {show: true}
                    }
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
                    right: '4%',
                    bottom: '5%',
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
                series: the_series
            });

        });

        onMounted(async () => {
            let res_list = [
                [{'name': '古体诗', 'value': 84}, {'name': '近体诗', 'value': 22}],
                // [{'name': '七阳', 'value': 8}, {'name': '十一庚', 'value': 8}, {'name': '一先', 'value': 7}, {'name': '十灰', 'value': 6}, {'name': '九文', 'value': 4}, {'name': '五微', 'value': 3}, {'name': '五歌', 'value': 3}, {'name': '十五删', 'value': 3}],
                [{'name': '七阳', 'value': 8}, {'name': '十一庚', 'value': 8}, {
                    'name': '十灰',
                    'value': 6
                }, {'name': '一先', 'value': 5}, {'name': '九文', 'value': 4}, {
                    'name': '五歌',
                    'value': 3
                }, {'name': '十五删', 'value': 3}, {'name': '一东', 'value': 2}],
                [{'name': '古体诗', 'value': 84}, {'name': '七言律诗', 'value': 10}, {
                    'name': '七言绝句',
                    'value': 10
                }, {'name': '五言律诗', 'value': 1}, {'name': '五言绝句', 'value': 1}]
            ]


            const my_echart = echarts.init(pie_echart.value, 'white', {renderer: 'canvas'})

            const my_echart2 = echarts.init(pie2_echart.value, 'white', {renderer: 'canvas'})

            my_echart.setOption({
                title: {
                    text: '毛泽东诗作用韵',
                    left: 'center',
                    top: '38%'
                },
                toolbox: {
                    show: true,
                    feature: {
                        dataView: {show: true, readOnly: true},
                        // restore: { show: true },
                        saveAsImage: {show: true}
                    }
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
                        center: ['50%', '42%'],
                        name: '用韵偏好',
                        type: 'pie',
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        emphasis: {
                            itemStyle: {
                                borderRadius: 10,
                                borderColor: '#fff',
                                borderWidth: 2,
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)',
                            },
                        },
                        data: res_list[1],
                        radius: ['40%', '70%']
                    }
                ]

            });

            let legend_data = []
            for (let i = 0, len = res_list[2].length; i < len; i++) {
                legend_data.push(res_list[2][i])
            }

            my_echart2.setOption({
                title: {
                    text: '毛泽东诗作种类',
                    left: 'center',
                    top: '1%'
                },
                toolbox: {
                    show: true,
                    feature: {
                        dataView: {show: true, readOnly: true},
                        // restore: { show: true },
                        saveAsImage: {show: true}
                    }
                },
                tooltip: {
                    // trigger: 'axis',
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)',
                    axisPointer: {type: 'cross'}
                },
                legend: {
                    top: '87%',
                    left: 'center',
                    data: legend_data
                },
                series: [
                    {
                        left: 'center',
                        top: 'center',
                        width: '100%',
                        height: '100%',
                        center: ['50%', '48%'],
                        name: '古近体',
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
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
                        data: res_list[0]
                    },
                    {
                        left: 'center',
                        top: 'center',
                        width: '100%',
                        height: '100%',
                        center: ['50%', '48%'],
                        name: '诗种类',
                        type: 'pie',
                        radius: ['45%', '60%'],
                        labelLine: {
                            length: 20
                        },
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            },
                        },
                        data: res_list[2]
                    }
                ]
            });

        });

        onMounted(async () => {

            let res_list = [{'name': '春', 'value': 36}, {'name': '秋', 'value': 18}, {
                'name': '冬',
                'value': 4
            }, {'name': '夏', 'value': 3}]

            const my_echart = echarts.init(pie3_echart.value, 'white', {renderer: 'canvas'})

            my_echart.setOption({
                title: {
                    text: '毛泽东用词分析',
                    left: 'center',
                    top: '1%'
                },
                toolbox: {
                    show: true,
                    feature: {
                        dataView: {show: true, readOnly: true},
                        // restore: { show: true },
                        saveAsImage: {show: true}
                    }
                },
                tooltip: {
                    // trigger: 'axis',
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)',
                    axisPointer: {type: 'cross'}
                },
                legend: {
                    top: '82%',
                    left: 'center'
                },
                series: [
                    {
                        name: '用词偏好',
                        left: 'center',
                        top: 'center',
                        width: '80%',
                        height: '80%',
                        center: ['50%', '50%'],
                        type: 'pie',
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
                        data: res_list,
                    }
                ]

            });
        });

        onMounted(async () => {
            let word_list = [{'name': '红旗', 'value': 13}, {'name': '人间', 'value': 12}, {
                'name': '万里',
                'value': 11
            }, {'name': '革命', 'value': 11}, {'name': '工农', 'value': 10}, {
                'name': '不怕',
                'value': 10
            }, {'name': '英雄', 'value': 10}, {'name': '一声', 'value': 9}, {
                'name': '今日',
                'value': 7
            }, {'name': '当年', 'value': 7}, {'name': '地主', 'value': 7}, {
                'name': '秋风',
                'value': 6
            }, {'name': '红军', 'value': 6}, {'name': '千里', 'value': 6}, {
                'name': '天下',
                'value': 6
            }, {'name': '风雷', 'value': 6}, {'name': '旌旗', 'value': 5}, {
                'name': '青山',
                'value': 5
            }, {'name': '昆仑', 'value': 5}, {'name': '不要', 'value': 5}, {
                'name': '江山',
                'value': 5
            }, {'name': '斗争', 'value': 5}, {'name': '天涯', 'value': 5}, {
                'name': '天地',
                'value': 5
            }, {'name': '大家', 'value': 5}, {'name': '山下', 'value': 4}, {
                'name': '军阀',
                'value': 4
            }, {'name': '长缨', 'value': 4}, {'name': '风雨', 'value': 4}, {
                'name': '东风',
                'value': 4
            }, {'name': '回首', 'value': 4}, {'name': '而今', 'value': 4}, {
                'name': '何时',
                'value': 4
            }, {'name': '滔滔', 'value': 4}, {'name': '如此', 'value': 4}, {
                'name': '团结',
                'value': 4
            }, {'name': '只有', 'value': 4}, {'name': '遍地', 'value': 4}, {
                'name': '人民',
                'value': 4
            }, {'name': '世界', 'value': 4}, {'name': '神州', 'value': 4}, {
                'name': '乘风',
                'value': 4
            }, {'name': '多少', 'value': 4}, {'name': '从来', 'value': 4}, {
                'name': '四海',
                'value': 4
            }, {'name': '不须', 'value': 4}, {'name': '文章', 'value': 4}, {
                'name': '四方',
                'value': 4
            }, {'name': '关山', 'value': 3}, {'name': '江天', 'value': 3}, {
                'name': '黄洋界',
                'value': 3
            }, {'name': '一片', 'value': 3}, {'name': '人生', 'value': 3}, {
                'name': '春光',
                'value': 3
            }, {'name': '寥廓', 'value': 3}, {'name': '漫天', 'value': 3}, {
                'name': '百万',
                'value': 3
            }, {'name': '滚滚', 'value': 3}, {'name': '白云山', 'value': 3}, {
                'name': '苍茫',
                'value': 3
            }, {'name': '今朝', 'value': 3}, {'name': '年少', 'value': 3}, {
                'name': '连天',
                'value': 3
            }, {'name': '日月', 'value': 3}, {'name': '东方', 'value': 3}, {
                'name': '莫道',
                'value': 3
            }, {'name': '青天', 'value': 3}, {'name': '西风', 'value': 3}, {
                'name': '大军',
                'value': 3
            }, {'name': '壮志', 'value': 3}, {'name': '延安', 'value': 3}, {
                'name': '明月',
                'value': 3
            }, {'name': '凯歌', 'value': 3}, {'name': '时节', 'value': 3}, {
                'name': '赤县',
                'value': 3
            }, {'name': '不见', 'value': 3}, {'name': '千年', 'value': 3}, {
                'name': '谈笑',
                'value': 3
            }, {'name': '何处', 'value': 3}, {'name': '长江', 'value': 3}, {
                'name': '南北',
                'value': 3
            }, {'name': '太空', 'value': 3}, {'name': '千载', 'value': 3}, {
                'name': '九派',
                'value': 3
            }, {'name': '列宁', 'value': 3}, {'name': '人人', 'value': 3}, {
                'name': '独有',
                'value': 3
            }, {'name': '大地', 'value': 3}, {'name': '奋起', 'value': 3}, {
                'name': '春来',
                'value': 3
            }, {'name': '虎豹', 'value': 3}, {'name': '霹雳', 'value': 3}, {
                'name': '试看',
                'value': 3
            }, {'name': '自由', 'value': 3}, {'name': '少年', 'value': 3}, {
                'name': '到处',
                'value': 3
            }, {'name': '处处', 'value': 3}, {'name': '压迫', 'value': 3}, {
                'name': '农民',
                'value': 3
            }, {'name': '飞扬', 'value': 3}, {'name': '流水', 'value': 3}, {
                'name': '工作',
                'value': 3
            }, {'name': '豪绅', 'value': 3}, {'name': '东西', 'value': 3}, {
                'name': '工人',
                'value': 3
            }, {'name': '打倒', 'value': 3}, {'name': '群众', 'value': 3}, {
                'name': '乾坤',
                'value': 3
            }, {'name': '浮云', 'value': 3}, {'name': '零落', 'value': 2}, {
                'name': '长剑',
                'value': 2
            }, {'name': '东海', 'value': 2}, {'name': '从此', 'value': 2}, {
                'name': '敌军',
                'value': 2
            }, {'name': '更加', 'value': 2}, {'name': '金瓯', 'value': 2}, {
                'name': '田分',
                'value': 2
            }, {'name': '重阳', 'value': 2}, {'name': '胜似', 'value': 2}, {
                'name': '何方',
                'value': 2
            }, {'name': '高山', 'value': 2}, {'name': '十万', 'value': 2}, {
                'name': '天兵',
                'value': 2
            }, {'name': '万丈', 'value': 2}, {'name': '鲲鹏', 'value': 2}, {
                'name': '赣水',
                'value': 2
            }, {'name': '一角', 'value': 2}, {'name': '万木', 'value': 2}, {
                'name': '霜天',
                'value': 2
            }, {'name': '烂漫', 'value': 2}, {'name': '努力', 'value': 2}, {
                'name': '重霄',
                'value': 2
            }, {'name': '有人', 'value': 2}, {'name': '雷霆', 'value': 2}, {
                'name': '君行',
                'value': 2
            }, {'name': '洞庭', 'value': 2}, {'name': '宇宙', 'value': 2}, {
                'name': '纷纭',
                'value': 2
            }, {'name': '高峰', 'value': 2}, {'name': '颠连', 'value': 2}, {
                'name': '奔腾',
                'value': 2
            }, {'name': '霜晨', 'value': 2}, {'name': '从头越', 'value': 2}, {
                'name': '苍山',
                'value': 2
            }, {'name': '五岭', 'value': 2}, {'name': '磅礴', 'value': 2}, {
                'name': '天寒',
                'value': 2
            }, {'name': '江河', 'value': 2}, {'name': '一截', 'value': 2}, {
                'name': '环球',
                'value': 2
            }, {'name': '漫卷', 'value': 2}, {'name': '长城', 'value': 2}, {
                'name': '惟余',
                'value': 2
            }, {'name': '一代', 'value': 2}, {'name': '弯弓', 'value': 2}, {
                'name': '风流人物',
                'value': 2
            }, {'name': '一时', 'value': 2}, {'name': '一枝', 'value': 2}, {
                'name': '三千',
                'value': 2
            }, {'name': '将军', 'value': 2}, {'name': '沧桑', 'value': 2}, {
                'name': '崎岖',
                'value': 2
            }, {'name': '何以', 'value': 2}, {'name': '不论', 'value': 2}, {
                'name': '军民',
                'value': 2
            }, {'name': '还我河山', 'value': 2}, {'name': '呜呼', 'value': 2}, {
                'name': '七子',
                'value': 2
            }, {'name': '兄弟', 'value': 2}, {'name': '因此', 'value': 2}, {
                'name': '一则',
                'value': 2
            }, {'name': '盛德', 'value': 2}, {'name': '恨偏', 'value': 2}, {
                'name': '亲疏',
                'value': 2
            }, {'name': '大端', 'value': 2}, {'name': '以此', 'value': 2}, {
                'name': '大海',
                'value': 2
            }, {'name': '有生', 'value': 2}, {'name': '一日', 'value': 2}, {
                'name': '此时',
                'value': 2
            }, {'name': '苍生', 'value': 2}, {'name': '戎衣', 'value': 2}, {
                'name': '上行',
                'value': 2
            }, {'name': '大江', 'value': 2}, {'name': '太盛', 'value': 2}, {
                'name': '忠魂',
                'value': 2
            }, {'name': '曙光', 'value': 2}, {'name': '迎春', 'value': 2}, {
                'name': '团圆',
                'value': 2
            }, {'name': '诗人', 'value': 2}, {'name': '多年', 'value': 2}, {
                'name': '战旗',
                'value': 2
            }, {'name': '萧瑟', 'value': 2}, {'name': '长亭', 'value': 2}, {
                'name': '卅年',
                'value': 2
            }, {'name': '杭州', 'value': 2}, {'name': '长沙', 'value': 2}, {
                'name': '极目',
                'value': 2
            }, {'name': '不管', 'value': 2}, {'name': '杨柳', 'value': 2}]


            const my_echart = echarts.init(wc_echart.value, 'white', {renderer: 'canvas'})

            my_echart.setOption({
                /*title: {
                  text: '词频词云',
                  left: '0%',
                  top: '0%'
                },*/
                toolbox: {
                    show: true,
                    feature: {
                        dataView: {show: true, readOnly: true},
                        // restore: { show: true },
                        saveAsImage: {show: true}
                    }
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


        onMounted(async () => {
            let word_list = [{'name': '菩萨蛮', 'value': 7}, {'name': '水龙吟', 'value': 7}, {
                'name': '念奴娇',
                'value': 4
            }, {'name': '清平乐', 'value': 3}, {'name': '渔家傲', 'value': 3}, {
                'name': '沁园春',
                'value': 3
            }, {'name': '贺新郎', 'value': 3}, {'name': '生查子', 'value': 3}, {
                'name': '西江月',
                'value': 2
            }, {'name': '采桑子', 'value': 2}, {'name': '蝶恋花', 'value': 2}, {
                'name': '浣溪沙',
                'value': 2
            }, {'name': '水调歌头', 'value': 2}, {'name': '江城子', 'value': 2}, {
                'name': '如梦令',
                'value': 1
            }, {'name': '减字木兰花', 'value': 1}, {'name': '忆秦娥', 'value': 1}, {
                'name': '临江仙',
                'value': 1
            }, {'name': '浪淘沙', 'value': 1}, {'name': '归国谣', 'value': 1}, {
                'name': '虞美人',
                'value': 1
            }, {'name': '卜算子', 'value': 1}, {'name': '满江红', 'value': 1}, {
                'name': '六州歌头',
                'value': 1
            }, {'name': '梅花引', 'value': 1}]

            const my_echart = echarts.init(wc2_echart.value, 'white', {renderer: 'canvas'})

            my_echart.setOption({
                /*title: {
                  text: '词频词云',
                  left: '0%',
                  top: '0%'
                },*/
                toolbox: {
                    show: true,
                    feature: {
                        dataView: {show: true, readOnly: true},
                        // restore: { show: true },
                        saveAsImage: {show: true}
                    }
                },
                tooltip: {
                    // trigger: 'axis',
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c}',
                    axisPointer: {type: 'cross'}
                },
                series: [{
                    name: '词牌作品',
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

        });

        return {
            dynasty_options,
            dynasty_value,

            metric_options,
            metric_value,
            yan_options,
            yan_value,
            jue_options,
            jue_value,

            author_num_value,
            author_num_options,
            bar_echart,
            dynasty_change,
            metric_value_change,
            yan_value_change,
            author_output_search,

            dynasty2_options,
            dynasty2_value,
            author2_input,
            author2_input_disable,
            rhyme_num_options,
            rhyme_num_value,
            pie_echart,
            pie2_echart,
            dynasty2_change,
            poetry_statistics_search,

            dynasty3_options,
            dynasty3_value,
            author3_input,
            author3_input_disable,
            word_list_str,
            pie3_echart,
            dynasty3_change,
            word_list_search,

            dynasty4_options,
            dynasty4_value,
            phrase_options,
            phrase_value,
            word_num_options,
            word_num_value,
            wc_echart,
            word_frequency_search,

            dynasty5_options,
            dynasty5_value,
            author5_input,
            author5_input_disable,
            rhythmic_num_options,
            rhythmic_num_value,
            wc2_echart,
            dynasty5_change,
            rhythmic_statistics_search,


            Search,
        }
    },
}
</script>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 0px;
}

.my .el-card {
  --el-card-padding: 0px;
  margin-bottom: 15px;
  border: none;
  background-color: transparent !important;
}

/*.my el-cascader {
  --el-border-color: white !important;
  --el-fill-color-light: none !important;
  --el-fill-color-blank: none !important;
  --el-disabled-border-color: none !important;
}*/
</style>