import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    localDeviceList: [],
    remoteDeviceList: []
  },
  mutations: {
    //修改本地列表
    changeLocalList(state, payLoad){
      state.localDeviceList = payLoad.list
    },
    //修改远程列表
    changeRemoteList(state, payLoad){
      state.remoteDeviceList = payLoad.list
    }
  },
  actions: {

  },
  modules: {

  }
})
