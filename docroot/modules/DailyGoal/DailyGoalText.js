var DailyGoalText = function(goal, renderTo) {
	
	var roundDecimal;
	var progressPercentEl;
	var remainingEl;
	var totalEl;
	var hours = 0;
	var delta;
	var intervalHandle;
	var intervalDelay = 50;
	var fillPadding = 1000;
	var fillRate;

	var init = function() {
		roundDecimal = Rounder.roundDecimal;
		gatherComponents();
		updateNumbers();
	};

	var gatherComponents = function() {
		totalEl = renderTo.find('.total .amount');
		progressPercentEl = renderTo.find('.progress_percent');
		remainingEl = renderTo.find('.remaining');
	};

	var updateNumbers = function() {
		var percent = (hours/goal)*100;
		progressPercentEl
			.text(roundDecimal(percent, 0) + '%');
		remainingEl.text(roundDecimal(goal - hours, 2) + ' hours remaining');
		totalEl.text(roundDecimal(hours, 2));
	};

	init();

	return {
		add:function(delta) {
			hours += delta;
			updateNumbers();
		},
		reset:function() {
			hours = 0;
			updateNumbers();
		}
	};

};
