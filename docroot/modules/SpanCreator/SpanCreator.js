var SpanCreator = function() {
	
	var guidGenerator;
	var timeUtil;
	var topContainer;
	var startTimeField;
	var finishTimeField;
	var projectSuggestor;
	var taskList;
	var validator;
	var date;
	var record;
	var activeSpan;

	var init = function() {
		gatherDependencies();
		buildHtml();
		build();
		addBehavior();
	};

	var gatherDependencies = function() {
		guidGenerator = new GuidGenerator();
		timeUtil = new TimeUtil();
	};
	
	var buildHtml = function() {
		topContainer = $('#SpanCreator');
		topContainer.html(SpanCreatorTemplate);
	};

	var build = function() {

		var analyzer = new SpanCreatorAnalyzer();
		var timeResolver = new SpanCreatorTimeResolver(analyzer);

		startTimeField = new SpanCreatorTimeField(
			topContainer.find('.start .time_field_container'),
			analyzer,
			timeResolver,
			timeUtil);

		finishTimeField = new SpanCreatorTimeField(
			topContainer.find('.finish .time_field_container'),
			analyzer,
			timeResolver,
			timeUtil);

		projectSuggestor = new SpanCreatorProjectSuggestor(
			new SpanCreatorRecentProjectBuilder());

		taskList = new SpanCreatorTaskList(
			topContainer.find('.task_list'));

		validator = new SpanCreatorValidator();
	};

	var addBehavior = function() {
		topContainer.find('.save')
			.click(save)
			.keyup(onSaveKeyUp);
		topContainer.find('.duplicate')
			.click(duplicate);
		jQuery(document).keydown(onKeyDown);
		App.dispatcher.register('DATE_CHANGED', onDateChanged);
		App.dispatcher.register('DATE_EDIT_REQUESTED', onDateEditRequested);
	};

	var onKeyDown = function(e) {
		if (e.key == 's' && e.metaKey) {
			e.stopPropagation();
			e.preventDefault();
			save();
		}

		if (e.key == 'p' && e.metaKey) {
			e.stopPropagation();
			e.preventDefault();
			projectSuggestor.focus();
		}
	};

	var onSaveKeyUp = function(e) {
		if (e.key == 'Enter' || e.key == ' ')
			save();
	};

	var save = function() {
		submit();
		prepareNext();
	};

	var submit = function() {
		var span = {
			start:startTimeField.getTime(),
			finish:getFinishDate(),
			project:projectSuggestor.getProject(),
			tasks:taskList.getTasks(),
			guid:activeSpan ? activeSpan.guid : guidGenerator.generate()
		};

		if (!validator.validate(span))
			return false;
		
		App.dispatcher.update('SPAN_SUBMITTED', span);
		activeSpan = undefined;
		return true;
	};

	var getFinishDate = function() {
		var finish = finishTimeField.getTime();
		if (finish)
			return finish;

		var now = new Date();
		now.setFullYear(date.getFullYear());
		now.setMonth(date.getMonth());
		now.setDate(date.getDate());
		return now;
	};

	var onDateChanged = function(data) {
		record = data;
		date = timeUtil.parseUtcYmd(data.date);
	};

	var prepareNext = function() {
		startTimeField.now();
		finishTimeField.clear();
		projectSuggestor.clear();
		taskList.clear();
		projectSuggestor.focus();
	};

	 var onDateEditRequested = function(guid) {
	 	activeSpan = record.spans[guid];
	 	startTimeField.setTime(activeSpan.start);
	 	finishTimeField.setTime(activeSpan.finish);
	 	projectSuggestor.set(activeSpan.project);
	 	taskList.setTasks(activeSpan.tasks);
	 };

	var duplicate = function() {
		submit();
		startTimeField.now();
		finishTimeField.clear();
	};

	init();

};
