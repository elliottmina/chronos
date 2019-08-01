var SpanCreatorTimeField = function(
	topContainer, 
	analyzer, 
	timeResolver,
	timeUtil) {
	
	var topContainer;
	var date; 
	var timeEl;
	var periodEl;
	var nowButton;
	var ONE_MINUTE = 60*1000;
	var integers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

	var init = function() {
		gatherComponents();
		addBehavior();
	};

	var gatherComponents = function() {
		timeEl = topContainer.find('.time');
		periodEl = topContainer.find('.period');
		nowButton = topContainer.find('button.now');
	};

	var addBehavior = function() {
		App.dispatcher.register('DATE_CHANGED', onDateChanged);
		timeEl
			.keydown(onKeyDown)
			.blur(onBlur)
			.focus(onFocus);
		periodEl.click(togglePeriod);
		nowButton.click(now);
	};

	var onDateChanged = function(data) {
		date = timeUtil.parseUtcYmd(data.date);
	};

	var onFocus = function() {
		topContainer.addClass('has_focus');
	};

	var onBlur = function() {
		topContainer.removeClass('has_focus');
		timeEl.text(timeResolver.resolve(timeEl.text()));
		adjustInvalidTreatment();
	};

	var onKeyDown = function(e) {
		switch (e.key) {

			case 'a':
			case 'A':
				setPeriodAm();
				break;

			case 'p':
			case 'P':
				setPeriodPm();
				break;

			case 'Backspace':
				removeChar();
				break;

			case ':':
				addColon();
				break;

			case 'n':
				now();
				break;

			case 'ArrowUp':
				minuteUp(e);
				break;

			case 'ArrowDown':
				minuteDown(e);
				break;

			case '0':
			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
			case '8':
			case '9':
				addNumber(e.key);
				break;
		}

		App.dispatcher.update('SPAN_CHANGED');
	};

	var minuteUp = function(e) {
		adjustMinute(e, 1);
	};

	var minuteDown = function(e) {
		adjustMinute(e, -1);
	};

	var adjustMinute = function(e, valueFlipper) {
		if (!isEmpty() && !isValid())
			return;

		e.preventDefault();
		var delta = ONE_MINUTE*valueFlipper;
		var oldDate = isEmpty() ? getNow() : getTimeFromElements();
		var newDate = new Date(oldDate.getTime() + delta);
		setTime(newDate);
	};

	var setTime = function(dateObj) {
		var munged = timeUtil.get12Hour(dateObj);
		timeEl.text(munged.time);
		if (munged.period == 'AM')
			setPeriodAm();
		else
			setPeriodPm();
		checkForFix();
	};

	var removeChar = function() {
		var text = timeEl.text();
		if (text.length > 0)
			timeEl.text(text.substr(0, text.length -1));
	};

	var addNumber = function(key) {
		var text = timeEl.text();
		if (analyzer.isNumerable(text)) {
			timeEl.text(text + key);
			checkForFix();
			checkForErrorOnCompletion();
		}
	};

	var addColon = function() {
		var text = timeEl.text();
		if (analyzer.isColonable(text))
			timeEl.text(text + ':');
	};

	var setPeriodAm = function() {
		periodEl.text('AM');
	};

	var setPeriodPm = function() {
		periodEl.text('PM');
	};

	var togglePeriod = function() {
		if (periodEl.text() == 'AM')
			periodEl.text('PM');
		else 
			periodEl.text('AM');
		App.dispatcher.update('SPAN_CHANGED');
	};

	var checkForErrorOnCompletion = function() {
		var timeStr = timeEl.text();
		if (analyzer.isCorrectFormat(timeStr) && !isValid())
			timeEl.addClass('error');
	};

	var adjustInvalidTreatment = function() {
		if (isValid())
			timeEl.removeClass('error');
		else
			timeEl.addClass('error');
	};

	var isValid = function() {
		return analyzer.isValid(timeEl.text());
	};

	var isEmpty = function() {
		return timeEl.text() == '';
	};

	var checkForFix = function() {
		if (timeEl.hasClass('error') && isValid())
			timeEl.removeClass('error')
	};

	var now = function() {
		setTime(new Date());
		timeEl.focus();
		App.dispatcher.update('SPAN_CHANGED');
	};

	var getTimeFromElements = function() {
		if (!date)
			return;
		
		var dateCopy = new Date(date.getTime());

		var parts = timeEl.text().split(':');
		dateCopy.setMinutes(parts[1]);

		var hours = parseInt(parts[0]);
		if (periodEl.text() == 'PM' && hours != 12)
			 hours += 12;
		if (periodEl.text() == 'AM' && hours == 12)
			hours = 0;
		dateCopy.setHours(hours);

		return dateCopy;
	};

	var getNow = function() {
		var nowDate = new Date();
		var dateCopy = new Date(date.getTime());
		dateCopy.setHours(nowDate.getHours());
		dateCopy.setMinutes(nowDate.getMinutes());
		return dateCopy;
	};

	init();

	return {
		getTime:function() {
			adjustInvalidTreatment();
			if (!isValid())
				return;

			if (isEmpty())
				return;

			return getTimeFromElements();
		},
		clear:function() {
			timeEl.text('');

			var date = new Date();
			if (date.getHours() >= 12)
				setPeriodPm();
			else
				setPeriodAm();
		},
		now:now,
		setTime:setTime,
		focus:function() {
			timeEl.focus();
		}
	};
};
