JsonExportCollector = function(timeUtil) {
	
	var range = 1000;
	var exportData;
	var currDate;

	var getStartingDate = function() {
		var startYmd = timeUtil.getNewDayStr(new Date(), range*-1);
		return timeUtil.parseUtcYmd(startYmd);
	};

	var iterate = function() {
		var record = App.persister.fetch(timeUtil.getYmd(currDate));
		if (Object.keys(record.spans).length)
			exportData.push(record);
		currDate = timeUtil.addDays(currDate, 1);
	};

	return {
		collect:function() {
			exportData = [];
			currDate = getStartingDate();
			var today = new Date();

			while (currDate <= today)
				iterate();

			return exportData;
		}
	}
};
