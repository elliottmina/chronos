var SpanCreator = function() {
	
	var guidGenerator;
	var timeUtil;
	var topContainer;
	var startTimeField;
	var finishTimeField;
	var projectSuggestor;
	var taskList;
	var validator;
	var record;
	var activeSpan;
	var saveAndRepeatButton;
	var editingIndicator;
	var stateSetter;
	var spanAssembler;
	var wipSaver;

	var init = function() {
		gatherDependencies();
		buildHtml();
		build();
		addBehavior();
		restoreWip();
	};

	var gatherDependencies = function() {
		guidGenerator = new GuidGenerator();
		timeUtil = new TimeUtil();
	};
	
	var buildHtml = function() {
		topContainer = jQuery('#SpanCreator');
		topContainer.html(SpanCreatorTemplate);
		saveAndRepeatButton = topContainer.find('.duplicate');
		editingIndicator = topContainer.find('.editing_indicator');
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
			new SpanCreatorRecentProjectBuilder(),
			new SpanCreatorTodaysProjectBuilder());

		taskList = new SpanCreatorTaskList(
			topContainer.find('.task_list'));

		validator = new SpanCreatorValidator();

		new SpanCreatorShortcuts(
			projectSuggestor, 
			save, 
			startTimeField, 
			finishTimeField,
			taskList);

		stateSetter = new SpanCreatorStateSetter(
			startTimeField,
			finishTimeField,
			projectSuggestor,
			taskList,
			topContainer.find('.save .text'),
			saveAndRepeatButton,
			editingIndicator,
			timeUtil);

		spanAssembler = new SpanCreatorSpanAssembler(
			startTimeField, 
			finishTimeField,
			taskList,
			projectSuggestor);

		wipSaver = new SpanCreatorWipSaver(spanAssembler);
	};

	var addBehavior = function() {
		saveAndRepeatButton.click(saveAndRepeat);
		App.dispatcher.register('DATE_CHANGED', onDateChanged);
		App.dispatcher.register('EDIT_SPAN_REQUESTED', onEditSpanRequested);
		App.dispatcher.register('REPEAT_SPAN_REQUESTED', onRepeatSpanRequested);
	};

	var save = function() {
		if (timeUtil.getYmd(new Date()) != record.date)
			confirmPreviousDate();
		else 
			submit();
	};

	var confirmPreviousDate = function() {
		new ModalDialogue({
			message:'This record is not for today.  Is that cool?',
			buttons:[{
				label:'No, not cool.',
				role:'secondary',
				autoClose:true
			},{
				label:'Yeah man, it\'s totally chill',
				role:'primary',
				autoClose:true,
				callback:submit
			}]
		});
	};

	var submit = function() {
		commitPartialWork();

		var span = spanAssembler.assemble();
		console.log(span.start);
		span.guid = activeSpan ? activeSpan.guid : guidGenerator.generate();

		if (validator.validate(span)) {
			App.dispatcher.update('SPAN_SUBMITTED', span);
			activeSpan = undefined;
			setTimeout(stateSetter.reset, 100);
		}
	};

	var commitPartialWork = function() {
		taskList.addCurrent();

		if (!finishTimeField.getTime()) {
			finishTimeField.now();
		}
	};

	var onDateChanged = function(data) {
		record = data;
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

	var restoreWip = function() {
		var span = wipSaver.get();
		if (span)
			stateSetter.restore(span);
	};

	init();

};
