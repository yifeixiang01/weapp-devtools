<template>
  <v-app>
    <v-navigation-drawer  dark  mini-variant  mini-variant-width="56" app  permanent>
      <v-list  dense  nav>
        <v-list-item  v-for="item in items"  :key="item.title" :to="item.route">
          <v-list-item-action>
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-on="on" v-bind="attrs">{{ item.icon }}</v-icon>
              </template>
              <span>{{item.title}}</span>
            </v-tooltip>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main dark>  
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </v-main>

    <!-- <v-navigation-drawer  absolute  permanent  right app >

      <v-list dense right>
        <v-list-item
          v-for="item in items"
          :key="item.title"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item> 
      </v-list>
    </v-navigation-drawer> -->
  </v-app>
</template>

<script>

import adb from './assets/js/adb'
import { mapState } from 'vuex'

export default {
  name: 'App',
  components: {
    
  },
  data: () => ({
    items: [
      { title: 'Home', route: '/', icon: 'mdi-view-dashboard' },
      { title: '配置', route: 'About', icon: 'mdi-gavel' },
      { title: '投屏', route: 'ApowerMirror', icon: 'mdi-call-split' },
      { title: '设备', route: 'Devices', icon: 'mdi-dialpad' },
      {title: '终端', route: "Terminal", icon: 'mdi-dialpad'}
    ],
    mini: true,
  }),
  created(){
    
    this.onDevices();
  },
  computed:{
    ...mapState(['clinetInfo', 'selectedDevice', 'localDeviceList'])
  },
  methods: {
    //监听本地连接的设备变化
    onDevices(){
      adb.onDevices({
        onadd: ({device}) => {
          console.log('有新设备连接', device)
          this.addLocalDevice(device)
        },
        onremove: ({device}) => {
          console.log('设备断开', device)
          let {id: deviceId} = device
          this.removeLocalDevice(deviceId)
          //当断开的设备是已选的设备，将选择数组置空
          if(this.selectedDevice.length > 0 && deviceId === this.selectedDevice[0].deviceId){
            this.$store.commit({type: 'removeSelectedDevice'})
          }
        },
        onend: () => {
          console.log('监听设备失败')
        }
      })
    },
    //添加本地设备
    addLocalDevice(device){
      let {id: serial, type:status} = device;
      let {hostIP} = this.clinetInfo
      
      //设备serial中包含本地hostIP，则是连接的本地共享的设备，不显示
      //本地列表中已经有相同的设备，则不添加到本地列表里
      let index = this.localDeviceList.findIndex(item => item.deviceId === serial)
      
      if(serial.indexOf(hostIP) == -1 && index === -1){   
          let device = {deviceId: serial, serial, owner: this.clinetInfo.nickname, status, isShared: false}
          this.$store.commit({type:'addLocalDevice', device})
      }
    },
    //移除本地断开的设备
    removeLocalDevice(deviceId){
      this.$store.commit({type: 'removeLocalDevice', deviceId: deviceId})
    }
  }
}
</script>
