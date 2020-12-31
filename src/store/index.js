import Vue from 'vue'
import Vuex from 'vuex'
const  ElectronStore = window.require('electron-store')
const electronStore = new ElectronStore();
import {$getIPAddress} from '../assets/js/tools'

Vue.use(Vuex)

let config = electronStore.get('weappConfig') || {}
let weappList = electronStore.get('weappList') || []
let selectedWeapp = weappList.filter(item => item.selected);
let selectedDevice = electronStore.get('selectedDevice') || []
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
    selectedDevice: selectedDevice,             //选中的设备
    selectedWeapp: selectedWeapp,              //选中的小程序          
  },
  mutations: {
    //获取服务器分配的id
    changeBaseInfo(state, payLoad){
      state.clinetInfo.id = payLoad.id;
    },
    //本地添加连接的设备
    addLocalDevice(state, payLoad){
      state.localDeviceList.push(payLoad.device)
      if(state.localDeviceList.length == 1){
        state.selectedDevice = [payLoad.device]
      }
    },
    //本地删除连接的设备
    removeLocalDevice(state, payLoad){
      state.localDeviceList = state.localDeviceList.filter(item => item.deviceId != payLoad.deviceId)
    },
    //修改本地设备的状态
    changeLocalDeviceState(state, payLoad){
      let {deviceId, key, value} = payLoad
      state.localDeviceList.forEach(item => {
        if(item.deviceId === deviceId){
          item[key] = value
        }
      })
    },
    //修改远程列表
    changeRemoteList(state, payLoad){
      let list = payLoad.list
      list.forEach(remoteDevice => {
        state.localDeviceList.forEach(localDevice => {
          if(remoteDevice.deviceId === localDevice.deviceId){
            remoteDevice.isLocalDevice = true
          }
        })
        
      })
      state.remoteDeviceList = list

    },
    //移除某个客户端下的所有设备
    removeClientDevice(state, payLoad){
      let {nickname} = payLoad
      state.localDeviceList = state.localDeviceList.filter(device => device.owner !== nickname)
    },
    //设置小程序列表
    setWeappList(state, payLoad){
      let weappList = payLoad.weappList;
      state.weappList = weappList
      state.selectedWeapp = weappList.filter(item => item.selected)
      
      electronStore.set('weappList', payLoad.weappList)
      console.log(state.selectedWeapp)
    },
    //设置配置列表
    setConfig(state, payLoad){
      let {wechatDevtoolsPath, weappCompilePath, weappSavePath, nickname} = payLoad;
      state.clinetInfo.nickname = nickname
      state.config = {wechatDevtoolsPath, weappCompilePath, weappSavePath, nickname}
      electronStore.set('weappConfig', {wechatDevtoolsPath, weappCompilePath, weappSavePath, nickname})
    },
    //设置镜像配置信息
    setMirrorConfig(state, payLoad){
      state.mirrorConfig = payLoad.mirrorConfig
    },
    //选择设备
    selectDevice(state, payLoad){
      console.log(payLoad)
      state.selectedDevice = [payLoad.device]
      electronStore.set('selectedDevice', state.selectedDevice)
    },
    //移除选中的设备
    removeSelectedDevice(state){
      state.selectedDevice = []
    }
  },
  actions: {

  },
  modules: {

  }
})
