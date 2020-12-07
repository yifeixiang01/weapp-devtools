const { exec } = window.require('child_process')

class Scrcpy{
    constructor(){
        this.fileSavePath = ''
        this.cmdObj = {
            windowTitle: title => title? ' --window-title ' + title: '',      //窗口标题
            borderless: flag => flag? ' --window-borderless': '',             //无边框
            alwaysOnUp: flag => flag? ' --always-on-top': '',                 //窗口置顶
            fullscreen: flag => flag? ' --fullscreen': '',                    //全屏启动
            screenOff: flag => flag? ' --turn-screen-off': '',                //黑屏启动
            stayAwake: flag => flag? ' --stay-awake': '',                     //保持常亮
            showTouches: flag=> flag? ' --show-touches': '',                  //显示触摸轨迹
            disableScreensaver: flag => flag? '--disable-screensaver': '',    //关闭屏保
            record: flag => flag? ` --record ${this.fileSavePath}/record${formateDate()}.mp4`: ''
        }
    }
    start(windowSetting, fileSavePath){
        let workerProcess = exec(this.getCmdStr(windowSetting), {cwd: ''})
        this.fileSavePath = fileSavePath

        workerProcess.stdout.on('data', data =>{
            console.log('stdout', data)
        })
        workerProcess.stderr.on('data', data =>{
            console.log('stderr', data)
        })
        workerProcess.on('close', code => {
            console.log('关闭', code)
        })
    }
    getCmdStr(options){
        let cmdStr = 'scrcpy'
        
        for(let key in options){
            cmdStr += this.cmdObj[key](options[key])
        }
        console.log(cmdStr)
        return cmdStr
    }
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
module.exports = Scrcpy