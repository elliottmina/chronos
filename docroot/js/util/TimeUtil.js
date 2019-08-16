var TimeUtil = function() {

	var padder = new Padder();

	var addDays = function(date, dayAdjustment) {
		return new Date(date.getTime() + dayAdjustment*86400000);
	};

	var parseUtcYmd = function(ymd) {
		var parts = ymd.split('-');
		return new Date(Date.UTC(
			parts[0],
			parseInt(parts[1]) -1, 
			parts[2],
			0, 0, 0));
	};

	return {
		parseUtcYmd:parseUtcYmd,
		getYmd:function(date) {
			return date.getFullYear() + '-' +
				padder.twoDigit(date.getMonth()+1) + '-' +
				padder.twoDigit(date.getDate());
		},
		addDays:addDays,
		get12Hour(date) {
			var hours = date.getHours();
			
			var period = hours < 12 ? 'AM' : 'PM';
			
			if (hours > 12)
				hours -= 12;
	
			if (hours == 0)
				hours = 12;

			var minutes = date.getMinutes().toString();
			var time = hours + ':' + padder.twoDigit(minutes);

			return {
				time:time, 
				period:period
			};
		},
		getNewDayStr: function(date, dayAdjustment) {
			var newDate = addDays(date, dayAdjustment);
			return newDate.getUTCFullYear() + '-' + 
				padder.twoDigit(newDate.getUTCMonth()+1) + '-' + 
				padder.twoDigit(newDate.getUTCDate());
		},
		isValidDate: function(d) {
			return d instanceof Date && !isNaN(d);
		},
		getWeekStart:function(date) {
	    var d = parseUtcYmd(date);
	    if (d.getDay() != 6)
	      d.setDate(d.getDate() - d.getDay());
	    return d;
		}
	};

};
