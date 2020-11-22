<template>

<v-form ref="form" lazy-validation v-model="valid">
    <v-container>
      <v-row>
        <v-col>
          <v-text-field  label="微信开发工具安装目录"  :rules="devtoolRules" v-model="config.wechatDevtoolsPath"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field label="小程序包编译目录" :rules="weappRules" v-model="config.weappPath"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col  cols="12"  md="12"><v-text-field  v-model="config.weappSavePath" :rules="weappSavePathRules" label="文件输出目录"></v-text-field></v-col>
        <!-- <v-col  cols="12"  sm="1"  md="1"><v-file-input type="file" webkitdirectory hide-input @change="selectFile"></v-file-input></v-col> -->
      </v-row>
      <v-row>
        <v-col>
          <v-btn  :disabled="!valid"  color="success"  class="mr-4"  @click="submit">保存</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
const fs = window.require('fs')
let {ipcRenderSend, ipcRendererOn} = require('../main/store.js')

export default {
    data: () => ({
      valid:true,
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
      weappRules: [
        value => !!value || '请输入编译后的小程序包存放路径',
        value => {
          if(fs.existsSync(`${value}`) && value.indexOf('Applet') > 0){
            return true
          }else{
            return '请输入正确的小程序包存放路径'
          }
        }
      ],
      weappSavePathRules: [
        value => !!value || '请输入文件输出目录',
        value => {
          if(fs.existsSync(`${value}`)){
            return true
          }else{
            return '请输入正确的文件夹路径'
          }
        }
      ],
      config: {
        
      }
    }),
    computed: {

    },
    watch: {

    },
    created () {
      this.getConfig();

    },
    methods: {
      getConfig(){
        ipcRenderSend('getWeappConfig')

        ipcRendererOn('getWeappConfig-reply', value => {
          console.log('获取到配置信息：', value)

          this.config = value || {}
        })
      },
      //选择文件
      selectFile(file){
        console.log(file)
        if(file){
          this.$set(this.config, 'weappSavePath', file.path)
        }
      },
      submit(){
        this.$refs.form.validate()
        //转化路径格式
        let wechatDevtoolsPath = this.config.wechatDevtoolsPath.replace(/\\/g, '/')
        let weappPath = this.config.weappPath.replace(/\\/g, '/')
        let weappSavePath = this.config.weappSavePath.replace(/\\/g, '/')

        let index = weappPath.indexOf('__APP__')
        if(index != -1){
          weappPath = weappPath.slice(0, index)
        } 

        ipcRenderSend('setWeappConfig', {wechatDevtoolsPath, weappPath, weappSavePath})
      }
    }
  }
</script>
