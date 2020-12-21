<template>
    <div class="container">
        <div class="device-wrap">
            <v-data-table  :headers="headers1"  :items="localDeviceList" item-key="serial" hide-default-footer :show-select="true" v-model="selectedDeviceList" :single-select="true" @item-selected="selectDevice" >
                <template v-slot:[`item.selected`]="{ item }">
                    <v-btn text color="primary" @click="shareDevice(item)" v-if="isSocketOpen && (item.serial.indexOf(':') == -1)">{{!item.isShared? '共享': ''}}</v-btn>
                    <v-btn text color="primary" @click="cancelShareDevice(item)" v-if="isSocketOpen && (item.serial.indexOf(':') == -1)">{{item.isShared? '取消共享': ''}}</v-btn>
                    <v-btn text color="primary" @click="disconnectDevice(item)" v-if="item.serial.indexOf(':') > -1">断开连接</v-btn>
                </template>
            </v-data-table>
        </div>
        <div class="device-wrap2">
            <v-row  v-if="!isSocketOpen">
                <v-col class="text-center"><v-btn @click="createClient">连接服务器</v-btn></v-col>
            </v-row>
            <div v-else>
                <v-data-table  :headers="headers2"  :items="remoteDeviceList" item-key="serial" hide-default-footer >
                    <template v-slot:[`item.isConnected`]="{ item }">
                        <v-chip class="ma-2" v-if="item.isConnected">{{item.user}}</v-chip>
                        <v-btn color="primary" small @click="connectRemoteDevice(item)" v-if="!item.isConnected">连接</v-btn>
                    </template>
                </v-data-table>

            </div>
            
        </div>
        
        
    </div>
</template>
<script>
import { mapState } from 'vuex'
import { $shareDevice, $disconnectDevice, $connectDevice} from '../assets/js/tools'

export default {
    data(){
        return {
            headers1: [
                {text: 'deviceId', value: 'deviceId'},
                {text: 'owner', value: 'owner'},
                {text: 'serial', value: 'serial'},
                {text: 'status', value: 'status'},
                {text: 'operation', value: 'selected'}
            ],
            headers2: [
                {text: 'deviceId', value: 'deviceId'},
                {text: 'owner', value: 'owner'},
                {text: 'serial', value: 'serial'},
                {text: 'status', value: 'status'},
                {text: 'canUse', value: 'isConnected'},
                {text: 'user', value: 'user'}
            ],
            showSelect: true,
            isSocketOpen: false,
            selectedDeviceList: []
        }
    },
    created(){
        console.log('--------clientInfo', this.clinetInfo)
        console.log('localDeviceList', this.localDeviceList)
        this.selectedDeviceList = this.selectedDevice
    },
    mounted(){
        this.createClient();
    },
    computed:{
        ...mapState(['localDeviceList', 'remoteDeviceList', 'clinetInfo', 'selectedDevice'])
    },
    methods: {
        selectDevice(row){
            console.log(row)
            // let item = row.item
            this.selectedDeviceList = [row.item]
            this.$store.commit({type: 'selectDevice', device: row.item})
            // console.log(this.selectedDevice)
        },
        createClient(){
            if (typeof WebSocket === "undefined") {
                alert("您的浏览器不支持socket"); 
            } else {
                // 实例化socket
                this.socket = new WebSocket("ws://10.1.42.27:8181/websocket1");

                this.socket.onopen = () => {
                    console.log('socket is open')
                    this.isSocketOpen = true
                }
                this.socket.onmessage = message => {   
                    console.log('客户端接收信息', message.data)
                    let data = JSON.parse(message.data)

                    switch(data.type){
                        case 'updateClientMsg': this.changeClientMsg(data.id); break;
                        case 'deviceList': this.$store.commit({type: 'changeRemoteList', list: data.list}); break;
                        case 'shareDeviceSuccess': this.shareDeviceSuccess(data.serial); break;
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
        changeClientMsg(id){
            console.log('修改客户端信息')
            this.$store.commit({type: 'changeBaseInfo', id});
            let {hostIP, nickname} = this.clinetInfo
            let message = {type: 'updateClientMsg', id: id, hostIP, nickname}
            this.socket.send(JSON.stringify(message))
        },
        //发送消息
        sendMsg(){
            let {id} = this.clinetInfo
            let device = {type: 'addDevice', id, device: {}}
            this.socket.send(JSON.stringify(device))
        },
        //关闭客户端
        closeClient(){
            this.socket.close();
        },
        //共享设备
        shareDevice(item){
            let serial = item.serial
            let {id, hostIP, nickname} = this.clinetInfo
            console.log(item)
            if(!item.isShared){
                $shareDevice(serial, hostIP, port => {
                    console.log('_+_+_+_+_+_+',port)
                    
                    let {serial,status} = item
                    let device = {serial, owner: nickname, status}
                    
                    let message = {type: 'shareDevice', id, device}
                    console.log('向服务端共享设备', message)
                    this.socket.send(JSON.stringify(message))
                })
            }

        },
        cancelShareDevice(item){
            let serial = item.serial
            let {id} = this.clinetInfo

            if(item.isShared){
                let message = {type: 'removeDevice', id, serial}
                this.socket.send(JSON.stringify(message))
            }
        },
        shareDeviceSuccess(serial){
            let list = JSON.parse(JSON.stringify(this.localDeviceList))
            list.forEach(item => {
                if(item.serial === serial){
                    item.isShared = true
                }
            })
            this.$store.commit({type: 'changeLocalList', list})
        },
        //断开连接
        disconnectDevice(item){
            let serial = item.serial
            $disconnectDevice(serial)
        },
        //连接远程设备
        connectRemoteDevice(item){
            console.log('连接远程设备', item)
            let {serial, owner} = item
            // let {nickname} = this.clinetInfo
            console.log(serial, owner)
            $connectDevice(serial)
            
            // let message = {type: 'connectDevice', user: nickname, owner, serial}
            // this.socket.send(JSON.stringify(message))
        },
    }
}
</script>
<style lang="stylus">
    .container{
        height: 100%;
        position: relative;
    }
    .device-wrap{
        height: 40%;
    }
    .device-wrap2{
        border-top: 10px solid rgba(0, 0, 0, 0.12);

        height: 60%;
    }
    #terminal{
        width: 100%;
        height: 500px;
    }
</style>