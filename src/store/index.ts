import { createStore } from 'vuex'
import ModuleRhyme from './rhyme'
import ModuleAccount from './account'

export default createStore({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    rhyme: ModuleRhyme,
    account: ModuleAccount,
  }
})
