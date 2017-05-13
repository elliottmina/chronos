var JsonSummary = function() {

	var html = `
		<header>JSON</header>
		<div class="json"></div>
		<span class="copy button"><i class="fa fa-clipboard"></i> copy</span>`;

	var renderTo;
	var jsonContainer;
	var copyButton;

	var init = function() {
		build();
		addBehavior();
	};

	var build = function() {
		renderTo = $('#JsonSummary');
		renderTo.html(html);
		jsonContainer = renderTo.find('.json');
		copyButton = renderTo.find('.copy');
	};

	var addBehavior = function() {
		App.dispatcher.register('DATE_CHANGED', onDateChanged);
		App.dispatcher.register('SPAN_SAVED', onSpanSaved);
		App.dispatcher.register('SPAN_DELETED', onSpanDeleted);
		copyButton.click(copy);
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
		var el = jQuery('<textarea>')
			.appendTo(document.body)
			.val(jsonContainer.text())
			.select();
		document.execCommand('copy');
		el.remove();

		var clip = jQuery('<i class="fa fa-clipboard clipboard"></i>')
			.appendTo(renderTo)
		clip.animate(
			{ 
				'font-size':'20em', 
				'opacity':0,
				'left':'-0.2em'
			}, 
			200,
			'linear',
			function() {
				clip.remove();
			});
	};

	init();

};
