<template>

<v-form v-model="valid">
    <v-container>
      <v-row>
        <v-col>
          <v-text-field  label="微信开发工具安装目录"  :rules="rules"  hide-details="auto" v-bind="wechatDevtoolsPath"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field label="小程序文件目录" v-bind="weappPath"></v-text-field>
        </v-col>
      </v-row>
      <v-btn  class="mr-4"  type="submit"  :disabled="invalid">保存</v-btn>
    </v-container>
  </v-form>
</template>

<script>
const fs = window.require('fs')

export default {
    data: () => ({
      wechatDevtoolsPath: '',
      weappPath: '',
      rules: [
        value => !!value || '需要输入微信开发工具的安装目录',
        value => {
          if(value && !fs.existsSync(`${value}/cli.bat`)){
            return '请输入正确的安装路径'
          }else{
            console.log('路径正确')
            return true
          }
        },
      ],
    }),
    computed: {

    },
    watch: {

    },
    created () {

    },
    methods: {

    }
  }
</script>
