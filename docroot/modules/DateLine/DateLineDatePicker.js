var DateLineDatePicker = function(renderTo) {

	var duration = 200;
	var dateInput;
	var currDateContainer;
	var pickerContainer;
	var cancelButton;

	var init = function() {
		build();
		addBehavior();
	};
	
	var build = function() {
		dateInput = renderTo.find('input[type="date"]');
		currDateContainer = renderTo.find('.curr_date');
		pickerContainer = renderTo.find('.picker');
		cancelButton = renderTo.find('.cancel');
	};

	var addBehavior = function() {
		renderTo.find('.picker_button').click(show);
		cancelButton.click(hide);
		dateInput.change(onDateChange);
	};

	var show = function() {
		currDateContainer.animate({
			'left':'-' + currDateContainer.width() + 'px'
		}, duration);
		pickerContainer.animate({
			'left':'0px'
		}, duration);
	};

	var hide = function() {
		currDateContainer.animate({
			'left':'0px'
		}, duration);
		pickerContainer.animate({
			'left':currDateContainer.width() + 'px'
		}, duration);
	};

	var onDateChange = function() {
		hide();
		App.dispatcher.update('DATE_SUBMITTED', dateInput.val());
	};

	init();
};
