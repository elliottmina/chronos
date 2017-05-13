var DateLine = function() {

	var html = `
		<div class="curr_date">
			<div class="pos_wrapper">
				<h1></h1>
				<h2><span class="day"></span></h2>
				<div class="button_container">
					<span class="button previous fa fa-chevron-left"></span>
					<span class="button next fa fa-chevron-right"></span>
					<span class="button picker_button fa fa-calendar-o"></span>
				</div>
			</div>
		</div>
		<div class="picker">
			<input type="date" />
			<div class="button_container">
				<span class="button cancel"><i class="fa fa-ban"></i></span>
			</div>
		</div>`;
	
	var topContainer;
	var dateContainer;
	var dayOfWeekContainer;
	var padder;
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
		padder = new Padder();
		timeUtil = new TimeUtil();
	};

	var build = function() {
		topContainer = $('#DateLine');
		topContainer.html(html);
		dayOfWeekContainer = topContainer.find('h1');
		dateContainer = topContainer.find('h2');
		new DateLineDatePicker(topContainer);
	};

	var addBehavior = function() {
		App.dispatcher.register('DATE_CHANGED', onDateChanged);

		var topContainer = jQuery('#DateLine');
		topContainer.find('.previous').click(previous);
		topContainer.find('.next').click(next);
	};

	var next = function() {
		App.dispatcher.update('DATE_SUBMITTED', timeUtil.getNewDayStr(date, 1));
	};

	var previous = function() {
		App.dispatcher.update('DATE_SUBMITTED', timeUtil.getNewDayStr(date, -1));
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
