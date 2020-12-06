<template>
  <div>
    <v-row>
      <v-col md="9">
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
                              <v-col  cols="12"  sm="11"  md="11"><v-text-field  v-model="editedItem.path"  label="项目路径"></v-text-field></v-col>
                              <v-col  cols="12"  sm="1"  md="1"><v-file-input type="file" webkitdirectory hide-input @change="selectFile"></v-file-input></v-col>
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
                <v-btn  class="ma-2"  outlined  color="indigo" @click="runCompile">开始编译</v-btn>
              </div>
      </v-col>
      <v-col md="3">
        <div class="debug-area" @drop="onDrop($event)" @dragover="onDragover($event)">
          将小程序包拖拽到此处
        </div>
      </v-col>
    </v-row>
      <v-btn @click="showToast">toast</v-btn>

  </div>


</template>

<script>

const fs = window.require('fs')
import {$compileFile, $copyFile, $pushToMobile} from '../assets/js/tools'
const  ElectronStore = window.require('electron-store')
const electronStore = new ElectronStore();

import {$toast} from '../utils'

export default {
  components:{
    
  },
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
      toast: {
        
      }
    }
  },
  created() {
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
      return new Promise((resolve, reject) => {
        let value = electronStore.get('weappConfig')
        console.log('小程序配置', value)
        if(value){
          resolve(value)
        }else{
          console.log('没有配置文件')
          reject()
        }
      })
    },
    //读取小程序列表
    getWeappList(){
      this.weappList = electronStore.get('weappList') || []
      this.selected = this.weappList.filter(item => item.selected)
      console.log('获取到小程序列表',this.weappList)
    },
    //开始运行 编译->拷贝->push到车机
    runCompile(){
      //获取配置信息
      let value = electronStore.get('weappConfig')
      let {weappCompilePath, wechatDevtoolsPath, weappSavePath} = value
      console.log('配置信息', value)
      if(!weappCompilePath || !wechatDevtoolsPath || !weappSavePath){
        console.log('没有配置文件')
        this.$router.go('About')
        return 
      }

      //判断是否选择小程序
      if(this.selected.length == 0){
        console.log('请先选择小程序')
        return 
      }
      let {name:weappName, appName, path:projectPath} = this.selected[0];

      $compileFile(weappName, projectPath, weappCompilePath, wechatDevtoolsPath)
        .then(() => {
          let resourcePath = `${weappCompilePath}/__APP__.wxapkg`
          let aimPath = `${weappSavePath}/${appName}.wxapkg`

          return $copyFile(resourcePath, aimPath)
        })
        .then(() => {
          let pkgPath = `${weappSavePath}/${appName}.wxapkg`
          return $pushToMobile(pkgPath, weappName, appName)
        })
        .catch((err) => {
          console.error(`运行出错:${err}`)
        })
    },
    //选择小程序
    selectWeapp(row){
      this.weappList.forEach(item => {
        if(item.name == row.item.name){
          item.selected = true
        }else{
          item.selected = false
        }
      })

      electronStore.set('weappList', this.weappList)
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
      electronStore.set('weappList', this.weappList)
      this.closeDelete()
    },
    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    save () {
      let {name, appName, path} = this.editedItem

      if(this.editedIndex > -1){
        console.log(0)
        Object.assign(this.weappList[this.editedIndex], this.editedItem)
      }else if(this.weappList.findIndex(item => item.name == name) != -1 ){
        alert(name +'已存在')
      }else if(name && appName && path){
        this.weappList.push(this.editedItem)

        electronStore.set('weappList', this.weappList)
      }
      
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

    },
    onDrop(e) {
      console.log('drop', e);
      e.preventDefault();
      var pkgPath = e.dataTransfer.files[0].path;
      console.log('放置的小程序包', pkgPath);

      if(pkgPath.indexOf('.wxapkg')>-1){
        
        //判断是否选择小程序
        if(this.selected.length == 0){
          console.log('请先选择小程序')
          return 
        }
        let {name:weappName, appName} = this.selected[0];

        $pushToMobile(pkgPath, weappName, appName).then(()=> {
          alert('push 成功')
        }).catch(err => {
          console.error(`push 失败: ${err}`)
          alert(`push 失败: ${err}`)
        })
      }else{
        alert('请放置正确的小程序包')
      }
      
      return false;
    },
    onDragover(e){
      e.preventDefault();
    },
    showToast(){

      $toast({content: new Date().getTime(),duration: '3000', show: true });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.debug-area{
  width: 100%;
  height: 100%;
  background: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
