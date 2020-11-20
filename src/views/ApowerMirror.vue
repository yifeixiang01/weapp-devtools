<template>
  <v-form  ref="form"  v-model="valid"  lazy-validation>
    <v-text-field  v-model="name"  :counter="10"  label="Name"  required></v-text-field>
    <v-slider min="0"  max="1920" v-model="resolution " step="10"  label="画面分辨率" thumb-label="always" ></v-slider>
    <v-slider  v-model="bitRate"  :max="1024" step="10"  label="传输比特率"  class="align-center" thumb-label="always" :thumb-size="30"></v-slider>
    <v-row>
      <v-col cols="4">
        <v-switch v-model="selected" label="窗口置顶"  value="setWindowTop" @click="windowTop"></v-switch>
      </v-col>
      <v-col cols="4">
        <v-switch v-model="selected"  label="悬浮工具栏"  value="John2"></v-switch>
      </v-col>
      <v-col  cols="4">
        <v-switch v-model="selected"  label="全屏启动"  value="John3"></v-switch>
      </v-col>
      <v-col  cols="4">
        <v-switch v-model="selected"  label="黑屏启动"  value="John4"></v-switch>
      </v-col>
      <v-col  cols="4">
        <v-switch v-model="selected"  label="旋转镜像"  value="John5"></v-switch>
      </v-col>
{{ selected }}
    </v-row>
    <v-btn  :disabled="!valid"  color="success"  class="mr-4"  @click="validate">保存设置</v-btn>
    <v-btn  :disabled="!valid"  color="success"  class="mr-4"  @click="start">启动</v-btn>
  </v-form>
</template>

<script>
const { exec } = window.require('child_process')
export default {
  data: ()=>({
    name: '',
    selected: [],
    valid: true,
    resolution: 1024,
    bitRate: 100,
    isWindowTop: false,
  }),
  methods: {
    validate () {
      this.$refs.form.validate()
    },
    reset () {
      this.$refs.form.reset()
    },
    resetValidation () {
      this.$refs.form.resetValidation()
    },
    start(){
      let workerProcess = exec('scrcpy', {cwd: 'src/resource/scrcpy-win64-v1.15.1'})

        workerProcess.stdout.on('data', data =>{
            console.log('stdout', data)
        })
        workerProcess.stderr.on('data', data =>{
            console.log('stderr', data)
        })
        workerProcess.on('close', code => {
            console.log('启动', code)
        })
    },
    windowTop(){
      console.log(this.selected)

    }
  }
}
</script>