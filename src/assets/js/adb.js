<<<<<<<< HEAD:src/assets/js/adb.js
import adb from 'adbkit'

const client = adb.createClient()
// const debug = require('debug')('scrcpy')
console.log('adb -------------')
const onDevices = sender => {
	console.log('------------------adb', sender)
	client.trackDevices()
		.then(function (tracker) {
			tracker.on('add', function (device) {
				console.log('Device %s was plugged in', device.id)
				// debug('Device %s was plugged in', device.id)
				client.listDevices().then(function (devices) {
					console.log(devices)
					// debug(devices)
					sender.send('devices', devices)
				})
			})
			tracker.on('remove', function (device) {
				console.log('Device %s was unplugged', device.id)
				// debug('Device %s was unplugged', device.id)
				client.listDevices().then(function (devices) {
					// debug(devices)
					console.log(devices)
					sender.send('devices', devices)
				})
			})
			tracker.on('end', function () {
				console.log('Tracking stopped')
				// debug('Tracking stopped')
			})
		})
		.catch(function (err) {
			console.log(err)
			// debugor('Something went wrong:', err.stack)
		})
}
const connect = ({ sender }, args) => {
	const { id, ip } = args
	const success = 'Successfully opened wireless connection'
	const fail = 'Failed to open wireless connection'
	if (id) {
		client.tcpip(id)
			.then(function (port) {
				client.connect(ip, port).then(function (err) {
					if (err) {
						sender.send('connect', { success: false, message: fail })
						return
					}
					sender.send('connect', { success: true, message: success })
				}).catch(() => {
					sender.send('connect', { success: false, message: fail })
				})
			}).catch(() => {
				client.connect(ip).then(function (err) {
					if (err) {
						sender.send('connect', { success: false, message: fail })
						return
					}
					sender.send('connect', { success: true, message: success })
				}).catch(() => {
					sender.send('connect', { success: false, message: fail })
				})
			})
	} else {
		client.connect(ip).then(function (err) {
			if (err) {
				sender.send('connect', { success: false, message: fail })
				return
			}
			sender.send('connect', { success: true, message: success })
		}).catch(() => {
			sender.send('connect', { success: false, message: fail })
		})
	}
}

const disconnect = ({ sender }, ip) => {
	client.disconnect(ip).then(id => {
		// debug(id)
		console.log(id)
		sender.send('connect', { success: false, message: 'Device shutdown succeeded' })
	}).catch(err => {
		console.log(err)
		// debug(err)
		sender.send('connect', { success: false, message: 'Device shutdown failed' })
	})
}

export default {
	connect, disconnect, onDevices
}
========
import adb from 'adbkit'
const client = adb.createClient()
// const debug = require('debug')('scrcpy')

const onDevices = sender => {
	client.trackDevices()
		.then(function (tracker) {
			tracker.on('add', function (device) {
				console('Device %s was plugged in', device.id)
				client.listDevices().then(function (devices) {
					console(devices)
					sender.send('devices', devices)
				})
			})
			tracker.on('remove', function (device) {
				console('Device %s was unplugged', device.id)
				client.listDevices().then(function (devices) {
					console(devices)
					sender.send('devices', devices)
				})
			})
			tracker.on('end', function () {
				console('Tracking stopped')
			})
		})
		.catch(function (err) {
			console('Something went wrong:', err.stack)
		})
}
const connect = ({ sender }, args) => {
	const { id, ip } = args
	const success = 'Successfully opened wireless connection'
	const fail = 'Failed to open wireless connection'
	if (id) {
		client.tcpip(id)
			.then(function (port) {
				client.connect(ip, port).then(function (err) {
					if (err) {
						sender.send('connect', { success: false, message: fail })
						return
					}
					sender.send('connect', { success: true, message: success })
				}).catch(() => {
					sender.send('connect', { success: false, message: fail })
				})
			}).catch(() => {
				client.connect(ip).then(function (err) {
					if (err) {
						sender.send('connect', { success: false, message: fail })
						return
					}
					sender.send('connect', { success: true, message: success })
				}).catch(() => {
					sender.send('connect', { success: false, message: fail })
				})
			})
	} else {
		client.connect(ip).then(function (err) {
			if (err) {
				sender.send('connect', { success: false, message: fail })
				return
			}
			sender.send('connect', { success: true, message: success })
		}).catch(() => {
			sender.send('connect', { success: false, message: fail })
		})
	}
}

const disconnect = ({ sender }, ip) => {
	client.disconnect(ip).then(id => {
		console(id)
		sender.send('connect', { success: false, message: 'Device shutdown succeeded' })
	}).catch(err => {
		console(err)
		sender.send('connect', { success: false, message: 'Device shutdown failed' })
	})
}

export default {
	connect, disconnect, onDevices
}
>>>>>>>> 修改adb.js:src/main/adb.js
