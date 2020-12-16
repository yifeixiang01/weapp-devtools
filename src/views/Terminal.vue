<template>
    <div class="container">
        
    </div>
</template>
<script>
let ws = require('nodejs-websocket')
export default {
    data(){
        return {

        }
    },
    created(){
        

        //this.openClient();
    },
    mounted(){
        this.createServer();
    },
    methods: {
        createServer(){
            console.log(ws.createServer)
            if(ws.createServer){
                ws.createServer(socket => {
                    socket.on('text', res => {
                        console.log(`${new Date().getTime} server:`, res)
                    })
                }).listen(3000)
            }
            
        },
        openClient(){
            let client = new WebSocket('ws://192.168.0.109:3000')
            client.onopen = function(){
                console.log('client open')
                setInterval(() => {
                    client.send('客户端消息')
                }, 2000)
            }
            client.onmessage = function(e){
                console.log('client', e)
            }
        }
    }
}
</script>
<style lang="stylus">
    .container{
        position: relative;
    }

</style>