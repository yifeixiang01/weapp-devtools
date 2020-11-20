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
      weappList : []
    }
  },
  created() {
    //fs.writeFileSync('./weapp.json', JSON.stringify(data))
    console.log('hello')
    this.getWeapp();

  },
  methods: {
    getWeapp(){
      this.weappList = JSON.parse(fs.readFileSync('./weapp.json', 'utf8'))

      this.selected = this.weappList.filter(item => item.selected)
    },
    compileFile(){
        let {name, path} = this.selected[0];
        console.log(`开始编译“${name}”小程序`)

        //fs.existsSync('C:/Users/lenovo/Documents/WeChat Files/Applet/wx5a7904ede9c545e2/0/__APP__.wxapkg') && fs.unlinkSync('C:/Users/lenovo/Documents/WeChat Files/Applet/wx5a7904ede9c545e2/0/__APP__.wxapkg')

        //fs.existsSync('./debug.wxapkg') && fs.unlinkSync('./debug.wxapkg')


        let workerProcess = exec(`cli auto-preview --project ${path}`, {cwd: 'D:/微信web开发者工具'})

        workerProcess.stdout.on('data', data =>{
            console.log('stdout', data)
        })
        workerProcess.stderr.on('data', data =>{
            console.log('stderr', data)
        })
        workerProcess.on('close', code => {
            console.log('编译', code)
            if(code == 0){
              fs.watch('C:/Users/lenovo/Documents/WeChat Files/Applet/wx5a7904ede9c545e2/0/__APP__.wxapkg', (eventType, filename) => {
                console.log('文件变化', eventType, filename)
                if(eventType == 'rename'){
                  clearTimeout(this.timer)
                  this.timer = setTimeout(() => {
                    this.copyFile()
                  }, 500);

                }
              })

            }else{
              console.log('编译失败')
            }
        })

    },
    copyFile(){
        console.log('------开始copy文件')
        fs.renameSync('C:/Users/lenovo/Documents/WeChat Files/Applet/wx5a7904ede9c545e2/0/__APP__.wxapkg', './debug.wxapkg')
        this.pushToMobile()
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
      this.weappList.forEach(item => {
        if(item.name == row.item.name){
          item.selected = true
        }else{
          item.selected = false
        }
      })
      fs.writeFileSync('./weapp.json', JSON.stringify(this.weappList))
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
