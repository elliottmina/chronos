var JsonSummary = function() {

	var html = `
		<header>JSON</header>
		<div class="json"></div>
		<span class="copy button"><i class="fa fa-copy"></i> <span class="text">copy<span></span>`;

	var renderTo;
	var jsonContainer;
	var button;
	var buttonText;
	var copier;

	var init = function() {
		build();
		addBehavior();
	};

	var build = function() {
		copier = new Copier();
		renderTo = $('#JsonSummary');
		renderTo.html(html);
		jsonContainer = renderTo.find('.json');
		button = renderTo.find('.copy');
		buttonText = button.find('.text');
	};

	var addBehavior = function() {
		App.dispatcher.register('DATE_CHANGED', onDateChanged);
		App.dispatcher.register('SPAN_SAVED', onSpanSaved);
		App.dispatcher.register('SPAN_DELETED', onSpanDeleted);
		button.click(copy);
	};

	var onDateChanged = function(date) {
		populate(date.spans);
	};

	var onSpanSaved = function(data) {
		populate(data.record.spans);
	};

	var onSpanDeleted = function(data) {
		populate(data.record.spans);
	};

	var populate = function(spans) {
		jsonContainer.text(JSON.stringify(spans, null, 2));
	};

	var copy = function() {
		copier.copy(jsonContainer.text());
		buttonText.text('copied!');
		setTimeout(function() {
			buttonText.text('copy');
		}, 1000);
	};

	init();

};
