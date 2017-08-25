var DateNudgerShortcuts = function() {

	var padder;
	var timeUtil;
	var keyEvaluator;
	var date;

	var init = function() {
		buildDependencies();
		addBehavior();
	};

	var buildDependencies = function() {
		padder = new Padder();
		timeUtil = new TimeUtil();
		keyEvaluator = new MetaKeyEvaluator();
	};

	var addBehavior = function() {
		App.dispatcher.register('DATE_CHANGED', onDateChanged);
		jQuery(document).keydown(onKeyDown);
	};

	var onDateChanged = function(data) {
		date = timeUtil.parseUtcYmd(data.date);
	};

	var onKeyDown = function(e) {
		switch (keyEvaluator.get(e)) {

			case 'ARROWLEFT':
				e.stopPropagation();
				e.preventDefault();
				App.dispatcher.update(
					'DATE_SUBMITTED', 
					timeUtil.getNewDayStr(date, -1));
				return;

			case 'ARROWRIGHT':
				e.stopPropagation();
				e.preventDefault();
				App.dispatcher.update(
					'DATE_SUBMITTED', 
					timeUtil.getNewDayStr(date, 1));
				return;
		}
	};

	init();

};
