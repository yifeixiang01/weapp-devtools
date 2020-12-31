<template>
  <v-navigation-drawer mini-variant  mini-variant-width="200" absolute  permanent  right app >

      <v-list dense right>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title><v-btn class="ma-2" :loading="compileLoading" @click="runCompile">开始编译</v-btn></v-list-item-title>
          </v-list-item-content>
        </v-list-item> 
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title><v-btn class="ma-2" :disabled="(selectedDevice.length == 0)" @click="startMirror">开始投屏</v-btn></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title><v-btn class="ma-2" :disabled="(selectedDevice.length == 0)" @click="screenCap">截屏</v-btn></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title><v-btn class="ma-2" :disabled="(selectedDevice.length == 0)" @click="rootDevice">Root</v-btn></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title><v-btn class="ma-2" :disabled="(selectedDevice.length == 0)" @click="getAppPkgName">查看应用包名</v-btn></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title><v-btn class="ma-2" :disabled="(selectedDevice.length == 0)" @click="showAllApp">显示所有应用</v-btn></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title><v-btn class="ma-2" :disabled="(selectedDevice.length == 0)" @click="openSetting">打开原生界面</v-btn></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
</template>
<script>
import {$compileFile, $copyFile, $pushToMobile, $isAppRunning, $isSelectDevice, $screenCap, $getAppName, $showLaunch, $rootDevice, $startApp} from '../assets/js/tools'
const scrcpy = require('../assets/js/scrcpy')
import { mapState } from 'vuex'
export default {
  name: 'OperationBar',
  data(){
    return {
      compileLoading: false
    }
  },
  computed: {
    ...mapState(['clinetInfo', 'selectedDevice', 'localDeviceList','config', 'selectedWeapp', 'mirrorConfig'])
  },
  methods: {
    //开始运行 编译->拷贝->push到车机
    runCompile(){
      //获取配置信息
      let {weappCompilePath, wechatDevtoolsPath, weappSavePath} = this.config
      let {serial} = this.selectedDevice[0]

      if(!weappCompilePath || !wechatDevtoolsPath || !weappSavePath){
        console.log('没有配置文件')
        this.$router.go('About')
        return 
      }

      //判断是否选择小程序
      if(this.selectedWeapp.length == 0){
        console.log('请先选择小程序')
        return 
      }
      let {name:weappName, appName, path:projectPath} = this.selectedWeapp[0];
      this.compileLoading = true
      $isAppRunning('WeChat', '微信桌面版').then(()=>{
        return $compileFile(weappName, projectPath, weappCompilePath, wechatDevtoolsPath)
      })
      .then(() => {
        let resourcePath = `${weappCompilePath}/__APP__.wxapkg`
        let aimPath = `${weappSavePath}/${appName}.wxapkg`

        return $copyFile(resourcePath, aimPath)
      })
      .then(() => {
        return $isSelectDevice(this.selectedDevice, this.localDeviceList)
      })
      .then(() => {

        let pkgPath = `${weappSavePath}/${appName}.wxapkg`
        return $pushToMobile(pkgPath, weappName, appName, serial)
      })
      .then(() => {
        this.compileLoading = false
      })
      .catch((err) => {
        //console.error(`运行出错:${err}`)
        this.compileLoading = false
        alert(err)
      })
    },
    //开始投屏
    startMirror(){
      let {weappSavePath} = this.config
      console.log('保存目录', weappSavePath)
      let {serial} = this.selectedDevice[0]
      scrcpy.start(this.mirrorConfig, serial, weappSavePath) 
    },
    screenCap(){
        $isSelectDevice(this.selectedDevice, this.localDeviceList)
        .then(() => {
          let {weappSavePath} = this.config
          let {serial} = this.selectedDevice[0]
          $screenCap(weappSavePath,serial)
      }).catch(err => {
          alert(err)
      })
      
    },
    //获取应用包名
    getAppPkgName(){
            $isSelectDevice(this.selectedDevice, this.localDeviceList)
            .then(() => {
                let {serial} = this.selectedDevice[0]
                return $getAppName(serial)
            }).catch(err => {
                alert(err)
            })
            
    },
    //显示所有应用
    showAllApp(){
      $isSelectDevice(this.selectedDevice, this.localDeviceList)
      .then(() => {
          let {serial} = this.selectedDevice[0]
          return $showLaunch(serial)
      })
    },
    //root
    rootDevice(){
        $isSelectDevice(this.selectedDevice, this.localDeviceList)
        .then(() => {
            let {serial} = this.selectedDevice[0]
            return $rootDevice(serial)
        })
        .then((res) => {
            alert(res)
        }).catch(err => {
            alert(err)
        })
    },
    //打开原生
    openSetting(){
            $isSelectDevice(this.selectedDevice, this.localDeviceList).then(() => {
                let {serial} = this.selectedDevice[0]
                return $startApp('com.android.settings/.Settings',serial)
            }).catch(err => {
                alert(err)
            })
            
    },
  }
}
</script>
<style lang="stylus">

</style>