const { ipcRenderer } = window.require('electron')

const ipcRenderSend = (eventName, value) => {
    ipcRenderer.send(eventName, value)
    
}
const ipcRendererOn = (eventName, callback) => {
    ipcRenderer.on(eventName, (event, arg) => {
        callback && callback(arg)
    })
}
module.exports = {
    ipcRenderSend,
    ipcRendererOn
}