var request = require('request');
var reqData = require('./requestData.js');

module.exports = function(RED) {
	RED.nodes.registerType('august-home', function(config) {
		RED.nodes.createNode(this, config);
		var node = this;
		node.on('input', function(msg) {
			var sendMsg = function(sendDta) {
				msg.payload = sendDta;
				msg.title = 'August Data';                                           // see https://github.com/node-red/node-red/wiki/Node-msg-Conventions
				msg.description = 'Response data from August API';
				node.send(msg);
			};
			
			// *** TO-DO

		});
	}, { credentials: { email: {type: "text"}, phone: {type: "text"}, apiKey: {type: "password"} } } );
};
