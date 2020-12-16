const { exec, execSync, spawn} = window.require('child_process')
const fs = window.require('fs')


//将小程序进行编译，并生成.wxapkg文件
function $compileFile(weappName, projectPath, weappCompilePath, wechatDevtoolsPath){
    return new Promise((resolve, reject) => {
      console.log(`开始编译“${weappName}”小程序`)
      let timer = null;
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
          if(data.indexOf('×') > -1){
            reject('请先在微信开发工具上打开服务端口')
          }
      })
      workerProcess.on('close', code => {
        
          console.log('编译close', code)
          if(code == 0){
            console.log('开始监听文件变化', `${weappCompilePath}/__APP__.wxapkg`)
            fs.watch(`${weappCompilePath}/__APP__.wxapkg`, (eventType, filename) => {
              console.log('文件变化', eventType, filename)
              if(eventType == 'change'){
                console.log(11111)
                clearTimeout(timer)
                timer = setTimeout(() => {
                  console.log('编译完成--------')
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

      reject(`拷贝失败，不存在此文件:${resourcePath}`)
    }else{
      if(fs.existsSync(aimPath)){
        fs.unlinkSync(aimPath)
      }
      fs.copyFile(resourcePath, aimPath, (data)=>{
        console.log('--拷贝文件完成--', data)
        if(!fs.existsSync(aimPath)){
        console.log('不存在此文件', resourcePath)

        reject(`拷贝失败，不存在此文件:${resourcePath}`)
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
    //先判断设备上将要push的目录是否存在
    $isExistFileInDevice(pathInCar).then(() => {
      let workerProcess = exec(`adb push ${pkgPath} ${pathInCar}`, {cwd: './'})
  
      workerProcess.stdout.on('data', data =>{
          console.log('push stdout', data)
          if(data.indexOf('Permission denied') > -1){
            console.log('Permission denied', data.indexOf('Permission denied'))
            reject('Permission denied: adb没有push权限')
          }
          if(data.indexOf('no devices/emulators') > -1){
            reject('设备连接中断，push失败')
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
    }).catch(err => {
      reject(err)
    })
    
  }) 
  
}
//启动应用
function $startApp(packageName){
    return new Promise((resolve, reject) => {
        exec(`adb shell am start ${packageName}`, (error, stdout, stderr) => {
            if(error){
                console.log('error', error)
            }
            console.log('stdout',stdout)
            if(stdout.indexOf('no devices/emulators') > -1){
              reject('设备连接中断')
            }
            console.log('stderr', stderr)
            resolve()
        })
        
    })
    
}
//关闭应用
function $closeApp(appName){
  return new Promise((resolve, reject) => {
    console.log('关闭应用：'+ appName)
    exec(`adb shell am force-stop ${appName}`, (error, stdout, stderr) => {
      if(error){
        console.log('error', error)
      }
      console.log('stdout',stdout)
      if(stdout.indexOf('no devices/emulators') > -1){
        reject('设备连接中断')
      }
      console.log('stderr', stderr)
    })
  })
    
}
//截屏到电脑path目录
function $screenCap(path){
    execSync(`adb shell screencap -p /sdcard/screencap.png`, )
    execSync(`adb pull /sdcard/screencap.png ${path}/screen_${new Date().getTime()}.png`)
}
//清除应用缓存
function $clearAppStorage(pkgName){
    exec(`adb shell pm clear ${pkgName}`)
}
//获取当前启动应用名和包名
function $getAppName(){
  return new Promise((resolve, reject) => {
    exec('adb shell dumpsys window w |findstr \\/ |findstr name=',(error, stdout, stderr) => {
      if(error){
          console.log('error', error)
      }
      console.log('---stdout',stdout)
      console.log('stderr', stderr)
      if(stdout.indexOf('no devices/emulators') > -1){
        reject('设备连接中断')
      }
      if(stdout.match(/[(]name=(.*?)[)]/g).length > 0){
        console.log(stdout.match(/[(]name=(.*?)[)]/g))
        resolve()
      }else{
        reject('当前没有正在启动的应用')
      }
    })
  })
    
}
//查看连接的设备
function $getDevices(){
  return new Promise((resolve, reject) => {
    exec('adb devices', (error, stdout, stderr) => {
      if(error){
        console.log('error', error)
      }
      console.log('getDevices stdout', stdout)
      if(stdout.match(/[0-9]/g)){ 
        console.log('当前的设备', stdout)
        resolve()
      }else{
        reject('当前没有设备连接')
      }
      console.log('getDevices stderr', stderr)
    })
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
function $formateDate(){
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
function $isExistFileInDevice(filePath){
  return new Promise((resolve, reject)=> {
    exec(`adb shell find ${filePath}`, (error, stdout, stderr) => {
      if(error){
        console.log('stderr', error)
      }
      console.log('stdout', stdout)
      if(stdout.indexOf('no devices/emulators') > -1){
        reject('设备连接中断')
      }
      if(stdout.indexOf('No such file or directory') > -1){
        reject(`不存在此文件或文件夹：${filePath}`)
      }else{
        resolve()
      }
      console.log('stderr', stderr)
    })
  })
  
}
//判断电脑程序是否在运行
function $isAppRunning(appName, appNameZh){
  return new Promise((resolve, reject) => {
    exec(`tasklist`, (error, stdout, stderr) => {
      if(error){
        console.log('stderr', error)
      }
      console.log('stdout', stdout)
      if(stdout.indexOf(`${appName}.exe`) != -1){
        console.log(`------${appName}正在运行-------`)
        resolve()
        
      }else{
        console.log(`------${appName}没有启动-------`)
        reject(`请先启动：${appNameZh}`)
      }
      console.log(stderr)
    })
  })
}

//打开桌面
function $showLaunch(){
  execSync(`adb shell setprop sys.thirdapk.caninstall 1`)
  execSync(`adb shell am force-stop com.android.launcherWT`)
}


export {
  $compileFile, 
  $copyFile, 
  $pushToMobile, 
  $startApp, 
  $screenCap, 
  $clearAppStorage, 
  $getAppName, 
  $closeApp, 
  $startCMD, 
  $getDevices, 
  $formateDate, 
  $isExistFileInDevice,
  $isAppRunning,
  $showLaunch
}