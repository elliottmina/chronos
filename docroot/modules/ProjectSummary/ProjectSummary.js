var ProjectSummary = function() {

	var itemTemplate = `
		<tr>
			<td class="project"></td>
			<td class="hours"></td>
			<td class="time"></td>
			<td class="tasks"><ul class="task_list"></ul></td>
		</li>
	`;

	var copyTemplate = `
		<li class="copy">
			<span class="copy button">
				<i class="far fa-copy"></i>
			</span>
		</li>`;
	
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
	var padder;
	var copier;
	var listEl;
	var noContentContainer;

	var init = function() {
		dataBuilder = new ProjectSummaryDataBuilder();
		padder = new Padder();
		copier = new Copier();
		build();
		addBehavior();
	};

	var build = function() {
		var renderTo = jQuery('#ProjectSummary');
		renderTo.html(html);
		listEl = renderTo.find('tbody');
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
		var itemContainer = jQuery(itemTemplate)
			.appendTo(listEl);

		itemContainer.find('.project').text(project.label);
		itemContainer.find('.hours').text(formatHours(project.time));
		itemContainer.find('.time').text(formatTime(project.time));
		
		var tasksContainer = itemContainer.find('ul');
		jQuery.each(project.tasks, function(index, task) {
			jQuery('<li>')
				.appendTo(tasksContainer)
				.text(task);
		});

		var li = jQuery(copyTemplate)
			.appendTo(tasksContainer)
			.click(copy)
			.data('tasks', project.tasks);
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

	var copy = function() {
		var text = jQuery(this).data('tasks').join('\n');
		copier.copy(text);
	};

	init();

};
