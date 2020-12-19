const adb = window.require('adbkit')

const client = adb.createClient()

const onDevices = ({onadd, onremove, onend}) => {
	client.trackDevices()
		.then(function (tracker) {
			tracker.on('add', function (device) {
				client.listDevicesWithPaths().then(function (list) {
					console.log(list)
					onadd && onadd({device, list})
				})
			})
			tracker.on('remove', function (device) {
				client.listDevicesWithPaths().then(function (list) {
				
					onremove && onremove({device, list})
				})
			})
			tracker.on('end', function () {
				onend && onend()
			})
		})
		.catch(function (err) {
			console.log(err)
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
