<template>
  <div>

      <v-data-table  :headers="headers"  :items="weappList" item-key="name" hide-default-footer :show-select="true" v-model="selected" :single-select="isSingleSelect" @item-selected="selectWeapp">
      </v-data-table>

      <div class="text-center">
        <v-btn  class="ma-2"  outlined  color="indigo" @click="compileFile">开始编译</v-btn>
      </div>
  </div>


</template>

<script>
const fs = window.require('fs')
const { exec } = window.require('child_process')
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data(){
    return {
      isSingleSelect: true,
      selected: [],
      headers: [
        {text: '小程序',value: 'name'},
        {text: '英文名',value: 'appName',},
        {text: '项目路径',value: 'path'}
      ],
      selectedWeapp: {},
      weappList : {}
    }
  },
  created() {
    //fs.writeFileSync('./weapp.json', JSON.stringify(data))

    this.weappList = JSON.parse(fs.readFileSync('./weapp.json', 'utf8'))
    console.log(this.weappList)
    // this.weappList = [
    //   {"name":"懒人听书","appName":"LRTS","path":"E:/小程序项目-代码/WTP95_LRTS"},
    //   {"name":"星际穿行","appName":"spaceTravel","path":"E:/小程序项目-代码/WTP49_SpaceTravel"},
    //   {"name":"本地调试包2","appName":"debug","path":"C:/Users/lenovo/Desktop/mp-public-component/public-components"},
    //   {"name":"本地调试包","appName":"debug","path":"sdcard/moss/weapp"}
    // ]

  },
  methods: {
    compileFile(){
        let {name, path} = this.selectedWeapp;
        console.log(`开始编译“${name}”小程序`)
        //fs.unlinkSync('C:/Users/lenovo/Documents/WeChat Files/Applet/wx5a7904ede9c545e2/0/__APP__.wxapkg')
        //fs.unlinkSync('./debug.wxapkg')

        let workerProcess = exec(`cli auto-preview --project ${path}`, {cwd: 'D:/微信web开发者工具'})

        workerProcess.stdout.on('data', data =>{
            console.log('stdout', data)
        })
        workerProcess.stderr.on('data', data =>{
            console.log('stderr', data)
        })
        workerProcess.on('close', code => {
            console.log('*****编译成功')
            if(code == 0){
                this.copyFile()
            }
        })

    },
    copyFile(){
        console.log('------开始copy文件')
        fs.copyFile('C:/Users/lenovo/Documents/WeChat Files/Applet/wx5a7904ede9c545e2/0/__APP__.wxapkg', './debug.wxapkg', (err) => {

            if(err){
              console.log('拷贝文件出错'. err)
            }else{
              console.log('*****copy文件成功*****')
              this.pushToMobile()
            }

        })
    },
    pushToMobile(){
      console.log('-----开始将小程序包push到车机')
      let workerProcess = exec('adb push ./debug.wxapkg /sdcard/moss/weapp', {cwd: './'})

      workerProcess.stdout.on('data', data =>{
          console.log('stdout', data)
      })
      workerProcess.stderr.on('data', data =>{
          console.log('push', data)
      })
      workerProcess.on('close', code =>{
          if(code == 0){
              console.log('push over')
          }else{
              console.log('进程push出错', code)
          }
      })
    },
    selectWeapp(row){
      this.selectedWeapp = row.item;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.wrap{
  width: 100%;
  height: 100%;
}
.weapp-item{
  font-size: 14px;
  line-height: 20px;
  text-align: left;
}
</style>
