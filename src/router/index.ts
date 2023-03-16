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
  /*{
    path: '/Figure/FigureDetail/:fig_id',
    name: 'FigureDetailView',
    component: FigureDetailView
  },*/
  {
    path: '/',
    name: 'HomeView',
    // component: () => import('@/views/HomeView.vue'), // 懒加载
    component: HomeView,

  },
  {
    path: '/Profile',
    name: 'ProfileView',
    // component: () => import('@/views/HomeView.vue'), // 懒加载
    component: ProfileView,

  },
  {
    path: '/WorldCircle',
    name: 'WorldCircleView',
    // component: () => import('@/views/HomeView.vue'), // 懒加载
    component: WorldCircleView,

  },

  {
    path: '/Test',
    name: 'TestView',
    component: TestView,


    // 每路守卫
    beforeEnter: (to, from, next) => {
      console.log(to);
      console.log(from);
      next(); // 是否放行
    }
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
