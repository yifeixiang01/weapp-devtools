<template>
  <v-form  ref="form"  v-model="valid"  lazy-validation>
    
    <v-row><v-col cols="10"><v-text-field  v-model="windowSetting.windowTitle" outlined dense label="窗口标题" hint="默认为设备名称" persistent-hint></v-text-field></v-col></v-row>
    <v-row><v-col cols="10"><v-slider min="0"  max="1920" v-model="resolution " step="10"  label="画面分辨率"></v-slider></v-col><v-col><span>{{resolution}}</span></v-col></v-row>
    <v-row><v-col cols="10"> <v-slider  v-model="bitRate"  :max="1024" step="10"  label="传输比特率"  class="align-center"></v-slider></v-col><v-col><span>{{bitRate}}</span></v-col></v-row>
    <v-row>
      <v-col cols="3">
        <v-checkbox v-model="windowSetting.alwaysOnUp" label="窗口置顶"></v-checkbox>
      </v-col>
      <v-col  cols="3">
        <v-checkbox v-model="windowSetting.fullscreen"  label="全屏启动"></v-checkbox>
      </v-col>
      <v-col  cols="3">
        <v-checkbox v-model="windowSetting.screenOff"  label="黑屏启动"></v-checkbox>
      </v-col>
      <v-col  cols="3">
        <v-checkbox v-model="windowSetting.borderless"  label="无边框"></v-checkbox>
      </v-col>
      <v-col  cols="3">
        <v-checkbox v-model="windowSetting.stayAwake"  label="保持常亮"></v-checkbox>
      </v-col>
      <v-col  cols="3">
        <v-checkbox v-model="windowSetting.showTouches"  label="显示触摸轨迹"></v-checkbox>
      </v-col>
      <v-col  cols="3">
        <v-checkbox v-model="windowSetting.disableScreensaver"  label="关闭屏保"></v-checkbox>
      </v-col>
      <!-- <v-col cols="4">
        <v-checkbox v-model="selected"  label="悬浮工具栏"  value="John2"></v-checkbox>
      </v-col> -->
      <!-- <v-col  cols="4">
        <v-checkbox v-model="selected"  label="旋转镜像"  value="John5"></v-checkbox>
      </v-col> -->

    </v-row>
    <v-btn  :disabled="!valid"  color="success"  class="mr-4"  @click="submit">保存设置</v-btn>
    <v-btn  :disabled="!valid"  color="success"  class="mr-4"  @click="start">启动</v-btn>
  </v-form>
</template>

<script>
let {ipcRenderSend, ipcRendererOn} = require('../assets/js/store')
const Scrcpy = require('../assets/js/scrcpy')
const scrcpyTool = new Scrcpy();

export default {
  data: ()=>({
    windowSetting: {
      windowTitle: '',                     //窗口标题
      alwaysOnUp: false,                   //保持最前
      fullscreen: false,                   //全屏启动
      screenOff: false,                    //黑屏启动
      borderless: false,                   //无边框
      stayAwake: false,                    //屏幕常量
      showTouches: false,                  //显示触摸轨迹
      disableScreensaver: false,           //关闭屏幕保护
    },
    valid: true,
    resolution: 1024,
    bitRate: 100,
    isWindowTop: false,
  }),
  created(){
    this.getConfig();
  },
  methods: {
    getConfig(){
      ipcRenderSend('getMirrorConfig')

      ipcRendererOn('getMirrorConfig-reply', value => {
        console.log('获取到镜像配置', value)
        if(value){
          this.windowSetting = value
        }
        
      })
    },
    start(){
      scrcpyTool.start(this.windowSetting) 
    },
    submit(){
      ipcRenderSend('setMirrorConfig', this.windowSetting)
    }
  }
}
</script>