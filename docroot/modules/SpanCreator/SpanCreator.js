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
	var saveAndRepeatButton;
	var stateSetter;

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
		saveAndRepeatButton = topContainer.find('.duplicate');
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

		new SpanCreatorShortcuts(
			topContainer.find('.toggle_hotkeys'),
			projectSuggestor, 
			topContainer.find('.save'), 
			save, 
			startTimeField, 
			finishTimeField);

		stateSetter = new SpanCreatorStateSetter(
			startTimeField,
			finishTimeField,
			projectSuggestor,
			taskList,
			topContainer.find('.save .text'),
			saveAndRepeatButton);
	};

	var addBehavior = function() {
		saveAndRepeatButton.click(saveAndRepeat);
		App.dispatcher.register('DATE_CHANGED', onDateChanged);
		App.dispatcher.register('EDIT_SPAN_REQUESTED', onEditSpanRequested);
		App.dispatcher.register('REPEAT_SPAN_REQUESTED', onRepeatSpanRequested);
	};


	var save = function() {
		if (submit())
			stateSetter.reset();
	};

	var submit = function() {
		taskList.addCurrent();
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

	var onEditSpanRequested = function(guid) {
		activeSpan = record.spans[guid];
		stateSetter.edit(activeSpan);
	};

	var onRepeatSpanRequested = function(guid) {
		stateSetter.repeat(record.spans[guid]);
	};

	var saveAndRepeat = function() {
		submit();
		startTimeField.now();
		finishTimeField.clear();
	};

	init();

};
