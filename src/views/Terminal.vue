<template>
    <div class="container">
        <v-row v-for="(device, index) in localDeviceList" :key="device.serial">
            <v-col>{{device.hostIP}}</v-col>
            <v-col>{{device.owner}}</v-col>
            <v-col>{{device.serial}}</v-col>
            <v-col>{{device.status}}</v-col>
            <v-col><v-btn text color="primary" @click="shareDevice(index)" v-if="isSocketOpen">{{device.isShare? '取消共享': '共享'}}</v-btn></v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row  v-if="!isSocketOpen">
            <v-col class="text-center"><v-btn @click="createClient">连接服务器</v-btn></v-col>
        </v-row>
        
        <v-row v-else>
            <v-row v-for="device in remoteDeviceList" :key="device.serial">
                <v-col>{{device.hostIP}}</v-col>
                <v-col>{{device.owner}}</v-col>
                <v-col>{{device.serial}}</v-col>
                <v-col>{{device.status}}</v-col>
            </v-row>
        </v-row>
        
    </div>
</template>
<script>
import { mapState } from 'vuex'
import { $shareDevice} from '../assets/js/tools'
// import adb from '../assets/js/adb'

export default {
    data(){
        return {
            isSocketOpen: false
        }
    },
    created(){
        
    },
    mounted(){
        this.createClient();
    },
    computed:{
        ...mapState(['localDeviceList', 'remoteDeviceList'])
    },
    methods: {
        createClient(){
            if (typeof WebSocket === "undefined") {
                alert("您的浏览器不支持socket");
            } else {
                // 实例化socket
                this.socket = new WebSocket("ws://192.168.0.109:8181/websocket1");

                this.socket.onopen = () => {
                    console.log('socket is open')
                    this.isSocketOpen = true
                }
                this.socket.onmessage = message => {   
                    let data = JSON.parse(message.data)

                    switch(data.type){
                        case 'deviceList': this.$store.commit({type: 'changeRemoteList', list: data.list}); break;
                        default: 
                            console.log('没有匹配到要执行的命令');
                    }
                   
                }
                this.socket.onclose = () =>{
                    console.log('client close')
                    this.isSocketOpen = false
                }
                this.socket.onerror = () =>{
                    console.log('连接服务器失败！')
                    alert('连接服务器失败！')
                }
            }
        },
        //发送消息
        sendMsg(){
            let device = {type: 'addDevice',hostIP: '192.168.0.1', nickname: 'yifeixiang', serial: new Date().getTime(), status: 'online'}
            this.socket.send(JSON.stringify(device))
        },
        //关闭客户端
        closeClient(){
            this.socket.close();
        },
        //共享设备
        shareDevice(index){
            let serial = this.localDeviceList[index].serial

            $shareDevice(serial).then(() => {
                // console.log(res)
            }).catch(err => {
                console.log(err)
                alert(err)
            })

            //adb.tcpip(serial)
        }
    }
}
</script>
<style lang="stylus">
    .container{
        position: relative;
    }
    #terminal{
        width: 100%;
        height: 500px;
    }
</style>