<template>
    <div class="container">
        <div  id="terminal"></div>
    </div>
</template>
<script>
import {Terminal} from 'xterm'

export default {
    data(){
        return {

        }
    },
    created(){
        this.createTerminal()
    },
    methods: {
        createTerminal(){
            this.terminal = new Terminal();
            const termDom = document.getElementById('terminal')
            this.terminal.open(termDom)
            this.terminal.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')
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