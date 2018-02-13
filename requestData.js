var hdrs = require('./augustPostmanCollection.json');

module.exports = {
	
	/**
	* Utility to go through all the steps needed to get the user's API key
	*
	* @param {Object} api - the base api data
	* @param {function(string, function(string, string))} questionFunc - a function that can be called to interact with the user, ask a question and callback(error, answer) on the response to the question 
	*/
	var getUserApiKey = async function(api, questionFunc) {
		questionFunc('What is your phone number (format: +15551114444)?', function(err, phoneNumber) {
			questionFunc('What is your email address?', function(err, emailAddress) {
				questionFunc('What is your password?', function(err, passwd) {
					let result = await api.authenticate('phone:' + phoneNumber, passwd);
					api.updateJwt(result.response.headers['x-august-access-token']);
					await api.sendCodeToPhone(phoneNumber);
					questionFunc('A validation code has been requested on your phone - you should get a text message with the code. What is the validation code?', function(err, pCode) {
						let result = await api.validatePhone(phoneNumber, pCode);
						api.updateJwt(result.response.headers['x-august-access-token']);
						await api.sendCodeToEmail(emailAddress);
						questionFunc('A validation code has been requested on your email - you should get an email with the code. What is the validation code?', function(err, eCode) {
						let result = await api.validateEmail(emailAddress, code);
						api.updateJwt(result.response.headers['x-august-access-token']);		// result.response.headers['x-august-access-token'] should contain our API key!
						});	
					});
				});
			});
		});
	};

	/**
	* Get firmware keys and other information from all locks
	*
	* @param {Object} api - the base api data
	* @param {function(string, Array)} cb - callback function with parameters (1) error, if any; (2) array of objects, each in this form: {l: lock, sn: serial number, id: lock ID, key: firmware key, err: error string}
	*/
	var getFirmwareKeys = async function(api, cb) {
		try {
			var locks = await api.getLocks();
			var lockIds = Object.keys(locks);
			var rtn = [];
			var pErr = null;
			for (var i = 0; i < lockIds.length; i++) {
				rtn[i] = { l: locks[lockIds[i]] };
				try {
					var firmware = await api.getTiFirmware(lockIds[i], '1.1.20');
					var extraDataStart = firmware.length - 68;
					rtn[i]["sn"] = firmware.toString('ascii', extraDataStart, extraDataStart + 10);
					rtn[i]["id"] = firmware.toString('hex', extraDataStart + 16, extraDataStart + 32);
					rtn[i]["key"] = firmware.toString('hex', extraDataStart + 48, extraDataStart + 64);
				} catch(e){
					rtn[i]["err"] = 'Could not get key for ' + l;
					pErr = true;	// indicates that at least one key had an error
				}
			}
			cb(pErr, rtn); 
		} catch(e) {
			cb('Error in getFirmwareKeys(): ' + e);
		}
	}
};
