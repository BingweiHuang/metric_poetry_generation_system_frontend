import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

// 静态导入
import AICreateView from '@/views/AICreateView.vue'
import PoetrySearchView from '@/views/PoetrySearchView.vue'
import TestView from '@/views/TestView.vue'
import MetricDetectionView from '@/views/MetricDetectionView.vue'
import RhymeSearchView from '@/views/RhymeSearchView.vue'
import FlyingOrderView from '@/views/FlyingOrderView.vue'
import AnalyzeView from '@/views/AnalyzeView.vue'
import HomeView from '@/views/HomeView.vue'
import ProfileView from '@/views/ProfileView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import WorldCircleView from '@/views/WorldCircleView.vue'
import AboutView from '@/views/AboutView.vue'
import store from "@/store";
import {ElMessage} from "element-plus";

// 路由懒加载 需要时才导入组件

const routes: Array<RouteRecordRaw> = [
  {
    path: '/AICreate',
    name: 'AICreateView',
    component: AICreateView,

  },
  {
    path: '/PoetrySearch',
    name: 'PoetrySearchView',
    component: PoetrySearchView,

  },
  {
    path: '/RhymeSearch',
    name: 'RhymeSearchView',
    component: RhymeSearchView,

  },
  {
    path: '/MetricDetection',
    name: 'MetricDetectionView',
    component: MetricDetectionView,

  },
  {
    path: '/FlyingOrder',
    name: 'FlyingOrderView',
    component: FlyingOrderView,

  },
  {
    path: '/Analyze',
    name: 'AnalyzeView',
    // component: () => import('@/views/AnalyzeView.vue'),
    component: AnalyzeView,

  },
  {
    path: '/',
    name: 'HomeView',
    // component: () => import('@/views/HomeView.vue'), // 懒加载
    component: HomeView,

  },
  {
    path: '/Profile/:account_id',
    name: 'ProfileView',
    // component: () => import('@/views/HomeView.vue'), // 懒加载
    component: ProfileView,

  },
  {
    path: '/WorldCircle',
    name: 'WorldCircleView',
    // component: () => import('@/views/HomeView.vue'), // 懒加载
    component: WorldCircleView,
    // 每路守卫
    beforeEnter: (to, from, next) => {
      if (store.getters.get_is_login) next(); // 登陆状态才放行
      else {
        ElMessage({
          showClose: true,
          message: '请您先登录！',
          type: 'error',
          duration: 3000,
        })
      }
    }
  },
  {
    path: '/About',
    name: 'AboutView',
    component: AboutView
  },
  {
    path: '/:path(.*)',
    name: 'NotFoundView',
    component: NotFoundView
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 全局 守卫
/*router.beforeEach((to, from, next) => {
  console.log(to);
  console.log(from);
  /!*if (123 ) next();*!/ // 是否放行

})*/

export default router
