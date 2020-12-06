const { exec } = window.require('child_process')
import {formateDate} from './tools'

class Scrcpy{
    constructor(){
        '',
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
    start(windowSetting){

        let workerProcess = exec(this.getCmdStr(windowSetting), {cwd: ''})

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
    getCmdStr(options, fileSavePath){
        let cmdStr = 'scrcpy'
        this.fileSavePath = fileSavePath

        for(let key in options){
            cmdStr += this.cmdObj[key](options[key])
        }
        console.log(cmdStr)
        return cmdStr
    }
}

module.exports = Scrcpy