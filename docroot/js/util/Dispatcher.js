var Dispatcher = function() {

	var list = {};

	var ensureKeyExists = function(eventName) {
		if (typeof list[eventName] === 'undefined') {
			list[eventName] = [];
		}
	};

	return {
		subscribe:function(eventName, callback) {
			ensureKeyExists(eventName);
			list[eventName].push(callback);
		},
		publish:function(eventName, payload) {
			ensureKeyExists(eventName);
			jQuery.each(list[eventName], function(index, callback) {
				callback(payload);
			});
		}
	}
};
