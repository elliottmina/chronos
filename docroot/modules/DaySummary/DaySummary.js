var DaySummary = function() {

  var container;
  var summaryBuilder;
  var itemBuilder;
  var totalsBuilder;
  var timeUtil;
  var currDate;
  var cheersPlayed = [];

  var init = function() {
    gatherComponents();
    buildDependencies();
    addBehavior();
  };

  var gatherComponents = function() {
    container = document.getElementById('DaySummary');
  };

  var buildDependencies = function() {
    summaryBuilder = new SummaryBuilder();

    timeUtil = new TimeUtil();
   
    itemBuilder = new DaySummaryItemBuilder(
      timeUtil,
      new TimeFormatter12Hr(),
      new Copier(),
      new HeartBuilder(),
      new ProgressBarSetter(),
      container);

    totalsBuilder = new DaySummaryTotalsBuilder(
      timeUtil,
      new HeartBuilder(), 
      new ProgressBarSetter(),
      container);
  };

  var addBehavior = function() {
    App.dispatcher.subscribe('DATE_CHANGED', onDateChanged);
    App.dispatcher.subscribe('SPAN_SAVED', onSpansChanged);
    App.dispatcher.subscribe('SPAN_DELETED', onSpansChanged);
    App.dispatcher.subscribe('USE_DECIMAL_HOURS_CHANGED', updateDisplay);
    App.dispatcher.subscribe('PROJECT_SEGMENTOR_CHANGED', updateDisplay);
    App.dispatcher.subscribe('QUARTER_HOUR_CHANGED', updateDisplay);
    App.dispatcher.subscribe('GOAL_HOURS_DAY_CHANGED', updateDisplay);
  };

  var onDateChanged = function(date) {
    currDate = date.date;
    const summaries = summaryBuilder.build(date.spans);
    updateDisplay(summaries);
  };

  var onSpansChanged = function(data) {
    const summaries = summaryBuilder.build(data.record.spans);
    updateDisplay(summaries);
    considerVictory(summaries);
  };

  var updateDisplay = function(summaries) {
    empty();

    const totalRawMinutes = calcTotalMinutes(summaries, 'rawMinutes');
    const totalRoundedMinutes = calcTotalMinutes(summaries, 'roundedMinutes');

    var sortedKeys = Object.keys(summaries).sort();
    sortedKeys.forEach(key => itemBuilder.build(summaries[key], totalRawMinutes, totalRoundedMinutes));

    totalsBuilder.build(totalRawMinutes, totalRoundedMinutes);
  };

  var empty = function () {
    while (container.lastChild) {
      container.removeChild(container.lastChild);
    }
  };

  var calcTotalMinutes = function(summaries, key) {
    return Object.entries(summaries).reduce((total, [_, project]) => {
      return total + project[key];
    }, 0);
  };

  var considerVictory = function(summaries) {
    if (!isToday()) return;

    if (cheersPlayed.includes(currDate)) return;

    cheersPlayed.push(currDate);

    const totalMinutes = App.globalSettings.quarter_hour ? 
      calcTotalMinutes(summaries, 'roundedMinutes'): 
      calcTotalMinutes(summaries, 'rawMinutes');

    const goalMinutes = App.globalSettings.goal_hours_day * 60;
    if (totalMinutes >= goalMinutes) {
      const sound = new Audio('modules/DaySummary/cheering.wav');
      sound.volume = 0.6;
      sound.play()
    }

  };

  var isToday = function() {
    return currDate == timeUtil.getLocalYmd(new Date());
  };

  init();

};
