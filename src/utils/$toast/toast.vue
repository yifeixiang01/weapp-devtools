<template>
    <div class="toast-template" >
        <!-- <v-alert type="success" translate="scale-transition" app></v-alert> -->
        <!-- <v-snackbar right top :color="toastData.color" v-model="toastData.show" :timeout="toastData.duration">{{toastData.content}}</v-snackbar> -->

    </div>

    <!-- <div class="box" v-if="toastData.show">{{toastData.content}}</div> -->
</template>

<script>

// import {VSnackbar} from 'vuetify/lib'

export default {
    components: {
        // VSnackbar
    },
    props: {
        status: String,
        content: String,
        duration: String
    },
    data (){
        return{
            toastData: {
                content: '1111',
                duration: '2000',
                show: false
            }
        }
    },
    created(){
        console.log('toast component')
    },
    computed: {
        color: function(){
            console.log()
            let color
            switch(this.status){
                case 'success': color = 'green'; break;
                case 'warning': color = 'orange'; break;
                case 'danger': color = 'red'; break;
                default: 
                 color = 'blue'
            }
            return color
        }
    },
    methods: {
        open(params = {}){
            console.log('toast open', params)
            this.toastData = {...params, show: true}
        },
        callback(){
            return new Promise(resolve => {
                console.log('toast callback')
                this.resolve = resolve
            })
        }
    }
}
</script>
<style lang="stylus">
    .toast-template{
        position: fixed;
        right: 0;
        top: 0;
    }
</style>