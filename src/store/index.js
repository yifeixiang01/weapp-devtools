import Vue from 'vue'
import Vuex from 'vuex'
const  ElectronStore = window.require('electron-store')
const electronStore = new ElectronStore();
import {$getIPAddress} from '../assets/js/tools'

Vue.use(Vuex)

let config = electronStore.get('weappConfig') || {}
let weappList = electronStore.get('weappList') || []
export default new Vuex.Store({
  state: {
    clinetInfo: {
      hostIP: $getIPAddress(),      //电脑IP
      id: '',
      nickname: config.nickname || '',
    },
    localDeviceList: [],  //本地连接的设备列表
    remoteDeviceList: [], //服务端的设备列表
    weappList: weappList,        //小程序列表
    config: config,           //配置信息
    mirrorConfig: {                     //******投屏配置信息
      windowTitle: '',                     //窗口标题
      alwaysOnUp: false,                   //保持最前
      fullscreen: false,                   //全屏启动
      screenOff: false,                    //黑屏启动
      borderless: false,                   //无边框
      stayAwake: false,                    //屏幕常量
      showTouches: false,                  //显示触摸轨迹
      disableScreensaver: false,           //关闭屏幕保护
      record: false,                       //投屏的时候进行录屏
    },
    selectedDevice: [],             //选中的设备
    selectedWeapp: [],              //选中的小程序          
  },
  mutations: {
    //获取服务器分配的id
    changeBaseInfo(state, payload){
      state.clinetInfo.id = payload.id;
    },
    //修改本地列表
    changeLocalList(state, payLoad){

      state.localDeviceList = payLoad.list
    },
    //修改远程列表
    changeRemoteList(state, payLoad){

      state.remoteDeviceList = payLoad.list
    },
    //设置小程序列表
    setWeappList(state, payLoad){
      let weappList = payLoad.weappList;
      state.weappList = weappList
      state.selectedWeapp = weappList.filter(item => item.selected)
      
      electronStore.set('weappList', payLoad.weappList)
    },
    //设置配置列表
    setConfig(state, payLoad){
      let {wechatDevtoolsPath, weappCompilePath, weappSavePath, nickname} = payLoad;
      state.clinetInfo.nickname = nickname
      state.config = {wechatDevtoolsPath, weappCompilePath, weappSavePath, nickname}
      electronStore.set('weappConfig', {wechatDevtoolsPath, weappCompilePath, weappSavePath, nickname})
    },
    //设置镜像配置信息
    setMirrorConfig(state, payload){

      state.mirrorConfig = payload.mirrorConfig
    }
  },
  actions: {

  },
  modules: {

  }
})
