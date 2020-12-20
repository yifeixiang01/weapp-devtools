<template>

<v-form ref="form" lazy-validation v-model="valid">
    <v-container>
      <v-row>
        <v-col>
          <v-text-field  label="用户名"  :rules="nacknameRules" v-model="config.nickname"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field  label="微信开发工具安装目录"  :rules="devtoolRules" v-model="config.wechatDevtoolsPath"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field label="小程序包编译目录" :rules="weappRules" v-model="config.weappCompilePath"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col  cols="12"  md="12"><v-text-field  v-model="config.weappSavePath" :rules="weappSavePathRules" label="文件输出目录"></v-text-field></v-col>
        <!-- <v-col  cols="12"  sm="1"  md="1"><v-file-input type="file" webkitdirectory hide-input @change="selectFile"></v-file-input></v-col> -->
      </v-row>
      <v-row>
        <v-col class="text-center">
          <v-btn  :disabled="!valid" outlined  color="success"  class="mr-4"  @click="submit">保存</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
const fs = window.require('fs')
import { mapState } from 'vuex'

export default {
    data: () => ({
      valid:true,
      nacknameRules: [
        value => !!value || '服务端需要您的用户名以区分不同设备的归属',
      ],
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
    }),
    computed: {
      ...mapState(['config'])
    },
    watch: {

    },
    created () {
      console.log(this.config)

    },
    methods: {
      //选择文件
      selectFile(file){
        console.log(file)
        if(file){
          this.$set(this.config, 'weappSavePath', file.path)
        }
      },
      submit(){
        if(this.$refs.form.validate()){
          //转化路径格式
          let wechatDevtoolsPath = this.config.wechatDevtoolsPath.replace(/\\/g, '/')
          let weappCompilePath = this.config.weappCompilePath.replace(/\\/g, '/')
          let weappSavePath = this.config.weappSavePath.replace(/\\/g, '/')
          let nickname = this.config.nickname
          let index = weappCompilePath.indexOf('__APP__')
          if(index != -1){
            weappCompilePath = weappCompilePath.slice(0, index)
          } 

          this.$store.commit('setConfig', {wechatDevtoolsPath, weappCompilePath, weappSavePath, nickname})
          alert('保存成功！')
        }
        
      }
    }
  }
</script>
