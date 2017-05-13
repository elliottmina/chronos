var ProjectSummaryDataBuilder = function() {

	var projects = {};

	var processSpan = function(index, span) {
		initProject(span);

		var project = projects[span.project.toLowerCase()];

		project.time += (span.finish - span.start)/1000/60;

		jQuery.each(span.tasks, function(index, task) {
			if (jQuery.inArray(task, project.tasks) == -1) {
				project.tasks.push(task);
			}
		})
	};

	var initProject = function(span) {
		if (projects[span.project])
			return;

		projects[span.project.toLowerCase()] = {
			label:span.project,
			time:0,
			tasks:[]
		};
	};

	return {
		build:function(spans) {
			projects = {};
			jQuery.each(spans, processSpan);
			return projects;
		}
	}
};
