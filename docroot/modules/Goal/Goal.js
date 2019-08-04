var Goal = function() {

	var defaultHoursPerDay = 8;
	var defaultHoursPerWeek = 40;
	var hoursPerDay;
	var hoursPerWeek;
	var chart;
	var hourField;
	var percentField;
	var hoursRemainingField;
	
	var init = function() {
		calcInitialHoursPerDay();
		calcInitialHoursPerWeek();
		Chart.platform.disableCSSInjection = true;
		setTimeout(function() {
			chart.options.animation.duration = 500;
		}, 3000);
		build();
		gatherComponents();
		addBehavior();
		registerSettings();
	};

	var build = function() {
		jQuery('#Goal').html(GoalTemplate);
		chart = new Chart('GoalTodayChart',{
			type:'pie',
			options:{
				responsive:true,
				cutoutPercentage:90,
				animation:{
					duration:0,
					animateRotate:false
				},
				tooltips:{
					enabled:false
				}
			},
			data:{
				datasets:[{
					data:[70, 30],
					backgroundColor:['green', 'transparent'],
					hoverBackgroundColor:['green', 'transparent'],
					borderWidth:0
				}]
			}
		});
	};

	var gatherComponents = function() {
		hourField = jQuery('#GoalToday .hour_value');
		percentField = jQuery('#GoalToday .percent_value');
		hoursRemainingField = jQuery('#GoalToday .hours_remaining');
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
		console.log(record);
		updateProgress(record.spans);
	};

	var updateProgress = function(spans) {
		var hours = getHoursFromSpans(spans);
		var hoursRounded = Number.parseFloat(hours).toFixed(2);
		var hoursRemaining = Number.parseFloat(hoursPerDay - hours).toFixed(2);

		var percent = Math.round((hours/hoursPerDay)*100);
		if (percent > 100)
			percent = 100;
		chart.data.datasets[0].data = [
			percent, 100-percent
		];
		chart.update();
		hourField.text(hoursRounded);
		percentField.text(percent);
		hoursRemainingField.text(hoursRemaining);
	};

	var getHoursFromSpans = function(spans) {
		var totalMillis = 0;
		jQuery.each(spans, function(key, span) {
			totalMillis += new Date(span.finish) - new Date(span.start);
		});

		return totalMillis/1000/60/60;
	};

	var calcInitialHoursPerDay = function() {
		var savedValue = parseInt(localStorage.getItem('goal_hours_day'));
		if (isNaN(savedValue))
			hoursPerDay = defaultHoursPerDay;
		hoursPerDay = savedValue;
	};

	var calcInitialHoursPerWeek = function() {
		var savedValue = parseInt(localStorage.getItem('goal_hours_week'));
		if (isNaN(savedValue))
			hoursPerWeek = defaultHoursPerWeek;
		hoursPerWeek = savedValue;
	};

	var onHoursPerDayChange = function(newValue) {
		localStorage.setItem('goal_hours_day', newValue);
		hoursPerDay = newValue;
	};

	var onHoursPerWeekChange = function(newValue) {
		localStorage.setItem('goal_hours_week', newValue);
		hoursPerWeek = newValue;
	};

	var registerSettings = function() {
		App.settings.register([{
			section:'Goal',
			label:'Hours per day',
			value:hoursPerDay,
			type:'integer',
			callback:onHoursPerDayChange
		},{
			section:'Goal',
			label:'Hours per week',
			value:hoursPerWeek,
			type:'integer',
			callback:onHoursPerWeekChange
		}]);
	};

	init();
};
