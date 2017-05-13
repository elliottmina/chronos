var DailyGoalProgressBar = function(goal, el) {

	var bar;
	var overageBar;
	var hours = 0;

	var init = function() {
		gatherComponents();
	};

	var gatherComponents = function() {
		bar = jQuery('#DailyGoal .progress_inner');
		overageBar = jQuery('#DailyGoal .progress_overage');
	};

	var reset = function() {
		hours = 0;
		bar.css('width', '0%');
	};

	init();

	return {
		add:function(delta) {
			var full = hours >= goal;
			hours += delta;

			var percent = (hours/goal)*100;
			if (percent > 100)
				percent = 100;

			if (!full) {
				bar.animate({width:percent + '%'}, 50, 'linear');
			} else {
				overageBar.css('opacity', 1);
				overageBar.animate({'opacity': 0}, 100, 'linear');
			}
		},
		reset:reset
	};

};
