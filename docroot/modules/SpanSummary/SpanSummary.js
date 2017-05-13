var SpanSummary = function() {

	var html = `
		<header>Spans</header>
		<div class="no_content_container">Nothing to see here.  Move along.</div>
		<div class="spans"></div>`;

	var spanTemplate = `
		<div class="span">
			<div class="time">
				<span class="start_time"></span>
				<span class="finish_time"></span>
				<span class="elapsed"></span>
				<span class="button edit fa fa-pencil"></span>
				<span class="button delete fa fa-trash"></span>
			</div>
			<div>
				<div class="project">
					<i class="fa fa-folder-o"></i>
					<span class="target"></span>
				</div>
				<ul></ul>
			</div>
		</div>`;

	var spansContainer;
	var nonContentContainer;
	var timeFormatter;
	var roundDecimal;
	var padder;
	var spanMap = {};

	var init = function() {
		getDependencies();
		build();
		addBehavior();
	};

	var getDependencies = function() {
		timeFormatter = new TimeFormatter12Hr();
		roundDecimal = Rounder.roundDecimal;
		padder = new Padder();
	};

	var build = function() {
		var renderTo = $('#SpanSummary');
		renderTo.html(html);
		spansContainer = renderTo.find('.spans');
		noContentContainer = renderTo.find('.no_content_container');
	};

	var addBehavior = function() {
		App.dispatcher.register('DATE_CHANGED', onDateChanged);
		App.dispatcher.register('SPAN_SAVED', onSpanSaved);
		App.dispatcher.register('SPAN_DELETED', onSpanDeleted);
	};

	var onDateChanged = function(data) {
		noContentContainer.show();
		spansContainer.empty();
		spanMap = {};
		jQuery.each(data.spans, function(index, span) {
			addSpan(span)
		});
	};

	var onSpanSaved = function(data) {
		var span = data.span;
		var container = spanMap[span.guid];
		if (container)
			populateSpan(span, container);
		else
			addSpan(span);
		spansContainer.find('.selected').removeClass('selected');
	};

	var addSpan = function(span) {
		noContentContainer.hide();
		var container = $(spanTemplate).appendTo(spansContainer);
		spanMap[span.guid] = container;
		populateSpan(span, container);
	};

	var populateSpan = function(span, container) {
		var elapsed = (span.finish - span.start)/1000/60/60;
		var elapsedDecimal = roundDecimal(elapsed, 2)
		var elapsedHours = Math.floor(elapsed);
		var elapsedMinutes = padder.twoDigit(Math.floor((elapsed % 1) * 60));

		container.find('.edit')
			.data('guid', span.guid)
			.click(editSpan);
		container.find('.delete')
			.data('guid', span.guid)
			.click(deleteSpan);
		container.find('.start_time').text(timeFormatter.format(span.start));
		container.find('.finish_time').text(timeFormatter.format(span.finish));
		container.find('.project .target').text(span.project);
		container.find('.elapsed').text(
			elapsedHours + ':' + elapsedMinutes + 
			' (' + elapsedDecimal + ' hrs)');

		var taskContainer = container.find('ul');
		taskContainer.empty();
		jQuery.each(span.tasks, function(index, task) {
			var li = $('<li>')
				.appendTo(taskContainer)
				.text(task);
		});
	};

	var editSpan = function() {
		var el = jQuery(this);
		var guid = el.data('guid');
		App.dispatcher.update('DATE_EDIT_REQUESTED', guid);
		el.closest('.span').addClass('selected');
	};

	var deleteSpan = function() {
		var guid = jQuery(this).data('guid');
		App.dispatcher.update('DELETE_SPAN_REQUESTED', guid);
	};

	var onSpanDeleted = function(data) {
		var guid = data.span.guid;
		spanMap[guid].remove();
		delete(spanMap[guid]);
		if (spansContainer.children().length == 0)
			noContentContainer.show();
	};

	init();

};
