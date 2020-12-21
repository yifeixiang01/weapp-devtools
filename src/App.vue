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
    <v-main>  
      <router-view></router-view>
    </v-main>
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
    ...mapState(['clinetInfo', 'selectedDevice'])
  },
  methods: {
    //监听本地连接的设备变化
    onDevices(){
      adb.onDevices({
        onadd: ({device, list}) => {
          console.log('有新设备连接', device)
          list = this.formateList(list)
          
          // console.log(list)
          this.$store.commit({type: 'changeLocalList', list})
        },
        onremove: ({device, list}) => {
          console.log('设备断开', device)
          list = this.formateList(list)

          if(device.serial === this.selectedDevice[0].serial){
            this.$store.commit({type: 'removeSelectedDevice'})
          }
          // console.log(list)
          this.$store.commit({type: 'changeLocalList', list})
        },
        onend: () => {
          console.log('监听设备失败')
        }
      })
    },
    formateList(deviceList){
      let arr = []
      deviceList.forEach(item => {
        let {id: serial, type:status} = item
        let device = {owner: this.clinetInfo.nickname, serial, status, isShared: false}
        arr.push(device)

        if(device.serial === this.selectedDevice[0].serial){
             this.$store.commit({type: 'selectDevice', device})
          }
      })
      return arr
    }
  }
}
</script>
