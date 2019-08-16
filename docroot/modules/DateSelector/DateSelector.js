var DateSelector = function() {

	var timeUtil;
	var topContainer;
	var dateInput;
	var duration = 200;
	var dialog;

	var html = `
		<span class="mini_button previous far fa-chevron-left"></span>
		<span class="mini_button next far fa-chevron-right"></span>
		<span class="mini_button picker_button far fa-calendar"></span>`;

	var dateHtml = `<input type="date" class="date_picker" />`;

	var init = function() {
		gatherDependencies();
		build();
		addBehavior();
	};
	
	var gatherDependencies = function() {
		timeUtil = new TimeUtil();
	};

	var build = function() {
		topContainer = jQuery('#DateSelector');
		topContainer.html(html);
	};

	var addBehavior = function() {
		topContainer.find('.picker_button').click(showDialogue);
		topContainer.find('.previous').click(previous);
		topContainer.find('.next').click(next);
		App.dispatcher.subscribe('DATE_CHANGED', onDateChanged);
	};

	var onDateChanged = function(data) {
		date = timeUtil.parseUtcYmd(data.date);
	};

	var next = function() {
		App.dispatcher.publish('DATE_SUBMITTED', timeUtil.getNewDayStr(date, 1));
	};

	var previous = function() {
		App.dispatcher.publish('DATE_SUBMITTED', timeUtil.getNewDayStr(date, -1));
	};

	var showDialogue = function() {
		currSelected = null;

		dialog = new ModalDialogue({
			message:'Select date',
			buttons:[{
				label:'Cancel',
				role:'secondary',
				autoClose:true
			}],
			contents:jQuery(dateHtml)
		});

		jQuery('.ModalDialogue input.date_picker').change(onDatePickerChange);
	};

	var onDatePickerChange = function() {
		var date = jQuery(this).val();
		if (date) {
			dialog.close();
			App.dispatcher.publish('DATE_SUBMITTED', date);
		}
	};

	init();
};
