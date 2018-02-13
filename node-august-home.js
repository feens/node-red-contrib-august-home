var request = require('request');
const Api = require('./api.js');
var reqData = require('./requestData.js');

module.exports = function(RED) {
	RED.nodes.registerType('august-home', function(config) {
		RED.nodes.createNode(this, config);
		var node = this;		
		var apiDta = {
			"jwt": node.credentials.apiKey,				// The x-august-access-token - Obtained via the authentication apis (see https://github.com/jmaxxz/keymaker/issues/5#issuecomment-360007335)
			"installId": node.credentials.installId,	// A random value used by the APIs to determine if this device is authorized to access this user's account.
			"keaseApiKey": "14445b6a2dba",				// Constant. An key which appears to be shared by all users which provides API access. This doesn't change and we always use the provided value.
		};

		var api = new Api(apiDta);		
		
		node.on('input', function(msg) {
			var sendMsg = function(sendDta) {
				msg.payload = sendDta;
				msg.title = 'August Data';				// see https://github.com/node-red/node-red/wiki/Node-msg-Conventions
				msg.description = 'Response data from August API';
				node.send(msg);
			};
			
			// *** TO-DO

		});
	}, { credentials: { email: {type: "text"}, phone: {type: "text"}, installId: {type: "text"}, apiKey: {type: "password"} } } );
};
