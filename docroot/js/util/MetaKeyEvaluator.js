var MetaKeyEvaluator = function() {

	var propKey;

	var init = function() {
		if (navigator.userAgent.indexOf('Macintosh') > -1)
			propKey = 'metaKey';
		else
			propKey = 'altKey';
	};

	init();

	return {
		get:function(e) {
			if (e.ctrlKey)
				return e.key.toUpperCase();
		}
	}
};
