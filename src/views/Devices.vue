<template>
    <div>
        <v-row>
            <v-col sm="3"><v-btn @click="clearWecarmasStorage">清除小场景缓存</v-btn></v-col>
            <v-col sm="3"><v-btn @click="closeWecarmas">关闭小场景</v-btn></v-col>
            <v-col sm="3"><v-btn @click="startWecarmas">打开小场景</v-btn></v-col>
            <v-col sm="3"><v-btn @click="screenCap">截屏</v-btn></v-col>
            <!-- <v-col sm="3"><v-btn>输出log</v-btn></v-col> -->
            <v-col sm="3"><v-btn @click="openSetting">打开原生界面</v-btn></v-col>
            <v-col sm="3"><v-btn @click="openWechat">打开微信</v-btn></v-col>
            <!-- <v-col sm="3"><v-btn @click="getAppPkgName">查看应用名和包名</v-btn></v-col> -->
            <!-- <v-col sm="3"><v-btn @click="startCMD">打开cmd</v-btn></v-col> -->
            <!-- <v-col sm="3"><v-btn @click="getDevices">查看连接的设备</v-btn></v-col> -->
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
            $getDevices().then(() => {
                $startApp('com.tencent.wecarmas/com.tencent.wecarmas.ui.activity.HomeActivity')
            }).catch(err => {
                alert(err)
            })
            
        },
        closeWecarmas(){
            $getDevices().then(() => {
                $closeApp('com.tencent.wecarmas')
            }).catch(err => {
                alert(err)
            })
            
        },
        openWechat(){
            $getDevices().then(() => {
                $startApp('com.tencent.mm/com.tencent.mm.ui.LauncherUI')
            }).catch(err => {
                alert(err)
            })
            
        },
        screenCap(){
            $getDevices().then(() => {
                let {weappSavePath} = electronStore.get('weappConfig')
                $screenCap(weappSavePath)
            }).catch(err => {
                alert(err)
            })
            
        },
        openSetting(){
            $getDevices().then(() => {
                $startApp('com.android.settings/.Settings')
            }).catch(err => {
                alert(err)
            })
            
        },
        clearWecarmasStorage(){
            $getDevices().then(() => {
                $clearAppStorage('com.tencent.wecarmas')
            }).catch(err => {
                alert(err)
            })
            
        },
        getAppPkgName(){
            $getDevices().then(() => {
                $getAppName()
            }).catch(err => {
                alert(err)
            })
            
        },
        startCMD(){

            $startCMD()
        },
        getDevices(){
            $getDevices().catch(err => {alert(err)})
        }
    }
    
}
</script>