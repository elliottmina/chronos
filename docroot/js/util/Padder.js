var Padder = function() {

	return {
		twoDigit:function(val) {
			val = val.toString();
			if (val.length == 1)
				val = '0' + val;
			return val;
		}
	};

};
