// const Api = require('./api.js');
// let api = new Api(apiConfig);
const reqData = require('./requestData.js');

module.exports = function(RED) {
	RED.nodes.registerType('august-home', function(nodeConfig) {
		RED.nodes.createNode(this, nodeConfig);
		let node = this;		
		let apiConfig = {				// configs used in various functions - many use different aliases, so all are included, rather than re-writing all of jmaxxz's code
			"jwt":						node.credentials.apiKey,	// The x-august-access-token - Obtained via the authentication apis (see https://github.com/jmaxxz/keymaker/issues/5#issuecomment-360007335)
			"x-august-access-token":	node.credentials.apiKey,
			"apiKey":					node.credentials.apiKey,
			"ApiKey":					node.credentials.apiKey,
			"keaseApiKey":				"14445b6a2dba",				// Constant. An key which appears to be shared by all users which provides API access. This doesn't change and we always use the provided value.
			"x-kease-api-key":			"14445b6a2dba",
			"x-august-api-key":			"14445b6a2dba",
			"KeaseApiKey":				"14445b6a2dba",
			"installId":				node.credentials.installId,	// A random value used by the APIs to determine if this device is authorized to access this user's account.
			"installid":				node.credentials.installId,
			"content-type":				"application/json",
			"Email":					node.credentials.email,		// email address of the user
			"email":					node.credentials.email,
			"Phone":					node.credentials.phone,		// phone number of the user in the format "+15554443333"
			"phone":					node.credentials.phone,
			"Password":					node.credentials.password,	// user's password
			"password":					node.credentials.password
			// other options used in requests.json: {{ListingId}} {{LockId}} {{MfgBridgeId}} {{BridgeId}} {{NestcamId}} {{SSID}} {{WiFiPSK}} {{BridgeAuthToken}} {{HouseId}} {{DoorbellId}} {{DoorbellSn}} {{GuestUserId}} {{UserType}} {{RuleId}} {{KeypadId}} {{KeypadSn}} {{UserId}} {{action}} {{PartnerId}}
		};
		
		node.on('input', async function(msg) {
			let sendMsg = function(sendDta) {
				msg.payload = sendDta;
				msg.title = 'August Data';				// see https://github.com/node-red/node-red/wiki/Node-msg-Conventions
				msg.description = 'Response data from August API';
				node.send(msg);
			};
			if (typeof msg.payload === 'string') msg.payload = JSON.parse(msg.payload);				// take either an Object or JSON as the node's input
			if (msg.payload.options) apiConfig = Object.assign(apiConfig, msg.payload.options);		// replace/add any options passed on the input
			sendMsg(await reqData.apiCall(apiConfig, msg.payload.group, msg.payload.name));
		});
	}, { credentials: { email: {type: "text"}, phone: {type: "text"}, installId: {type: "text"}, password: {type: "password"}, apiKey: {type: "password"} } } );
};
