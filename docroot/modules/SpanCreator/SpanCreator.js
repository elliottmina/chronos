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
	var saveButton;
	var saveButtonText;
	var saveAndRepeatButton;

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
		saveButton = topContainer.find('.save');
		saveButtonText = saveButton.find('.text')
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
	};

	var addBehavior = function() {
		saveButton.click(save).keyup(onSaveKeyUp);
		saveAndRepeatButton.click(saveAndRepeat);
		jQuery(document).keydown(onKeyDown);
		App.dispatcher.register('DATE_CHANGED', onDateChanged);
		App.dispatcher.register('EDIT_SPAN_REQUESTED', onEditSpanRequested);
		App.dispatcher.register('REPEAT_SPAN_REQUESTED', onRepeatSpanRequested);
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

	var prepareNext = function() {
		startTimeField.now();
		finishTimeField.clear();
		projectSuggestor.clear();
		taskList.clear();
		projectSuggestor.focus();
		saveButtonText.text('Create');
		saveAndRepeatButton.show();
	};

	var onEditSpanRequested = function(guid) {
		activeSpan = record.spans[guid];
		startTimeField.setTime(activeSpan.start);
		finishTimeField.setTime(activeSpan.finish);
		projectSuggestor.set(activeSpan.project);
		taskList.setTasks(activeSpan.tasks);
		saveButtonText.text('Save');
		saveAndRepeatButton.hide();
	};

	var onRepeatSpanRequested = function(guid) {
		var span = record.spans[guid];
		startTimeField.now();
		finishTimeField.clear();
		projectSuggestor.set(span.project);
		taskList.setTasks(span.tasks);
		saveButtonText.text('Create');
		saveAndRepeatButton.show();
	};

	var saveAndRepeat = function() {
		submit();
		startTimeField.now();
		finishTimeField.clear();
	};

	init();

};
