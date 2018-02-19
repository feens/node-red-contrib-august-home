var hdrs = require('./augustPostmanCollection.json');

module.exports = {};

/**
* Utility to go through all the steps needed to get the user's API key
*
* @param {Object} api - the base api data
* @param {function(string)} questionFunc - an async function that can be called to interact with the user and return the response to the question 
* @returns {Promise<string>} sets and returns the API key 
*/
module.exports.getUserApiKey = async function(api, questionFunc) {
	let phoneNumber = await questionFunc('What is your phone number (format: +15551114444)?');
	let emailAddress = await questionFunc('What is your email address?');
	let passwd = await questionFunc('What is your password?');
	let pResult = await api.authenticate('phone:' + phoneNumber, passwd);
	api.updateJwt(pResult.response.headers['x-august-access-token']);
	await api.sendCodeToPhone(phoneNumber);
	let pCode = questionFunc('A validation code has been requested on your phone - you should get a text message with the code. What is the validation code?');
	let pvResult = await api.validatePhone(phoneNumber, pCode);
	api.updateJwt(pvResult.response.headers['x-august-access-token']);
	await api.sendCodeToEmail(emailAddress);
	let eCode = questionFunc('A validation code has been requested on your email - you should get an email with the code. What is the validation code?');
	let eResult = await api.validateEmail(emailAddress, code);
	api.updateJwt(eResult.response.headers['x-august-access-token']);		// result.response.headers['x-august-access-token'] should contain our API key!
	return eResult.response.headers['x-august-access-token'];
};

/**
* Get firmware keys and other information from all locks
*
* @param {Object} api - the base api data
* @returns {Promise<Object[]>} an array of objects, each in this form: {l: lock, sn: serial number, id: lock ID, key: firmware key, err: error string}
*/
module.exports.getFirmwareKeys = async function(api) {
	var locks = await api.getLocks();
	var lockIds = Object.keys(locks);
	var rtn = [];
	for (var i = 0; i < lockIds.length; i++) {
		var firmware = await api.getTiFirmware(lockIds[i], '1.1.20');
		var extraDataStart = firmware.length - 68;
		rtn.push({
			l: locks[lockIds[i]],
			sn: firmware.toString('ascii', extraDataStart, extraDataStart + 10),
			id: firmware.toString('hex', extraDataStart + 16, extraDataStart + 32),
			key: firmware.toString('hex', extraDataStart + 48, extraDataStart + 64)
		});
	}
	return rtn; 
};
