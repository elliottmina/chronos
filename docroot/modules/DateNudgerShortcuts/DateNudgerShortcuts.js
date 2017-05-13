var DateNudgerShortcuts = function() {

	var padder;
	var timeUtil;
	var date;

	var init = function() {
		gatherDependencies();
		addBehavior();
	};

	var gatherDependencies = function() {
		padder = new Padder();
		timeUtil = new TimeUtil();
	};

	var addBehavior = function() {
		App.dispatcher.register('DATE_CHANGED', onDateChanged);
		jQuery(document).keydown(onKeyDown);
	};


	var onDateChanged = function(data) {
		date = timeUtil.parseUtcYmd(data.date);
	};

	var onKeyDown = function(e) {
		if (e.key == 'ArrowRight' && e.metaKey) {
			e.stopPropagation();
			e.preventDefault();
			App.dispatcher.update('DATE_SUBMITTED', timeUtil.getNewDayStr(date, 1));
		}

		if (e.key == 'ArrowLeft' && e.metaKey) {
			e.stopPropagation();
			e.preventDefault();
			App.dispatcher.update('DATE_SUBMITTED', timeUtil.getNewDayStr(date, -1));
		}

	};

	init();

};
