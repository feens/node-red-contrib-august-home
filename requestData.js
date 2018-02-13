module.exports = {
	
	// *** TO DO - add description
	var getFirmwareKeys = async function(api, node) {
		try {
			var locks = await api.getLocks();
			var lockIds = Object.keys(locks);
			var rtn = [];
			for (var i = 0; i < lockIds.length; i++) {
				var l = locks[lockIds[i]];
				try {
					var firmware = await api.getTiFirmware(lockIds[i], '1.1.20');
					var extraDataStart = firmware.length - 68;
					var serialNumber = firmware.toString('ascii', extraDataStart, extraDataStart + 10);
					var readLockId = firmware.toString('hex', extraDataStart + 16, extraDataStart + 32);
					var firmwareKey = firmware.toString('hex', extraDataStart + 48, extraDataStart + 64);
					rtn.push({
						"l": l,
						"sn": serialNumber,
						"id": readLockId,
						"key": firmwareKey
					});
				} catch(e){
					node.warn('Error in getFirmwareKeys(): ' + e + ' -- Could not get key for ' + l);
				}
			}
			if (rtn.length) return rtn; else return null; 
		} catch(e) {
			node.warn('Error in getFirmwareKeys(): ' + e);
			return null;
		}
	}
};
