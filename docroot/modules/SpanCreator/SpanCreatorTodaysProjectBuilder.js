var SpanCreatorTodaysProjectBuilder = function() {
	
	var timeUtil;

	var init = function() {
		timeUtil = new TimeUtil();
	};

	init();

	return {
		build:function() {
			var today = App.persister.fetch(timeUtil.getYmd(new Date()));
			projects = [];
			jQuery.each(today.spans, function(index, span) {
				if (jQuery.inArray(span.project, projects) == -1)
					projects.push(span.project);
			});
			return projects;
		}
	};
};
