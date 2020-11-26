<template>
    <div>
        <div v-for="item in devicesList" :key="item.name"></div>
    </div>
</template>

<script>
// import adbkit from '../assets/js/adb'
export default {
    data: () => ({
        devicesList: [
            {name: '111', id: 123}
        ]
    }),
    created(){
        // adbkit.onDevices()
    }
}
</script>