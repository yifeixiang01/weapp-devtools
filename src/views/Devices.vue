<template>
    <div>
        <v-row>
            <v-col sm="3"><v-btn @click="clearWecarmasStorage">清除小场景缓存</v-btn></v-col>
            <v-col sm="3"><v-btn @click="closeWecarmas">关闭小场景</v-btn></v-col>
            <v-col sm="3"><v-btn @click="startWecarmas">打开小场景</v-btn></v-col>
            <!-- <v-col sm="3"><v-btn>输出log</v-btn></v-col> -->
            <v-col sm="3"><v-btn @click="openWechat">打开微信</v-btn></v-col>
            <v-col sm="3"><v-btn @click="openActiveCenter">打开活动中心</v-btn></v-col>
            <v-col sm="3"><v-btn @click="closeActiveCenter">关闭活动中心</v-btn></v-col>
            
            <!-- <v-col sm="3"><v-btn @click="startCMD">打开cmd</v-btn></v-col> -->
            <!-- <v-col sm="3"><v-btn @click="getDevices">查看连接的设备</v-btn></v-col> -->
        </v-row>
    </div>
</template>

<script>

import {$startApp, $clearAppStorage,  $closeApp, $startCMD, $getDevices, $isSelectDevice} from '../assets/js/tools'
import { mapState } from 'vuex'

export default {
    data: () => ({
        devicesList: [
            {name: '111', id: 123}
        ]
    }),
    created(){
        // adbkit.onDevices()
        console.log(this.selectedDevice)
    },
    computed: {
        ...mapState(['selectedDevice', 'localDeviceList'])
    },
    methods: {
        startWecarmas(){
            $isSelectDevice(this.selectedDevice, this.localDeviceList)
            .then(() => {
                let {serial} = this.selectedDevice[0]
                return $startApp('com.tencent.wecarmas/com.tencent.wecarmas.ui.activity.HomeActivity', serial)
            }).catch(err => {
                alert(err)
            })
            
        },
        closeWecarmas(){
            $isSelectDevice(this.selectedDevice, this.localDeviceList)
            .then(() => {
                let {serial} = this.selectedDevice[0]
                return $closeApp('com.tencent.wecarmas',serial)
            }).catch(err => {
                alert(err)
            })
            
        },
        openWechat(){
            $isSelectDevice(this.selectedDevice, this.localDeviceList)
            .then(() => {
                let {serial} = this.selectedDevice[0]
                return $startApp('com.tencent.mm/com.tencent.mm.ui.LauncherUI', serial)
            }).catch(err => {
                alert(err)
            })
            
        },
        clearWecarmasStorage(){
            $isSelectDevice(this.selectedDevice, this.localDeviceList)
            .then(() => {
                let {serial} = this.selectedDevice[0]
                return $clearAppStorage('com.tencent.wecarmas', serial)
            }).catch(err => {
                alert(err)
            })
            
        },
        startCMD(){

            $startCMD()
        },
        getDevices(){
            $getDevices().catch(err => {alert(err)})
        },
        openActiveCenter(){
            $isSelectDevice(this.selectedDevice, this.localDeviceList)
            .then(() => {
                let {serial} = this.selectedDevice[0]
                return $startApp('com.tencent.wcenter/com.tencent.wcenter.MainActivity', serial)
            }).catch(err => {
                alert(err)
            })
        },
        closeActiveCenter(){
            $isSelectDevice(this.selectedDevice, this.localDeviceList)
            .then(() => {
                let {serial} = this.selectedDevice[0]
                return $closeApp('com.tencent.wcenter',serial)
            }).catch(err => {
                alert(err)
            })
        },

        
    }
    
}
</script>