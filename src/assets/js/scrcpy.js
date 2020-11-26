const { exec } = window.require('child_process')

class Scrcpy{
    constructor(){
        this.cmdObj = {
            windowTitle: title => title? ' --window-title ' + title: '',
            borderless: flag => flag? ' --window-borderless': '',
            alwaysOnUp: flag => flag? ' --always-on-top': '',
            fullscreen: flag => flag? ' --fullscreen': '',
            screenOff: flag => flag? ' --turn-screen-off': '',
            stayAwake: flag => flag? ' --stay-awake': '',
            showTouches: flag=> flag? ' --show-touches': '',
            disableScreensaver: flag => flag? '--disable-screensaver': '',

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
    getCmdStr(options){
        let cmdStr = 'scrcpy'

        for(let key in options){
            cmdStr += this.cmdObj[key](options[key])
        }
        console.log(cmdStr)
        return cmdStr
    }
}

module.exports = Scrcpy