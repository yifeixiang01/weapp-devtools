const { exec, execSync, spawn} = window.require('child_process')
const fs = window.require('fs')


//将小程序进行编译，并生成.wxapkg文件
function $compileFile(weappName, projectPath, weappCompilePath, wechatDevtoolsPath){
    return new Promise((resolve, reject) => {
      console.log(`开始编译“${weappName}”小程序`)

      let workerProcess = exec(`cli auto-preview --project ${projectPath}`, {cwd: wechatDevtoolsPath}, (error, stdout, stderr) => {
        if(error){
            console.log('+++error', error)
        }
        console.log('+++stdout',stdout)
        console.log('+++stderr', stderr)
      })

      workerProcess.stdout.on('error', data =>{
          console.log('stdout', data)
      })
      workerProcess.stderr.on('data', data =>{
          console.log('stderr', data)
      })
      workerProcess.on('close', code => {
          console.log('编译结束', code)
          if(code == 0){
            console.log('开始监听文件变化', `${weappCompilePath}/__APP__.wxapkg`)
            fs.watch(`${weappCompilePath}/__APP__.wxapkg`, (eventType, filename) => {
              console.log('文件变化', eventType, filename)
              if(eventType == 'change'){
                clearTimeout(this.timer)
                this.timer = setTimeout(() => {

                  resolve()
                }, 300);
              }
            })
          }else{
            console.log(`编译失败,code=${code}`)
            reject('编译失败，code=${code}');
          }
      })

    })
    
}
//将_APP_.wxapkg copy到当前目录下，并修改文件名
function $copyFile(resourcePath, aimPath){
  return new Promise((resolve, reject) => {
    console.log('------开始copy文件')
    console.log(`--源文件:${resourcePath}，目标:${aimPath}`)
    if(!fs.existsSync(resourcePath)){
      console.log('不存在此文件', resourcePath)
      reject(`拷贝文件失败，不存在此文件${resourcePath}`)
    }else{
      fs.copyFile(resourcePath, aimPath, (data)=>{
        console.log('--拷贝文件完成--', data)
        if(!fs.existsSync(aimPath)){
        console.log('不存在此文件', resourcePath)
        reject(`拷贝文件失败，不存在此文件${resourcePath}`)
        }else{
          resolve()
        }
        
      })
    }
  })
    
}
//调用adb命令将小程序包push到车机or手机
function $pushToMobile(pkgPath, weappName, appName){
  return new Promise((resolve, reject) => {
    console.log('-----开始将小程序包push到车机')
    let pathInCar = (appName === 'debug')? 'sdcard/moss/weapp': `data/data/com.tencent.wecarmas/files/moss/${weappName}/pkg`

    let workerProcess = exec(`adb push ${pkgPath} ${pathInCar}`, {cwd: './'})

    workerProcess.stdout.on('data', data =>{
        console.log('push stdout', data)
        if(data.indexOf('Permission denied') != -1){
          console.log('Permission denied', data.indexOf('Permission denied'))
          reject('Permission denied: adb没有push权限')
        }
    })
    workerProcess.stderr.on('data', data =>{
        console.log('push stderr', data)
    })
    workerProcess.on('close', code =>{
      console.log('push close', code)
        if(code == 0){
            console.log('------完成push小程序包到车机')
            resolve()
        }
    })
  }) 
  
}
//启动应用
function $startApp(packageName){
    return new Promise(resolve => {
        exec(`adb shell am start ${packageName}`, (error, stdout, stderr) => {
            if(error){
                console.log('error', error)
            }
            console.log('stdout',stdout)
            console.log('stderr', stderr)
        })
        resolve()
    })
    
}
//关闭应用
function $closeApp(appName){
    console.log('关闭应用：'+ appName)
    exec(`adb shell am force-stop ${appName}`)
}
//截屏到电脑path目录
function $screenCap(path){
    execSync(`adb shell screencap -p /sdcard/screencap.png`)
    execSync(`adb pull /sdcard/screencap.png ${path}/screen_${new Date().getTime()}.png`)
}
//打开原生界面
function $openSetting(){
    $startApp('com.android.settings/.Settings')
}
//清除应用缓存
function $clearAppStorage(pkgName){
    exec(`adb shell pm clear ${pkgName}`)
}
//获取当前启动应用名和包名
function $getAppName(){
    exec('adb shell dumpsys window w |findstr \\/ |findstr name=',(error, stdout, stderr) => {
        if(error){
            console.log('error', error)
        }
        console.log('---stdout',stdout)
        console.log('stderr', stderr)

        console.log(stdout.match(/[(]name=(.*?)[)]/g))

    })
}
//查看连接的设备
function $getDevices(){
  exec('adb devices', (error, stdout, stderr) => {
    if(error){
      console.log('error', error)
    }
    console.log('getDevices stdout', stdout)
    console.log('getDevices stderr', stderr)
  })
}
function $startCMD(){

        var result = spawn('cmd.exe', ['/s', '/c', 'ipconfig']);
        result.on('close', function(code) {
            console.log('child process exited with code :' + code);
        });
        result.stdout.on('data', function(data) {
            console.log('stdout: ' + data);
        });
        result.stderr.on('data', function(data) {
            console.log('stderr: ' + data);

        });
}
//将当前时间格式化为年月日 20201206
function formateDate(){
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  month = month > 9? month: '0'+ month
  let day = date.getDate();
  day = day > 9? day: '0'+ day
  let hour = date.getHours();
  hour = hour > 9? hour: '0'+ hour
  let minutes = date.getMinutes();
  minutes = minutes > 9? minutes: '0'+ minutes
  let seconds = date.getSeconds();
  seconds = seconds > 9? seconds: '0'+ seconds
  return `${year}${month}${day}${hour}${minutes}${seconds}`
}
export {$compileFile, $copyFile, $pushToMobile, $startApp, $screenCap, $openSetting, $clearAppStorage, $getAppName, $closeApp, $startCMD, $getDevices, formateDate}