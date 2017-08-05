var DateLine = function() {

	var html = `
		<h1></h1>
		<h2><span class="day"></span></h2>`;
	
	var topContainer;
	var dateContainer;
	var dayOfWeekContainer;
	var timeUtil;
	var date;

	var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 
		'Thursday', 'Friday', 'Saturday'];
	var months = ['January', 'February', 'March', 'April', 'May', 'June',
  		'July', 'August', 'September', 'October', 'November', 'December'];
	
	var init = function() {
		gatherDependencies();
		build();
		addBehavior();
	};

	var gatherDependencies = function() {
		timeUtil = new TimeUtil();
	};

	var build = function() {
		topContainer = $('#DateLine');
		topContainer.html(html);
		dayOfWeekContainer = topContainer.find('h1');
		dateContainer = topContainer.find('h2');
	};

	var addBehavior = function() {
		App.dispatcher.register('DATE_CHANGED', onDateChanged);
	};

	var onDateChanged = function(data) {
		date = timeUtil.parseUtcYmd(data.date);

		dateContainer.text(
			months[date.getUTCMonth()] + ' ' +
			date.getUTCDate());

		dayOfWeekContainer.text(days[date.getUTCDay()]);

		if (data.date == timeUtil.getYmd(new Date()))
			topContainer.addClass('today');
		else 
			topContainer.removeClass('today');
	};

	init();

};
