var DailyGoal = function() {

	var goal = 8;
	var rocketLauncher;
	
	var init = function() {
		build();
		addBehavior();
	};

	var build = function() {
		var renderTo = jQuery('#DailyGoal');
		renderTo.html(DailyGoalTemplate);
		
		rocketLauncher = new DailyGoalRocketLauncher(
			new DailyGoalProgressBar(goal, renderTo),
			new DailyGoalText(goal, renderTo),
			renderTo.find('.progress_outer'));
		
	};

	var addBehavior = function() {
		App.dispatcher.register('DATE_CHANGED', onDateChanged);
		App.dispatcher.register('SPAN_SAVED', onSpanSaved);
		App.dispatcher.register('SPAN_DELETED', onSpanDeleted);
	};

	var onSpanSaved = function(data) {
		updateProgress(data.record.spans);
	};

	var onSpanDeleted = function(data) {
		updateProgress(data.spans);
	};

	var onDateChanged = function(record) {
		rocketLauncher.reset();
		updateProgress(record.spans);
	};

	var updateProgress = function(spans) {
		var hours = getHoursFromSpans(spans);
		rocketLauncher.update(hours);
	};

	var getHoursFromSpans = function(spans) {
		var totalMillis = 0;
		jQuery.each(spans, function(key, span) {
			totalMillis += new Date(span.finish) - new Date(span.start);
		});

		return totalMillis/1000/60/60;
	};

	init();
};
