<template>

<v-form ref="form" lazy-validation v-model="valid">
    <v-container>
      <v-row>
        <v-col>
          <v-text-field  label="微信开发工具安装目录"  :rules="devtoolRules" v-model="wechatDevtoolsPath"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field label="小程序包存放目录" :rules="weappRules" v-model="weappPath"></v-text-field>
        </v-col>
      </v-row>

      <v-btn  :disabled="!valid"  color="success"  class="mr-4"  @click="submit">保存</v-btn>

    </v-container>
  </v-form>
</template>

<script>
const fs = window.require('fs')

export default {
    data: () => ({
      valid:true,
      wechatDevtoolsPath: '',
      devtoolRules: [
        value => !!value || '需要输入微信开发工具的安装目录',
        value => {
          if(value && fs.existsSync(`${value}/cli.bat`)){
            return true
          }else{
            
            return '请输入正确的安装路径'
          }
        },
      ],
      weappPath: '',
      weappRules: [
        value => !!value || '请输入编译后的小程序包存放路径',
        value => {
          if(fs.existsSync(`${value}`) && value.indexOf('Applet') > 0){
            return true
          }else{
            return '请输入正确的小程序包存放路径'
          }
        }
      ]
    }),
    computed: {

    },
    watch: {

    },
    created () {
      this.readConfig();
    },
    methods: {
      readConfig(){
        let {wechatDevtoolsPath, weappPath} = JSON.parse(fs.readFileSync('src/resource/app.config.json', 'utf8'))
        
        this.wechatDevtoolsPath = wechatDevtoolsPath
        this.weappPath = weappPath
      },
      submit(){
        this.$refs.form.validate()
        //转化路径格式
        let wechatDevtoolsPath = this.wechatDevtoolsPath.replace(/\\/g, '/')
        let weappPath = this.weappPath.replace(/\\/g, '/')
        let index = weappPath.indexOf('__APP__')
        if(index != -1){
          weappPath = weappPath.slice(0, index)
        } 
        console.log(wechatDevtoolsPath, weappPath)
        fs.writeFileSync('src/resource/app.config.json', JSON.stringify({wechatDevtoolsPath, weappPath}))
      }
    }
  }
</script>
