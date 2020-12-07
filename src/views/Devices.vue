<template>
    <div>
        <v-row>
            <v-col sm="3"><v-btn @click="clearWecarmasStorage">清除小场景缓存</v-btn></v-col>
            <v-col sm="3"><v-btn @click="closeWecarmas">关闭小场景</v-btn></v-col>
            <v-col sm="3"><v-btn @click="startWecarmas">打开小场景</v-btn></v-col>
            <v-col sm="3"><v-btn @click="screenCap">截屏</v-btn></v-col>
            <v-col sm="3"><v-btn>输出log</v-btn></v-col>
            <v-col sm="3"><v-btn @click="openSetting">打开原生界面</v-btn></v-col>
            <v-col sm="3"><v-btn @click="openWechat">打开微信</v-btn></v-col>
            <v-col sm="3"><v-btn @click="getAppPkgName">查看应用名和包名</v-btn></v-col>
            <v-col sm="3"><v-btn @click="startCMD">打开cmd</v-btn></v-col>
            <v-col sm="3"><v-btn @click="getDevices">查看连接的设备</v-btn></v-col>
        </v-row>
    </div>
</template>

<script>
// import adbkit from '../assets/js/adb'
const  ElectronStore = window.require('electron-store')
const electronStore = new ElectronStore();
import {$startApp, $screenCap, $clearAppStorage, $getAppName, $closeApp, $startCMD, $getDevices} from '../assets/js/tools'

export default {
    data: () => ({
        devicesList: [
            {name: '111', id: 123}
        ]
    }),
    created(){
        // adbkit.onDevices()
    },
    methods: {
        startWecarmas(){
            $startApp('com.tencent.wecarmas/com.tencent.wecarmas.ui.activity.HomeActivity')
        },
        closeWecarmas(){
            $closeApp('com.tencent.wecarmas')
        },
        openWechat(){
            $startApp('com.tencent.mm/com.tencent.mm.ui.LauncherUI')
        },
        screenCap(){
            let {weappSavePath} = electronStore.get('weappConfig')
            $screenCap(weappSavePath)
        },
        openSetting(){
            $startApp('com.android.settings/.Settings')
        },
        clearWecarmasStorage(){
            $clearAppStorage('com.tencent.wecarmas')
        },
        getAppPkgName(){
            $getAppName()
        },
        startCMD(){
            $startCMD()
        },
        getDevices(){
            $getDevices()
        }
    }
    
}
</script>