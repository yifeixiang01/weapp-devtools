<template>
    <v-form  ref="form"  v-model="valid"  lazy-validation>
        
        <v-row><v-col cols="10"><v-text-field  v-model="mirrorConfig.windowTitle" outlined dense label="窗口标题" hint="默认为设备名称" persistent-hint></v-text-field></v-col></v-row>
        <!-- <v-row><v-col cols="10"><v-slider min="0"  max="1920" v-model="resolution " step="10"  label="画面分辨率"></v-slider></v-col><v-col><span>{{resolution}}</span></v-col></v-row>
        <v-row><v-col cols="10"> <v-slider  v-model="bitRate"  :max="1024" step="10"  label="传输比特率"  class="align-center"></v-slider></v-col><v-col><span>{{bitRate}}</span></v-col></v-row> -->
        <v-row>
          <v-col cols="3">
            <v-checkbox v-model="mirrorConfig.alwaysOnUp" label="窗口置顶"></v-checkbox>
          </v-col>
          <v-col  cols="3">
            <v-checkbox v-model="mirrorConfig.fullscreen"  label="全屏启动"></v-checkbox>
          </v-col>
          <v-col  cols="3">
            <v-checkbox v-model="mirrorConfig.screenOff"  label="黑屏启动"></v-checkbox>
          </v-col>
          <v-col  cols="3">
            <v-checkbox v-model="mirrorConfig.borderless"  label="无边框"></v-checkbox>
          </v-col>
          <v-col  cols="3">
            <v-checkbox v-model="mirrorConfig.stayAwake"  label="保持常亮"></v-checkbox>
          </v-col>
          <v-col  cols="3">
            <v-checkbox v-model="mirrorConfig.showTouches"  label="显示触摸轨迹"></v-checkbox>
          </v-col>
          <v-col  cols="3">
            <v-checkbox v-model="mirrorConfig.disableScreensaver"  label="关闭屏保"></v-checkbox>
          </v-col>
          <v-col  cols="3">
            <v-checkbox v-model="mirrorConfig.record"  label="开启录屏"></v-checkbox>
          </v-col>
          <!-- <v-col cols="4">
            <v-checkbox v-model="selected"  label="悬浮工具栏"  value="John2"></v-checkbox>
          </v-col> -->
          <!-- <v-col  cols="4">
            <v-checkbox v-model="selected"  label="旋转镜像"  value="John5"></v-checkbox>
          </v-col> -->

        </v-row>
        <!-- <v-btn  :disabled="!valid"  color="success"  class="mr-4"  @click="submit">保存设置</v-btn> -->
        <div class="text-center">
          <v-btn  :disabled="!valid" outlined  color="success"  class="mr-4"  @click="start">启动</v-btn>
        </div>
        
      </v-form>
  
</template>

<script>
const Scrcpy = require('../assets/js/scrcpy')
const scrcpyTool = new Scrcpy();
import { mapState } from 'vuex'

export default {
  data: ()=>({
    valid: true,
    resolution: 1024,
    bitRate: 100,
    isWindowTop: false,
  }),
  created(){
    
  },
  computed: {
    ...mapState(['mirrorConfig', 'config'])
  },
  methods: {
    start(){
      let {weappSavePath} = this.config
      console.log('保存目录', weappSavePath)
      scrcpyTool.start(this.mirrorConfig, weappSavePath) 
    },
    submit(){
      this.$store.commit({type: 'setMirrorConfig', mirrorConfig: this.mirrorConfig})
    }
  }
}
</script>