import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

// 静态导入
// import HomeView from '@/views/HomeView.vue'
import AICreateView from '@/views/AICreateView.vue'
import PoetrySearchView from '@/views/PoetrySearchView.vue'
import TestView from '@/views/TestView.vue'

// 路由懒加载 需要时才导入组件
const HomeView = () => import('@/views/HomeView.vue')

const routes: Array<RouteRecordRaw> = [
  {
    path: '/AICreate',
    name: 'AICreateView',
    component: AICreateView
  },
  {
    path: '/PoetrySearch',
    name: 'PoetrySearchView',
    component: PoetrySearchView
  },
  /*{
    path: '/Figure/FigureDetail/:fig_id',
    name: 'FigureDetailView',
    component: FigureDetailView
  },*/
  {
    path: '/',
    name: 'HomeView',
    component: HomeView
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

  /*{
    path: '/:path(.*)',
    name: 'NotFoundView',
    component: NotFoundView
  },*/
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
