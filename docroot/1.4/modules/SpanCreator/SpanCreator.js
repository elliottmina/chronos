var SpanCreator = function() {
  
  var guidGenerator;
  var timeUtil;
  var topContainer;
  var startTimeField;
  var finishTimeField;
  var elapsedMinutesIndicator;
  var projectSuggestor;
  var taskSuggestor;
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
    initState();
    addBehavior();
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

    const projSuggestionUl = jQuery('#SpanCreator .project_suggestions ul');
    const projectSuggestionTreatmenApplicator = new SpanCreatorProjectTreatmentApplicator();

    const projSuggestionList = new SpanCreatorSuggestionList(
      new RegEx(),
      jQuery('#SpanCreator input[name="project"]'), 
      projSuggestionUl, 
      projectSuggestionTreatmenApplicator,
      `<li class="suggestion">
        <i class="far fa-clock recent_indicator"></i>
        <i class="far fa-chevron-right selected_indicator"></i>
        <span class="text"></span>
      </li>`);

    projectSuggestor = new SpanCreatorProjectSuggestor(
      projSuggestionList,
      projSuggestionUl,
      new SpanCreatorRecentProjectBuilder(),
      timeUtil,
      projectSuggestionTreatmenApplicator);

    validator = new SpanCreatorValidator();

    const taskSuggestorInput = jQuery('.task_list input');
    const taskAvailableList = topContainer.find('.task_list .available');
    const taskSuggestorList = new SpanCreatorSuggestionList(
      new RegEx(),
      taskSuggestorInput, 
      taskAvailableList, 
      { apply: () => {} },
      `<li class="suggestion">
        <i class="far fa-chevron-right selected_indicator"></i>
        <span class="text"></span>
      </li>`)

    taskSuggestor = new SpanCreatorTaskSuggestor(
      taskAvailableList, 
      topContainer.find('.task_list .assigned'), 
      taskSuggestorInput,
      taskSuggestorList);

    spanAssembler = new SpanCreatorSpanAssembler(
      startTimeField, 
      finishTimeField,
      taskSuggestor,
      projectSuggestor);

    wipSaver = new SpanCreatorWipSaver(spanAssembler);

    stateSetter = new SpanCreatorStateSetter(
      startTimeField,
      finishTimeField,
      projectSuggestor,
      taskSuggestor,
      topContainer.find('.save .text'),
      saveAndRepeatButton,
      cancelButton,
      timeUtil);

    new SpanCreatorShortcuts(
      projectSuggestor, 
      save, 
      saveAndRepeat,
      startTimeField, 
      finishTimeField,
      taskSuggestor);
  };

  var initState = function() {
    var span = wipSaver.get();
    if (!span) {
      stateSetter.init();
      return;
    }

    if (span.project || span.tasks)
      stateSetter.restore(span);
    else
      stateSetter.init();
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
    App.dispatcher.publish('SPAN_EDIT_CANCELLED', activeSpan);
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
    return timeUtil.getLocalYmd(new Date()) == record.date;
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
    playRewardSound(span);
    elapsedMinutesIndicator.text('');
  };

  var buildSpan = function() {
    commitPartialWork();
    var span = spanAssembler.assemble();
    span.guid = activeSpan ? activeSpan.guid : guidGenerator.generate();
    return span;
  };

  var commitPartialWork = function() {
    taskSuggestor.addCurrent();

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

  var updateElapsedMinutes = function() {
    const start = startTimeField.getTime();
    var finish = finishTimeField.getTime();
    
    if (start == undefined) {
      elapsedMinutesIndicator.text('');
      return;
    }

    const now = new Date();

    if (finish != undefined) {
      finish.setFullYear(now.getFullYear());
      finish.setMonth(now.getMonth());
      finish.setDate(now.getDate());
    } else {
      finish = new Date();
    }

    start.setFullYear(now.getFullYear());
    start.setMonth(now.getMonth());
    start.setDate(now.getDate());

    const elapsedMillis = finish - start;
    const elapsed = timeUtil.formatTime(elapsedMillis/1000/60);
    
    elapsedMinutesIndicator.html(elapsed + ' <unit>hr</unit>');
  };

  var playRewardSound = function(span) {
    const minDelay = 50;
    const maxDelay = 125;
    const minVolume = 2;
    const maxVolume = 6;
    const minPlays = 1;;
    const maxPlays = 10;
    const qtyInterval = 15;

    const elapsedMinutes = (span.finish - span.start)/1000/60;
    var numPlays = Math.ceil(elapsedMinutes/qtyInterval)+minPlays;
    numPlays = Math.min(numPlays, maxPlays);

    var currDelay = 0;
    for (let i = 0; i < numPlays; i++) {
      setTimeout(() => {
        var sound = new Audio('modules/SpanCreator/reward4.wav');
        sound.volume = random(minVolume, maxVolume) * 0.1;
        sound.play()
      }, currDelay);

      currDelay += random(minDelay, maxDelay);
    }
  };

  var random = function(min, max) {
    return Math.random() * (max - min) + min;
  };

  init();

};
