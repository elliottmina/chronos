var ProjectSummary = function() {

	var html = `
		<header>Project summary</header>
		<div class="no_content_container">Nothing to see here.  Move along.</div>
		<table>
			<thead>
				<tr>
					<th class="project">Project</th>
					<th class="hours">Hours</th>
					<th class="time">Time</th>
					<th class="tasks">Tasks</th>
				</tr>
			</thead>
			<tbody></tbody>
		</table>`;

	var dataBuilder;
	var copier;
	var listEl;
	var noContentContainer;
	var spans;

	var init = function() {
		dataBuilder = new ProjectSummaryDataBuilder();
		copier = new Copier();
		build();
		addBehavior();

		itemBuilder = new ProjectSummaryItemBuilder(listEl, new Padder());
	};

	var build = function() {
		var renderTo = jQuery('#ProjectSummary');
		renderTo.html(html);
		listEl = renderTo.find('tbody');
		noContentContainer = renderTo.find('.no_content_container');
	};

	var addBehavior = function() {
		App.dispatcher.subscribe('DATE_CHANGED', onDateChanged);
		App.dispatcher.subscribe('SPAN_SAVED', onSpanSaved);
		App.dispatcher.subscribe('SPAN_DELETED', onSpanDeleted);
		App.dispatcher.subscribe('USE_DECIMAL_HOURS_CHANGE', populate);
	};

	var onDateChanged = function(date) {
		spans = date.spans;
		populate();
	};

	var onSpanSaved = function(data) {
		spans = data.record.spans;
		populate();
	};

	var onSpanDeleted = function(data) {
		spans = data.record.spans;
		populate();
	};

	var populate = function() {
		var summaryData = dataBuilder.build(spans);
		if (Object.keys(summaryData).length) {
			noContentContainer.hide();
			listEl.empty().show();
			jQuery.each(summaryData, itemBuilder.build);
		} else {
			noContentContainer.show();
			listEl.hide();
		}
	};

	init();

};
