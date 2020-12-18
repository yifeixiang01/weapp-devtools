<template>
    <div class="container">
        <v-row v-for="device in deviceList" :key="device.serial">
            <v-col>{{device.hostIP}}</v-col>
            <v-col>{{device.nickname}}</v-col>
            <v-col>{{device.serial}}</v-col>
            <v-col>{{device.status}}</v-col>
        </v-row>

        <v-row>
            <!-- <v-col md="11"><v-text-field v-model="inputText"></v-text-field></v-col> -->
            <v-col md="1"><v-btn  class="ma-2"  outlined  color="indigo" @click="sendMsg">发送</v-btn></v-col>
        </v-row>
        
        <!-- <v-btn  class="ma-2"  outlined  color="indigo" @click="closeClient">关闭客户端</v-btn> -->
    </div>
</template>
<script>

export default {
    data(){
        return {
            path: 'ws://10.1.42.27:8181/websocket1',
            inputText: '',
            socket: null,
            deviceList: []
        }
    },
    created(){
        
    },
    mounted(){
        this.init();

    },
    methods: {
        init(){
            if (typeof WebSocket === "undefined") {
                alert("您的浏览器不支持socket");
            } else {
                // 实例化socket
                this.socket = new WebSocket("ws://10.1.42.27:8181/websocket1");

                this.socket.onopen = () => {
                    console.log('socket is open')
                }
                this.socket.onmessage = res => {
                    this.deviceList = JSON.parse(res.data)
                }
                this.socket.onclose = () =>{
                    console.log('client close')
                }
                this.socket.onerror = err =>{
                    console.log('client error', err)
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

