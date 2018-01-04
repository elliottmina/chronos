var TextSummary = function() {

	var html = `
		<header>Text</header>
		<div class="plain_text"></div>
		<span class="copy button"><i class="fa fa-copy"></i> <span class="text">copy<span></span>`;

	var renderTo;
	var textContainer;
	var button;
	var buttonText;
	var copier;
	var dataBuilder;

	var init = function() {
		build();
		addBehavior();
	};

	var build = function() {
		copier = new Copier();
		dataBuilder = new ProjectSummaryDataBuilder();
		renderTo = jQuery('#TextSummary');
		renderTo.html(html);
		textContainer = renderTo.find('.plain_text');
		button = renderTo.find('.copy');
		buttonText = button.find('.text');
	};

	var addBehavior = function() {
		App.dispatcher.register('DATE_CHANGED', onDateChanged);
		App.dispatcher.register('SPAN_SAVED', onSpanSaved);
		App.dispatcher.register('SPAN_DELETED', onSpanDeleted);
		button.click(copy);
	};

	var onDateChanged = function(record) {
		populate(record);
	};

	var onSpanSaved = function(data) {
		populate(data.record);
	};

	var onSpanDeleted = function(data) {
		populate(data.record);
	};

	var populate = function(record) {
		var text = record.date + '\n\n';
		
		var summaryData = dataBuilder.build(record.spans);
		for (var key in summaryData) {
			var data = summaryData[key];	

			text += data.label + ', ' + formatHours(data.time) + ' hrs\n';
			text += '* ' + data.tasks.join('\n* ');
			text += '\n\n'; 
		}


		textContainer.text(text);
		console.log(summaryData);

	};

	var formatHours = function(minutes) {
		return round(minutes/60, 2);
	};

	var round = function(number, precision) {
		var factor = Math.pow(10, precision);
		var tempNumber = number * factor;
		var roundedTempNumber = Math.round(tempNumber);
		return roundedTempNumber / factor;
	};

	var copy = function() {
		copier.copy(textContainer.text());
		buttonText.text('copied!');
		setTimeout(function() {
			buttonText.text('copy');
		}, 1000);
	};

	init();

};
