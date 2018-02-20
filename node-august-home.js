const Api = require('./api.js');
const reqData = require('./requestData.js');

module.exports = function(RED) {
	RED.nodes.registerType('august-home', function(nodeConfig) {
		RED.nodes.createNode(this, nodeConfig);
		let node = this;		
		let config = {									// configs used in various functions - many use different aliases, so all are included, rather than re-writing all of jmaxxz's code
			"jwt": node.credentials.apiKey,				// The x-august-access-token - Obtained via the authentication apis (see https://github.com/jmaxxz/keymaker/issues/5#issuecomment-360007335)
			"x-august-access-token": node.credentials.apiKey,
			"apiKey": node.credentials.apiKey,
			"ApiKey": node.credentials.apiKey,
			"keaseApiKey": "14445b6a2dba",				// Constant. An key which appears to be shared by all users which provides API access. This doesn't change and we always use the provided value.
			"x-kease-api-key": "14445b6a2dba",
			"x-august-api-key": "14445b6a2dba",
			"KeaseApiKey": "14445b6a2dba",
			"installId": node.credentials.installId,	// A random value used by the APIs to determine if this device is authorized to access this user's account.
			"content-type": "application/json",
			"Email": node.credentials.email,
			"Phone": node.credentials.phone,
			"Password": node.credentials.password
		};
		// other options used in requests.json: {{ListingId}} {{LockId}} {{MfgBridgeId}} {{BridgeId}} {{NestcamId}} {{SSID}} {{WiFiPSK}} {{BridgeAuthToken}} {{HouseId}} {{DoorbellId}} {{DoorbellSn}} {{GuestUserId}} {{UserType}} {{RuleId}} {{KeypadId}} {{KeypadSn}} {{UserId}} {{action}} {{PartnerId}}

		var api = new Api(config);		
		
		node.on('input', function(msg) {
			var sendMsg = function(sendDta) {
				msg.payload = sendDta;
				msg.title = 'August Data';				// see https://github.com/node-red/node-red/wiki/Node-msg-Conventions
				msg.description = 'Response data from August API';
				node.send(msg);
			};
			
			// *** TO-DO

		});
	}, { credentials: { email: {type: "text"}, phone: {type: "text"}, installId: {type: "text"}, password: {type: "password"}, apiKey: {type: "password"} } } );
};
