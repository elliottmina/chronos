var SpanCreator = function() {
  
  var guidGenerator;
  var timeUtil;
  var topContainer;
  var startTimeField;
  var finishTimeField;
  var elapsedMinutesIndicator;
  var projectSuggestor;
  var taskList;
  var validator;
  var record;
  var activeSpan;
  var saveAndRepeatButton;
  var cancelButton;
  var stateSetter;
  var spanAssembler;
  var wipSaver;

  var init = function() {
    gatherDependencies();
    buildHtml();
    build();
    stateSetter.reset();
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
    cancelButton = topContainer.find('.cancel');
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

    elapsedMinutesIndicator = topContainer.find('.elapsed_minutes');

    projectSuggestor = new SpanCreatorProjectSuggestor(
      new SpanCreatorRecentProjectBuilder(),
      new SpanCreatorTodaysProjectBuilder(),
      new RegEx());

    taskList = new SpanCreatorTaskList(
      topContainer.find('.task_list'));

    validator = new SpanCreatorValidator();

    new SpanCreatorShortcuts(
      projectSuggestor, 
      save, 
      saveAndRepeat,
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
      cancelButton,
      timeUtil);

    spanAssembler = new SpanCreatorSpanAssembler(
      startTimeField, 
      finishTimeField,
      taskList,
      projectSuggestor);

    wipSaver = new SpanCreatorWipSaver(spanAssembler);
  };

  var addBehavior = function() {
    jQuery('#SpanCreator').find('.save').click(save);
    saveAndRepeatButton.click(saveAndRepeat);
    cancelButton.click(cancel);
    App.dispatcher.subscribe('DATE_CHANGED', onDateChanged);
    App.dispatcher.subscribe('EDIT_SPAN_REQUESTED', onEditSpanRequested);
    App.dispatcher.subscribe('REPEAT_SPAN_REQUESTED', onRepeatSpanRequested);
    topContainer.find('.hotkeys_button').click(function() {
      topContainer.find('section.hotkeys').toggleClass('active');
    });
    setInterval(updateElapsedMinutes, 1000*60);
  };

  var cancel = function() {
    activeSpan = undefined;
    stateSetter.reset();
  };

  var save = function() {
    preSubmit(resetCleanup);
  };

  var resetCleanup = function() {
    setTimeout(stateSetter.reset, 100);
  };

  var saveAndRepeat = function() {
    preSubmit(repeatCleanup);
  };

  var repeatCleanup = function(span) {
    stateSetter.repeat(span);
  };

  var preSubmit = function(cleanupFunc) {
    if (isToday())
      submit(cleanupFunc);
    else 
      confirmPreviousDate(cleanupFunc);
  };

  var isToday = function() {
    return timeUtil.getYmd(new Date()) == record.date;
  };

  var confirmPreviousDate = function(cleanupFunc) {
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
        callback:function() { submit(cleanupFunc); }
      }]
    });
  };

  var submit = function(cleanupFunc) {
    var span = buildSpan();
    if (!validator.validate(span))
      return;

    App.dispatcher.publish('SPAN_SUBMITTED', span);
    activeSpan = undefined;
    cleanupFunc(span);
  };

  var buildSpan = function() {
    commitPartialWork();
    var span = spanAssembler.assemble();
    span.guid = activeSpan ? activeSpan.guid : guidGenerator.generate();
    return span;
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

  var restoreWip = function() {
    var span = wipSaver.get();
    if (span)
      stateSetter.restore(span);
  };

  var updateElapsedMinutes = function() {
    const start = startTimeField.getTime();
    const finish = finishTimeField.getTime();
    if (start == undefined || finish != undefined) {
      elapsedMinutesIndicator.text('');
      return;
    }

    const now = new Date();
    start.setFullYear(now.getFullYear());
    start.setMonth(now.getMonth());
    start.setDate(now.getDate());

    const elapsedMillis = now - start;
    const elapsed = timeUtil.formatTime(elapsedMillis/1000/60);
    
    elapsedMinutesIndicator.text(elapsed);
  };

  init();

};
