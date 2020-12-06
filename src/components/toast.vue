<template>
    <v-snackbar right top :color="color" v-model="show" :timeout="duration">{{text}}</v-snackbar>
</template>

<script>
export default {
    props: {
        status: String,
        content: String,
        duration: String
    },
    data (){
        return{
            text: this.content,
            timeout: this.duration,
            show: false
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

    }
}
</script>