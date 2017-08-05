var ProjectSummary = function() {

	var itemTemplate = `
		<li class="summary_item widget">
			<header></header>
			<div>
				<span class="hours"></span>
				<span class="time"></span>
			</div>
			<ul class="tasks"></ul>
		</li>
	`;
	
	var html = `
		<header>Project summary</header>
		<div class="no_content_container">Nothing to see here.  Move along.</div>
		<ul class="projects"></ul>`;

	var dataBuilder;
	var listEl;
	var noContentContainer;

	var init = function() {
		dataBuilder = new ProjectSummaryDataBuilder();
		padder = new Padder();
		build();
		addBehavior();
	};

	var build = function() {
		var renderTo = $('#ProjectSummary');
		renderTo.html(html);
		listEl = renderTo.find('ul.projects');
		noContentContainer = renderTo.find('.no_content_container');
	};

	var addBehavior = function() {
		App.dispatcher.register('DATE_CHANGED', onDateChanged);
		App.dispatcher.register('SPAN_SAVED', onSpanSaved);
		App.dispatcher.register('SPAN_DELETED', onSpanDeleted);
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
		var summaryData = dataBuilder.build(spans);
		if (Object.keys(summaryData).length) {
			noContentContainer.hide();
			listEl.empty().show();
			jQuery.each(summaryData, addProject);
		} else {
			noContentContainer.show();
			listEl.hide();
		}
	};

	var addProject = function(key, project) {
		var itemContainer = $(itemTemplate)
			.appendTo(listEl);

		itemContainer.find('header').text(project.label);
		itemContainer.find('.hours').text(formatHours(project.time));
		itemContainer.find('.time').text(formatTime(project.time));
		
		var tasksContainer = itemContainer.find('.tasks');
		jQuery.each(project.tasks, function(index, task) {
			$('<li>')
				.appendTo(tasksContainer)
				.text(task);
		});
	};

	var formatTime = function(minutes) {
		var hours = parseInt(minutes/60);
		var remainder = Math.ceil(minutes%60);
		remainder = padder.twoDigit(remainder);
		return hours + ':' + remainder;
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

	init();

};
