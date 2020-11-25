<template>
  <div>

      <v-data-table  :headers="headers"  :items="weappList" item-key="name" hide-default-footer :show-select="true" v-model="selected" :single-select="isSingleSelect" @item-selected="selectWeapp">
        <template v-slot:top>
          <v-toolbar flat>
            <v-spacer></v-spacer>

            <v-dialog  v-model="dialog"  max-width="600px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn  color="primary"  dark  class="mb-2" small  v-bind="attrs"  v-on="on">添加小程序</v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12"  sm="6"  md="6"><v-text-field  v-model="editedItem.name"  label="小程序"></v-text-field></v-col>
                      <v-col  cols="12"  sm="6"  md="6"><v-text-field  v-model="editedItem.appName"  label="英文名"></v-text-field></v-col>
                    </v-row>
                    <v-row>
                      <v-col  cols="12"  sm="11"  md="12"><v-text-field  v-model="editedItem.path"  label="项目路径"></v-text-field></v-col>
                      <!--<v-col  cols="12"  sm="1"  md="1"><v-file-input type="file" webkitdirectory hide-input @change="selectFile"></v-file-input></v-col>-->
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn  color="blue darken-1"  text  @click="close">取消</v-btn>
                  <v-btn  color="blue darken-1"  text  @click="save">保存</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="headline">确定删除“{{editedItem.name}}”小程序吗?</v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete">取消</v-btn>
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm">确定</v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>

          </v-toolbar>
        </template>


        <template v-slot:[`item.selected`]="{ item }">
          <v-icon small  class="mr-2"  @click="editItem(item)">mdi-pencil</v-icon>
          <v-icon  small  @click="deleteItem(item)">mdi-delete</v-icon>
        </template>
      </v-data-table>

      <div class="text-center">
        <v-btn  class="ma-2"  outlined  color="indigo" @click="compileFile">开始编译</v-btn>
      </div>

  </div>


</template>

<script>

const fs = window.require('fs')
// const { ipcRenderer } = window.require('electron')
const { exec } = window.require('child_process')

let {ipcRenderSend, ipcRendererOn} = require('../main/store.js')

export default {
  name: 'HelloWorld',
  props: {

  },
  data(){
    return {
      config: {

      },
      isSingleSelect: true,
      selected: [],
      headers: [
        {text: '小程序',value: 'name'},
        {text: '英文名',value: 'appName',},
        {text: '项目路径',value: 'path'},
        {text: '', value: 'selected'}
      ],
      weappList : [],
      defaultItem: {},
      dialog: false,
      dialogDelete: false,
      editedIndex: -1,
      editedItem: {},
    }
  },
  created() {
    this.getConfig();

    this.getWeappList();
    
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? '添加' : '修改'
    },
  },
  watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      }
  },
  methods: {
    getConfig(){
      console.log('获取配置信息')
      ipcRenderSend('getWeappConfig')

      ipcRendererOn('getWeappConfig-reply', value => {
        console.log('获取到配置信息：', value)
        if(!value) this.$router.go('/about')
        this.config = value
      })
    },
    //读取小程序列表
    getWeappList(){
      //this.weappList = JSON.parse(fs.readFileSync('src/resource/weapp.json', 'utf8'))
      ipcRenderSend('getWeappList')

      ipcRendererOn('getWeappList-reply', value => {
        console.log('获取小程序列表', value)
        this.weappList = value
        this.selected = this.weappList.filter(item => item.selected)
      })
    },
    //将小程序进行编译，并生成.wxapkg文件
    compileFile(){
        if(this.selected.length == 0){
          console.log('请先选择小程序')
          return 
        }
        let {name:weappName, appName, path:projectPath} = this.selected[0];
        console.log(`开始编译“${weappName}”小程序`)

        let workerProcess = exec(`cli auto-preview --project ${projectPath}`, {cwd: this.config.wechatDevtoolsPath})

        workerProcess.stdout.on('data', data =>{
            console.log('stdout', data)
        })
        workerProcess.stderr.on('data', data =>{
            console.log('stderr', data)
        })
        workerProcess.on('close', code => {
            console.log('编译', code)
            if(code == 0){
              fs.watch(this.config.weappPath, (eventType, filename) => {
                console.log('文件变化', eventType, filename)
                if(eventType == 'rename' || eventType == 'change'){
                  clearTimeout(this.timer)
                  this.timer = setTimeout(() => {
                    this.copyFile(weappName, appName)
                  }, 200);

                }
              })

            }else{
              console.log('编译失败')
            }
        })

    },
    //将_APP_.wxapkg copy到当前目录下，并修改文件名
    copyFile(weappName, appName){
        console.log('------开始copy文件', weappName, appName)
        fs.copyFile(`${this.config.weappPath}/__APP__.wxapkg`, `${this.config.weappSavePath}/${appName}.wxapkg`, ()=>{
          this.pushToMobile(weappName, appName)
        })
    },
    //调用adb命令将小程序包push到车机or手机
    pushToMobile(weappName, appName){
      console.log('-----开始将小程序包push到车机')
      let pathInCar = appName === 'debug'? 'sdcard/moss/weapp': `data/data/com.tencent.wecarmas/files/moss/${weappName}/pkg`
      let workerProcess = exec(`adb push ${this.config.weappSavePath}/${appName}.wxapkg ${pathInCar}`, {cwd: './'})

      workerProcess.stdout.on('data', data =>{
          console.log('stdout', data)
      })
      workerProcess.stderr.on('data', data =>{
          console.log('push', data)
      })
      workerProcess.on('close', code =>{
          if(code == 0){
              console.log('push over')
          }
      })
    },
    //选择小程序
    selectWeapp(row){
      console.log(this.selected)
      this.weappList.forEach(item => {
        if(item.name == row.item.name){
          item.selected = true
        }else{
          item.selected = false
        }
      })
      ipcRenderSend('setWeappList', this.weappList)
    },
    editItem (item) {
      console.log(item)
      this.editedIndex = this.weappList.findIndex(weapp => weapp.name == item.name)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    deleteItem (item) {
      console.log(item)
      this.editedIndex = this.weappList.findIndex(weapp => weapp.name == item.name)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },
    closeDelete () {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
      })
    },
    deleteItemConfirm () {
      console.log(this.editedIndex)
      this.weappList.splice(this.editedIndex, 1)
      ipcRenderSend('setWeappList', this.weappList)
      this.closeDelete()
    },
    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
      })
      this.editedIndex = -1
    },
    save () {
      console.log(this.editedIndex)
      if(this.editedIndex > -1){
        Object.assign(this.weappList[this.editedIndex], this.editedItem)
      }else{
        this.weappList.push(this.editedItem)
      }
      ipcRenderSend('setWeappList', this.weappList)
      this.close()
    },
    //选择文件
    selectFile(file){
      console.log(file)
      if(file){
        let path = file.path.replace(/\\/g, '/')
        let index = path.lastIndexOf('/')
        path = path.slice(0, index)

        if(fs.existsSync(`${path}/project.config.json`)){

          let config = JSON.parse(fs.readFileSync(`${path}/project.config.json`))

          this.$set(this.editedItem, 'path', path)
          this.editedItem.appName || this.$set(this.editedItem, 'appName', config.projectname)

        }else{
          alert('请选择正确的小程序路径！')
        }
      }

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
